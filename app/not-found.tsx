import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-sky-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center">
        <span className="text-sm font-bold tracking-widest text-sky-600 uppercase">
          404 Error
        </span>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-slate-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-slate-700 dark:hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Get Help <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
