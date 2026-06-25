import { describe, it, expect } from 'vitest';
import {
  canTransition,
  assertTransition,
  isTerminal,
  nextStates,
  InvalidTransitionError,
  TERMINAL_STATES,
} from './state-machine';

describe('order escrow state machine', () => {
  describe('canTransition', () => {
    it('allows a created order to be paid (funds into escrow)', () => {
      expect(canTransition('CREATED', 'PAID')).toBe(true);
    });

    it('allows a created order to be cancelled before payment', () => {
      expect(canTransition('CREATED', 'CANCELLED')).toBe(true);
    });

    it('allows a paid order to start work', () => {
      expect(canTransition('PAID', 'IN_PROGRESS')).toBe(true);
    });

    it('allows a paid order to be cancelled (refund before work)', () => {
      expect(canTransition('PAID', 'CANCELLED')).toBe(true);
    });

    it('allows in-progress work to be delivered with proof', () => {
      expect(canTransition('IN_PROGRESS', 'DELIVERED')).toBe(true);
    });

    it('allows a delivered order to be completed (release to seller)', () => {
      expect(canTransition('DELIVERED', 'COMPLETED')).toBe(true);
    });

    it('allows a delivered order to be disputed', () => {
      expect(canTransition('DELIVERED', 'DISPUTED')).toBe(true);
    });

    it('resolves a dispute by refunding the buyer', () => {
      expect(canTransition('DISPUTED', 'REFUNDED')).toBe(true);
    });

    it('resolves a dispute by releasing to the seller', () => {
      expect(canTransition('DISPUTED', 'COMPLETED')).toBe(true);
    });

    it('forbids skipping straight from created to completed', () => {
      expect(canTransition('CREATED', 'COMPLETED')).toBe(false);
    });

    it('forbids paying a cancelled order', () => {
      expect(canTransition('CANCELLED', 'PAID')).toBe(false);
    });

    it('forbids reopening a completed order', () => {
      expect(canTransition('COMPLETED', 'DISPUTED')).toBe(false);
    });
  });

  describe('isTerminal', () => {
    it('treats COMPLETED, REFUNDED and CANCELLED as terminal', () => {
      expect(isTerminal('COMPLETED')).toBe(true);
      expect(isTerminal('REFUNDED')).toBe(true);
      expect(isTerminal('CANCELLED')).toBe(true);
    });

    it('treats in-flight states as non-terminal', () => {
      expect(isTerminal('CREATED')).toBe(false);
      expect(isTerminal('DELIVERED')).toBe(false);
      expect(isTerminal('DISPUTED')).toBe(false);
    });

    it('gives every terminal state zero outgoing transitions', () => {
      for (const state of TERMINAL_STATES) {
        expect(nextStates(state)).toHaveLength(0);
      }
    });
  });

  describe('assertTransition', () => {
    it('does not throw for a valid transition', () => {
      expect(() => assertTransition('PAID', 'IN_PROGRESS')).not.toThrow();
    });

    it('throws InvalidTransitionError for an illegal transition', () => {
      expect(() => assertTransition('CREATED', 'COMPLETED')).toThrow(
        InvalidTransitionError,
      );
    });

    it('exposes the offending from/to states on the error', () => {
      let err: unknown;
      try {
        assertTransition('CREATED', 'COMPLETED');
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(InvalidTransitionError);
      expect((err as InvalidTransitionError).from).toBe('CREATED');
      expect((err as InvalidTransitionError).to).toBe('COMPLETED');
    });
  });
});
