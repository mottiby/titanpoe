import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { auth } from '@/auth';
import { getCartItems } from '@/lib/cart/queries';
import { removeCartItem, checkoutCart } from '@/lib/cart/actions';
import { configuredAmountCents } from '@/lib/orders/pricing';
import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PriceTag } from '@/components/marketplace/price-tag';
import { EmptyState } from '@/components/marketplace/empty-state';

type Props = { params: Promise<{ locale: string }> };

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const t = await getTranslations('Cart');
  const tc = await getTranslations('Catalog');
  const items = await getCartItems(session.user.id);

  const lines = items.map((it) => {
    const tier = it.tierId
      ? it.listing.tiers.find((x) => x.id === it.tierId)
      : undefined;
    const addons = it.listing.addons.filter((a) => it.addonIds.includes(a.id));
    const cents = configuredAmountCents(it.listing, {
      tierId: it.tierId ?? undefined,
      quantity: it.quantity,
      addonIds: it.addonIds,
    });
    return {
      id: it.id,
      listingId: it.listing.id,
      title: locale === 'ru' ? it.listing.titleRu : it.listing.titleEn,
      tierName: tier ? (locale === 'ru' ? tier.nameRu : tier.nameEn) : undefined,
      quantity: it.quantity,
      addonCount: addons.length,
      cents,
    };
  });
  const total = lines.reduce((s, l) => s + l.cents, 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('title')}</h1>

      {lines.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={t('empty')}
          action={
            <Link href="/catalog" className={buttonVariants({})}>
              {t('emptyCta')}
            </Link>
          }
          className="mt-6"
        />
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {lines.map((l) => (
              <Card key={l.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <Link
                    href={`/catalog/${l.listingId}`}
                    className="truncate font-medium hover:text-primary"
                  >
                    {l.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {l.tierName ? `${l.tierName} · ` : ''}× {l.quantity}
                    {l.addonCount > 0 ? ` · +${l.addonCount}` : ''}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <PriceTag cents={l.cents} locale={locale} size="sm" />
                  <form action={removeCartItem}>
                    <input type="hidden" name="id" value={l.id} />
                    <Button variant="ghost" size="icon-sm" aria-label={t('remove')}>
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>

          <Card glass className="mt-6 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('total')}</span>
              <PriceTag cents={total} locale={locale} size="lg" />
            </div>
            <form action={checkoutCart} className="mt-4">
              <Button type="submit" size="lg" className="w-full">
                {t('checkout')}
              </Button>
            </form>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {tc('escrowNote')}
            </p>
          </Card>
        </>
      )}
    </main>
  );
}
