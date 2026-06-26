import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ShieldCheck, RotateCcw, BadgeCheck, Scale } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { SectionHeading } from '@/components/marketplace/section-heading';
import { GuaranteeCard } from '@/components/marketplace/guarantee-card';
import { TrustStrip } from '@/components/marketplace/trust-strip';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/motion';

type Props = { params: Promise<{ locale: string }> };

export default async function GuaranteesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Guarantees');
  const tr = await getTranslations('Trust');

  const items = [
    { icon: ShieldCheck, title: t('escrowTitle'), desc: t('escrowDesc') },
    { icon: RotateCcw, title: t('moneyBackTitle'), desc: t('moneyBackDesc') },
    { icon: BadgeCheck, title: t('verifiedTitle'), desc: t('verifiedDesc') },
    { icon: Scale, title: t('disputeTitle'), desc: t('disputeDesc') },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker={t('kicker')}
          title={t('pageTitle')}
          sub={t('pageIntro')}
          center
        />
      </Reveal>

      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <StaggerItem key={it.title}>
            <GuaranteeCard icon={it.icon} title={it.title} desc={it.desc} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-12 flex flex-col items-center gap-6 text-center">
        <TrustStrip
          labels={{
            escrow: tr('escrow'),
            moneyBack: tr('moneyBack'),
            verified: tr('verified'),
            chat: tr('chat'),
          }}
        />
        <Link href="/catalog" className={buttonVariants({ size: 'lg' })}>
          {t('browseCta')}
        </Link>
      </Reveal>
    </main>
  );
}
