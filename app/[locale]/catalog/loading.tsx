import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Skeleton className="h-9 w-40" />
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
