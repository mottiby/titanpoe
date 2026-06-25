'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input, selectClassName } from '@/components/ui/input';
import { becomeSeller, type SellerActionState } from '@/lib/sellers/actions';

export function BecomeSellerForm() {
  const t = useTranslations('Seller');
  const [state, action, pending] = useActionState<SellerActionState, FormData>(
    becomeSeller,
    undefined,
  );

  const label = 'mb-1.5 block text-sm font-medium';

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={label}>{t('displayName')}</label>
        <Input name="displayName" required placeholder={t('displayName')} />
      </div>
      <div>
        <label className={label}>{t('type')}</label>
        <select name="type" required defaultValue="BOOSTER" className={selectClassName}>
          <option value="BOOSTER">{t('typeBooster')}</option>
          <option value="SUPPLIER">{t('typeSupplier')}</option>
          <option value="COACH">{t('typeCoach')}</option>
          <option value="TEAM">{t('typeTeam')}</option>
        </select>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {t('becomeCta')}
      </Button>
    </form>
  );
}
