'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import { signIn, signOut } from '@/auth';

export type AuthActionState = { error?: string } | undefined;

const registerSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export async function register(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: (formData.get('name') as string) || undefined,
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'Invalid input.' };

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: 'Email already registered.' };

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.create({ data: { email, name, passwordHash } });

  // Sign the new user in (throws a redirect on success).
  await signIn('credentials', { email, password, redirectTo: '/account' });
}

export async function login(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/account',
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Invalid email or password.' };
    throw error; // re-throw redirect / other errors
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
