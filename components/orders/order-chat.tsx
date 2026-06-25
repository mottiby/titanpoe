'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type Msg = { id: string; senderId: string; body: string };

export function OrderChat({
  orderId,
  userId,
  buyerId,
  initial,
}: {
  orderId: string;
  userId: string;
  buyerId: string;
  initial: Msg[];
}) {
  const t = useTranslations('Orders');
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [text, setText] = useState('');

  async function load() {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, { cache: 'no-store' });
      if (res.ok) {
        const data: { messages: Msg[] } = await res.json();
        setMessages(data.messages);
      }
    } catch {
      // transient network error — next poll retries
    }
  }

  useEffect(() => {
    const interval = setInterval(load, 4000); // near-real-time via polling
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText('');
    await fetch(`/api/orders/${orderId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    await load();
  }

  return (
    <section className="mt-12 border-t pt-6">
      <h2 className="text-lg font-semibold">{t('chat')}</h2>
      <ul className="mt-4 space-y-3">
        {messages.length === 0 && (
          <li className="text-sm text-muted-foreground">{t('noMessages')}</li>
        )}
        {messages.map((m) => {
          const mine = m.senderId === userId;
          const role = m.senderId === buyerId ? t('buyer') : t('seller');
          return (
            <li key={m.id} className={mine ? 'text-right' : ''}>
              <span className="block text-xs text-muted-foreground">
                {role}
                {mine ? ` (${t('you')})` : ''}
              </span>
              <p className="mt-1 inline-block rounded-md bg-muted px-3 py-2 text-sm">
                {m.body}
              </p>
            </li>
          );
        })}
      </ul>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <Button type="submit">{t('send')}</Button>
      </form>
    </section>
  );
}
