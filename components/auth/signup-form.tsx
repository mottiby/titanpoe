'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { register, type AuthActionState } from '@/lib/auth/actions';

export function SignUpForm() {
  const t = useTranslations('Auth');
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    register,
    undefined,
  );

  return (
    <form action={formAction} className="mx-auto mt-16 max-w-sm space-y-4 px-6">
      <h1 className="text-2xl font-bold">{t('signUpTitle')}</h1>
      <input
        name="name"
        type="text"
        placeholder={t('name')}
        className="w-full rounded-md border px-3 py-2"
      />
      <input
        name="email"
        type="email"
        required
        placeholder={t('email')}
        className="w-full rounded-md border px-3 py-2"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder={t('password')}
        className="w-full rounded-md border px-3 py-2"
      />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {t('signUpCta')}
      </Button>
      <p className="text-sm text-muted-foreground">
        {t('haveAccount')}{' '}
        <Link href="/signin" className="underline">
          {t('signInCta')}
        </Link>
      </p>
    </form>
  );
}
