'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { becomeSeller, type SellerActionState } from '@/lib/sellers/actions';

export function BecomeSellerForm() {
  const t = useTranslations('Seller');
  const [state, action, pending] = useActionState<SellerActionState, FormData>(
    becomeSeller,
    undefined,
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <input
        name="displayName"
        required
        placeholder={t('displayName')}
        className="w-full rounded-md border px-3 py-2"
      />
      <select
        name="type"
        required
        defaultValue="BOOSTER"
        className="w-full rounded-md border bg-background px-3 py-2"
      >
        <option value="BOOSTER">{t('typeBooster')}</option>
        <option value="SUPPLIER">{t('typeSupplier')}</option>
        <option value="COACH">{t('typeCoach')}</option>
        <option value="TEAM">{t('typeTeam')}</option>
      </select>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {t('becomeCta')}
      </Button>
    </form>
  );
}
