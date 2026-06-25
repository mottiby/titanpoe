'use client';

import { useActionState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input, Textarea, selectClassName } from '@/components/ui/input';
import { createListing, type SellerActionState } from '@/lib/sellers/actions';

type Category = { id: string; nameEn: string; nameRu: string };

export function CreateListingForm({ categories }: { categories: Category[] }) {
  const t = useTranslations('Seller');
  const tcat = useTranslations('Catalog');
  const locale = useLocale();
  const [state, action, pending] = useActionState<SellerActionState, FormData>(
    createListing,
    undefined,
  );

  const label = 'mb-1.5 block text-sm font-medium';

  return (
    <form action={action} className="mt-6 space-y-5">
      <div>
        <label className={label}>{t('category')}</label>
        <select name="categoryId" required className={selectClassName}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === 'ru' ? c.nameRu : c.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>{t('listingTitleEn')}</label>
        <Input name="titleEn" required placeholder={t('listingTitleEn')} />
      </div>

      <div>
        <label className={label}>{t('listingTitleRu')}</label>
        <Input name="titleRu" required placeholder={t('listingTitleRu')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>{t('price')}</label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              €
            </span>
            <Input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="pl-7"
            />
          </div>
        </div>
        <div>
          <label className={label}>{t('eta')}</label>
          <Input name="etaHours" type="number" min="1" required placeholder="24" />
        </div>
      </div>

      <div>
        <label className={label}>{t('fulfillment')}</label>
        <select name="fulfillment" required className={selectClassName}>
          <option value="PARTY_PLAY">{t('fulfillmentPartyPlay')}</option>
          <option value="TRADE">{t('fulfillmentTrade')}</option>
          <option value="SESSION">{t('fulfillmentSession')}</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>{t('platform')}</label>
          <select name="platform" required className={selectClassName}>
            <option value="PC">PC</option>
            <option value="PS5">PS5</option>
            <option value="XBOX">Xbox</option>
          </select>
        </div>
        <div>
          <label className={label}>{t('leagueMode')}</label>
          <select name="leagueMode" required className={selectClassName}>
            <option value="SOFTCORE">Softcore</option>
            <option value="HARDCORE">Hardcore</option>
            <option value="SSF_SOFTCORE">SSF Softcore</option>
            <option value="SSF_HARDCORE">SSF Hardcore</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label}>{t('league')}</label>
        <Input name="league" required placeholder={t('league')} />
      </div>

      <div>
        <label className={label}>{t('badge')}</label>
        <select name="badge" defaultValue="" className={selectClassName}>
          <option value="">{t('badgeNone')}</option>
          <option value="HOT">{tcat('badgeHot')}</option>
          <option value="SALE">{tcat('badgeSale')}</option>
          <option value="NEW">{tcat('badgeNew')}</option>
          <option value="BEST_VALUE">{tcat('badgeBest')}</option>
        </select>
      </div>

      <div>
        <label className={label}>{t('highlightsEn')}</label>
        <Textarea name="highlightsEn" rows={3} />
      </div>

      <div>
        <label className={label}>{t('highlightsRu')}</label>
        <Textarea name="highlightsRu" rows={3} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {t('createCta')}
      </Button>
    </form>
  );
}
