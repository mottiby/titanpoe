import { NextResponse } from 'next/server';
import { autoReleaseDueOrders } from '@/lib/orders/auto-release';

// Scheduler-agnostic trigger for the 72h escrow auto-release. Wire any scheduler
// later (Inngest / Vercel Cron) to POST here. Protected by CRON_SECRET if set.
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get('authorization');
    if (header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const released = await autoReleaseDueOrders();
  return NextResponse.json({ released: released.length, ids: released });
}
