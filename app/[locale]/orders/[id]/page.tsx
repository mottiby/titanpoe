import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { getOrder, getOrderMessages } from '@/lib/orders/queries';
import {
  sellerStartWork,
  sellerDeliver,
  buyerConfirm,
  buyerCancel,
  buyerDispute,
} from '@/lib/orders/actions';
import { OrderChat } from '@/components/orders/order-chat';
import { ReviewForm } from '@/components/orders/review-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { PriceTag } from '@/components/marketplace/price-tag';
import { OrderStatusBadge } from '@/components/marketplace/order-status-badge';
import { EscrowStepper } from '@/components/marketplace/escrow-stepper';
import { RatingStars } from '@/components/marketplace/rating-stars';
import { FadeIn } from '@/components/motion/motion';

type Props = { params: Promise<{ locale: string; id: string }> };

const STATUSES = [
  'CREATED',
  'PAID',
  'IN_PROGRESS',
  'DELIVERED',
  'COMPLETED',
  'DISPUTED',
  'REFUNDED',
  'CANCELLED',
] as const;

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
  const messages = await getOrderMessages(order.id);

  const statusLabels = Object.fromEntries(
    STATUSES.map((s) => [s, t(`status.${s}`)]),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/orders"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        {t('back')}
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <PriceTag cents={order.amountCents} locale={locale} size="md" />
          <OrderStatusBadge status={order.status} label={t(`status.${order.status}`)} />
        </div>
      </div>

      <FadeIn className="mt-6">
        <Card className="p-5">
          <EscrowStepper status={order.status} labels={statusLabels} />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t('escrowNote')}
          </p>
        </Card>
      </FadeIn>

      <div className="mt-6 flex flex-wrap items-start gap-3">
        {isSeller && order.status === 'PAID' && (
          <form action={sellerStartWork}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button type="submit">{t('startWork')}</Button>
          </form>
        )}
        {isSeller && order.status === 'IN_PROGRESS' && (
          <form action={sellerDeliver}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button type="submit">{t('deliver')}</Button>
          </form>
        )}
        {isBuyer && order.status === 'DELIVERED' && (
          <form action={buyerConfirm}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button type="submit">{t('confirm')}</Button>
          </form>
        )}
        {isBuyer && (order.status === 'CREATED' || order.status === 'PAID') && (
          <form action={buyerCancel}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button type="submit" variant="outline">{t('cancel')}</Button>
          </form>
        )}
        {isBuyer &&
          (order.status === 'IN_PROGRESS' || order.status === 'DELIVERED') && (
            <form action={buyerDispute} className="flex flex-1 flex-wrap gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <Input
                name="reason"
                required
                placeholder={t('disputeReason')}
                className="h-9 flex-1 sm:max-w-xs"
              />
              <Button type="submit" variant="outline">{t('dispute')}</Button>
            </form>
          )}
      </div>

      {/* Review prompt — buyer, completed order */}
      {isBuyer && order.status === 'COMPLETED' && (
        <Card className="mt-6 p-5">
          {order.review ? (
            <div>
              <div className="text-sm font-medium">{t('yourReview')}</div>
              <div className="mt-2">
                <RatingStars value={order.review.rating} />
              </div>
              {order.review.body && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {order.review.body}
                </p>
              )}
            </div>
          ) : (
            <ReviewForm
              orderId={order.id}
              labels={{
                title: t('leaveReview'),
                body: t('reviewBody'),
                submit: t('reviewSubmit'),
              }}
            />
          )}
        </Card>
      )}

      <OrderChat
        orderId={order.id}
        userId={userId}
        buyerId={order.buyerId}
        initial={messages.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          body: m.body,
          system: m.system,
          attachmentUrl: m.attachmentUrl,
        }))}
      />
    </main>
  );
}
