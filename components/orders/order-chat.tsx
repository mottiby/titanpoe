'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Msg = {
  id: string;
  senderId: string;
  body: string;
  system?: boolean;
  attachmentUrl?: string | null;
};

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
  const endRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages]);

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
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <MessageCircle className="size-4 text-primary" />
        {t('chat')}
      </h2>

      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1" aria-live="polite">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">{t('noMessages')}</p>
        )}
        {messages.map((m) => {
          if (m.system) {
            return (
              <div key={m.id} className="flex justify-center">
                <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                  {m.body}
                </span>
              </div>
            );
          }
          const mine = m.senderId === userId;
          const role = m.senderId === buyerId ? t('buyer') : t('seller');
          return (
            <div
              key={m.id}
              className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}
            >
              <span className="text-xs text-muted-foreground">
                {role}
                {mine ? ` (${t('you')})` : ''}
              </span>
              <div
                className={cn(
                  'mt-1 inline-block max-w-[85%] rounded-2xl px-3.5 py-2 text-sm',
                  mine
                    ? 'rounded-br-sm bg-primary/15 text-foreground'
                    : 'rounded-bl-sm border border-border bg-card text-card-foreground'
                )}
              >
                <p>{m.body}</p>
                {m.attachmentUrl && (
                  <a
                    href={m.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-primary underline"
                  >
                    {m.attachmentUrl.split('/').pop()}
                  </a>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="h-9 flex-1"
        />
        <Button type="submit">{t('send')}</Button>
      </form>
    </section>
  );
}
