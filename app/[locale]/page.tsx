import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Button} from '@/components/ui/button';

type Props = {params: Promise<{locale: string}>};

export default function HomePage({params}: Props) {
  const {locale} = use(params);
  setRequestLocale(locale);

  const t = useTranslations('HomePage');

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-3 text-muted-foreground">{t('tagline')}</p>
      <Button className="mt-6">{t('cta')}</Button>
    </main>
  );
}
