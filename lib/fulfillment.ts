import { Users, ArrowLeftRight, GraduationCap } from 'lucide-react';

type IconType = React.ComponentType<{ className?: string }>;

// The delivery methods we actually offer. Account-sharing / piloting is
// intentionally excluded (higher ToS risk — see docs/01-overgear-teardown §9),
// so every method here is account-safe.
export type FulfillmentKey = 'PARTY_PLAY' | 'TRADE' | 'SESSION';

export const fulfillmentMeta: Record<FulfillmentKey, { icon: IconType; safe: boolean }> = {
  PARTY_PLAY: { icon: Users, safe: true },
  TRADE: { icon: ArrowLeftRight, safe: true },
  SESSION: { icon: GraduationCap, safe: true },
};

/** Display order for the "how delivery works" section. */
export const FULFILLMENT_KEYS: FulfillmentKey[] = ['PARTY_PLAY', 'TRADE', 'SESSION'];
