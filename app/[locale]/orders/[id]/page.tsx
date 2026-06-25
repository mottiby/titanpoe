import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getOrder } from '@/lib/orders/queries';
import {
  sellerStartWork,
  sellerDeliver,
  buyerConfirm,
  buyerCancel,
  buyerDispute,
} from '@/lib/orders/actions';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function OrderPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/signin`);

  const order = await getOrder(id);
  if (!order) notFound();

  const userId = session.user.id;
  const isBuyer = order.buyerId === userId;
  const isSeller = order.listing.seller.userId === userId;
  if (!isBuyer && !isSeller) notFound();

  const t = await getTranslations('Orders');
  const title = locale === 'ru' ? order.listing.titleRu : order.listing.titleEn;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/orders" className="text-sm text-muted-foreground hover:underline">
        {t('back')}
      </Link>

      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-2xl font-semibold">${(order.amountCents / 100).toFixed(2)}</p>
      <p className="mt-3">
        <span className="rounded bg-muted px-2 py-1 text-sm font-medium">
          {t(`status.${order.status}`)}
        </span>
      </p>

      <div className="mt-8 flex flex-wrap items-start gap-3">
        {isSeller && order.status === 'PAID' && (
          <form action={sellerStartWork}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button>{t('startWork')}</Button>
          </form>
        )}
        {isSeller && order.status === 'IN_PROGRESS' && (
          <form action={sellerDeliver}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button>{t('deliver')}</Button>
          </form>
        )}
        {isBuyer && order.status === 'DELIVERED' && (
          <form action={buyerConfirm}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button>{t('confirm')}</Button>
          </form>
        )}
        {isBuyer && (order.status === 'CREATED' || order.status === 'PAID') && (
          <form action={buyerCancel}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button variant="outline">{t('cancel')}</Button>
          </form>
        )}
        {isBuyer && (order.status === 'IN_PROGRESS' || order.status === 'DELIVERED') && (
          <form action={buyerDispute} className="flex gap-2">
            <input type="hidden" name="orderId" value={order.id} />
            <input
              name="reason"
              required
              placeholder={t('disputeReason')}
              className="rounded-md border px-3 py-2 text-sm"
            />
            <Button variant="outline">{t('dispute')}</Button>
          </form>
        )}
      </div>
    </main>
  );
}
