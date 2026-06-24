'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { login, type AuthActionState } from '@/lib/auth/actions';

export function SignInForm() {
  const t = useTranslations('Auth');
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={formAction} className="mx-auto mt-16 max-w-sm space-y-4 px-6">
      <h1 className="text-2xl font-bold">{t('signInTitle')}</h1>
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
        placeholder={t('password')}
        className="w-full rounded-md border px-3 py-2"
      />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {t('signInCta')}
      </Button>
      <p className="text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/signup" className="underline">
          {t('signUpCta')}
        </Link>
      </p>
    </form>
  );
}
