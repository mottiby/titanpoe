'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Common');

  useEffect(() => {
    // Surface for diagnostics; replace with Sentry later.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
        {t('errorTitle')}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('errorBody')}</p>
      <Button onClick={reset} className="mt-6">
        {t('retry')}
      </Button>
    </main>
  );
}
