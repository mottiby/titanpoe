'use client';

import { useTranslations } from 'next-intl';
import { Compass } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('Common');
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <Compass className="size-8 text-muted-foreground" />
      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
        {t('notFoundTitle')}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('notFoundBody')}</p>
      <Link href="/" className={buttonVariants({ className: 'mt-6' })}>
        {t('backHome')}
      </Link>
    </main>
  );
}
