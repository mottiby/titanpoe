import Stripe from 'stripe';

function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key);
}

/** Create an Express connected account for a seller. Returns the account id. */
export async function createConnectAccount(email: string): Promise<string> {
  const account = await stripe().accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  return account.id;
}

/** Hosted onboarding link for the seller to complete their connected account. */
export async function createOnboardingLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string,
): Promise<string> {
  const link = await stripe().accountLinks.create({
    account: accountId,
    type: 'account_onboarding',
    return_url: returnUrl,
    refresh_url: refreshUrl,
  });
  return link.url;
}

/** Whether the connected account can currently receive transfers. */
export async function isPayoutReady(accountId: string): Promise<boolean> {
  const account = await stripe().accounts.retrieve(accountId);
  return account.capabilities?.transfers === 'active';
}
