"use client";

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4 shadow-md shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-neutral-900/50 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-4 w-4 shrink-0 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="mt-2 h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-1 h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-4 flex flex-wrap items-center gap-3 pt-4">
        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white p-2 text-center shadow-md shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-neutral-900/50 sm:p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg sm:h-9 sm:w-9 bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-0.5 h-5 w-12 rounded bg-neutral-200 dark:bg-neutral-800 sm:mt-1 sm:h-6 sm:w-16" />
      <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-800 sm:h-4 sm:w-20" />
    </div>
  );
}

export function SkeletonHeatmap() {
  return (
    <div className="h-full rounded-xl border border-neutral-200 bg-white p-4 shadow-md shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-neutral-900/50 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex gap-1">
        {[...Array(52)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {[...Array(7)].map((_, j) => (
              <div
                key={j}
                className="h-2.5 w-2.5 rounded-sm bg-neutral-200 dark:bg-neutral-800 sm:h-3 sm:w-3"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
