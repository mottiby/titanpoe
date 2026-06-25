'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { leaveReview } from '@/lib/orders/actions';

export function ReviewForm({
  orderId,
  labels,
}: {
  orderId: string;
  labels: { title: string; body: string; submit: string };
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  return (
    <form action={leaveReview} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="text-sm font-medium">{labels.title}</div>
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n}`}
            className="rounded p-0.5 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <Star
              className={cn(
                'size-6 transition-colors',
                (hover || rating) >= n
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground/40',
              )}
            />
          </button>
        ))}
      </div>
      <Textarea name="body" placeholder={labels.body} />
      <Button type="submit">{labels.submit}</Button>
    </form>
  );
}
