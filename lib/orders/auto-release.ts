import { db } from '@/lib/db';
import { confirmCompletion } from '@/lib/orders/service';

export const AUTO_RELEASE_HOURS = 72;

/**
 * Release escrow for DELIVERED orders whose auto-release window has elapsed
 * (the buyer didn't confirm in time). Scheduler-agnostic — call it from Inngest,
 * Vercel Cron, or the /api/cron/auto-release route. Returns the released order ids.
 */
export async function autoReleaseDueOrders(now: Date = new Date()): Promise<string[]> {
  const cutoff = new Date(now.getTime() - AUTO_RELEASE_HOURS * 60 * 60 * 1000);

  const due = await db.order.findMany({
    where: { status: 'DELIVERED', deliveredAt: { lte: cutoff } },
    select: { id: true },
  });

  const released: string[] = [];
  for (const { id } of due) {
    try {
      await confirmCompletion(id);
      released.push(id);
    } catch {
      // Order changed since the query (e.g. disputed) — skip; a real impl logs this.
    }
  }
  return released;
}
