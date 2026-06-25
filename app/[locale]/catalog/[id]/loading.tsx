import { Skeleton } from '@/components/ui/skeleton';

export default function ListingLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <Skeleton className="aspect-[16/9] w-full rounded-lg" />
          <Skeleton className="mt-5 h-8 w-2/3" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-6 h-24 w-full" />
        </div>
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    </main>
  );
}
