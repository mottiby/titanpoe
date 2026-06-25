import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-8 h-6 w-32" />
      <div className="mt-3 flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </main>
  );
}
