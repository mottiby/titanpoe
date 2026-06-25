'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

import { login, type AuthActionState } from '@/lib/auth/actions';

export function SignInForm() {
  const t = useTranslations('Auth');
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    login,
    undefined,
  );

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-12">
      <Link
        href="/"
        className="text-center font-display text-xl font-semibold tracking-tight"
      >
        Titan<span className="text-primary">poe2</span>
      </Link>
      <Card className="mt-6 p-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {t('signInTitle')}
        </h1>
        <form action={formAction} className="mt-5 space-y-4">
          <Input name="email" type="email" required placeholder={t('email')} />
          <Input
            name="password"
            type="password"
            required
            placeholder={t('password')}
          />
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {t('signInCta')}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-primary hover:underline">
            {t('signUpCta')}
          </Link>
        </p>
      </Card>
      <p className="mt-4 text-center text-xs text-muted-foreground">{t('trustNote')}</p>
    </main>
  );
}
