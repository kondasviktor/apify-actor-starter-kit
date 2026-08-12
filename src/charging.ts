import { Actor } from 'apify';

export type ChargeEventName = 'actor-start' | 'item-scraped';

export interface ChargeGuardOptions {
  /** Hard stop after this many item-scraped charges (safety for runaway loops). */
  maxItemCharges: number;
}

/**
 * PPE helpers with a simple max-charge guard.
 * Configure matching event names in Apify Console → Monetization.
 */
export function createChargeGuard(options: ChargeGuardOptions) {
  let itemCharges = 0;
  let started = false;

  return {
    get itemCharges() {
      return itemCharges;
    },
    get canChargeItem() {
      return itemCharges < options.maxItemCharges;
    },
    async chargeStart(): Promise<void> {
      if (started) return;
      started = true;
      await Actor.charge({ eventName: 'actor-start' });
    },
    async chargeItem(): Promise<boolean> {
      if (itemCharges >= options.maxItemCharges) {
        return false;
      }
      await Actor.charge({ eventName: 'item-scraped' });
      itemCharges += 1;
      return true;
    },
  };
}
