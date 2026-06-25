// Provider-agnostic escrow / order state machine. Pure logic — no DB, no PSP.
// Mirrors the Prisma `OrderStatus` enum. Specified by state-machine.test.ts.

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'CANCELLED';

// from -> states reachable in a single step.
const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  CREATED: ['PAID', 'CANCELLED'],
  PAID: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['DELIVERED', 'DISPUTED'],
  DELIVERED: ['COMPLETED', 'DISPUTED'],
  DISPUTED: ['REFUNDED', 'COMPLETED'],
  COMPLETED: [],
  REFUNDED: [],
  CANCELLED: [],
};

export const TERMINAL_STATES: readonly OrderStatus[] = [
  'COMPLETED',
  'REFUNDED',
  'CANCELLED',
];

export function nextStates(from: OrderStatus): readonly OrderStatus[] {
  return TRANSITIONS[from];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATES.includes(status);
}

export class InvalidTransitionError extends Error {
  constructor(
    readonly from: OrderStatus,
    readonly to: OrderStatus,
  ) {
    super(`Invalid order transition: ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

/** Throws {@link InvalidTransitionError} if `from -> to` is not allowed. */
export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }
}
