"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-red-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center px-6">
        <span className="text-sm font-bold tracking-widest text-red-600 uppercase">
          Error 500
        </span>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          An unexpected error has occurred. Our team has been notified.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-md bg-slate-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Go back home <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
