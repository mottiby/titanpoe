'use client';

import { useActionState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { createListing, type SellerActionState } from '@/lib/sellers/actions';

type Category = { id: string; nameEn: string; nameRu: string };

export function CreateListingForm({ categories }: { categories: Category[] }) {
  const t = useTranslations('Seller');
  const locale = useLocale();
  const [state, action, pending] = useActionState<SellerActionState, FormData>(
    createListing,
    undefined,
  );

  const input = 'w-full rounded-md border px-3 py-2';
  const select = 'w-full rounded-md border bg-background px-3 py-2';

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-medium">{t('category')}</label>
      <select name="categoryId" required className={select}>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {locale === 'ru' ? c.nameRu : c.nameEn}
          </option>
        ))}
      </select>

      <input name="titleEn" required placeholder={t('listingTitleEn')} className={input} />
      <input name="titleRu" required placeholder={t('listingTitleRu')} className={input} />

      <div className="flex gap-4">
        <input name="price" type="number" step="0.01" min="0.01" required placeholder={t('price')} className={input} />
        <input name="etaHours" type="number" min="1" required placeholder={t('eta')} className={input} />
      </div>

      <select name="fulfillment" required className={select}>
        <option value="PARTY_PLAY">{t('fulfillmentPartyPlay')}</option>
        <option value="TRADE">{t('fulfillmentTrade')}</option>
        <option value="SESSION">{t('fulfillmentSession')}</option>
      </select>

      <div className="flex gap-4">
        <select name="platform" required className={select}>
          <option value="PC">PC</option>
          <option value="PS5">PS5</option>
          <option value="XBOX">Xbox</option>
        </select>
        <select name="leagueMode" required className={select}>
          <option value="SOFTCORE">Softcore</option>
          <option value="HARDCORE">Hardcore</option>
          <option value="SSF_SOFTCORE">SSF Softcore</option>
          <option value="SSF_HARDCORE">SSF Hardcore</option>
        </select>
      </div>

      <input name="league" required placeholder={t('league')} className={input} />

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {t('createCta')}
      </Button>
    </form>
  );
}
