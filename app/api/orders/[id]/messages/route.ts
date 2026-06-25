import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// Authorize the current user as a party (buyer or seller) to the order.
async function authorizeParty(orderId: string): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { listing: { include: { seller: true } } },
  });
  if (!order) return null;

  const isParty =
    order.buyerId === userId || order.listing.seller.userId === userId;
  return isParty ? userId : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await authorizeParty(id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const convo = await db.conversation.findUnique({
    where: { orderId: id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  return NextResponse.json({ messages: convo?.messages ?? [] });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await authorizeParty(id);
  if (!userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = (await req.json().catch(() => ({}))) as { body?: unknown };
  const text = String(payload.body ?? '').trim();
  if (!text) return NextResponse.json({ error: 'Empty message' }, { status: 400 });

  const convo = await db.conversation.upsert({
    where: { orderId: id },
    create: { orderId: id },
    update: {},
  });
  const message = await db.message.create({
    data: { conversationId: convo.id, senderId: userId, body: text },
  });
  return NextResponse.json({ message });
}
