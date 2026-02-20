import Link from "next/link";

export const metadata = {
  title: "403 - Access Denied",
};

export default function Forbidden() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-sky-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 text-center">
        <span className="text-sm font-bold tracking-widest text-sky-600 uppercase">
          Error 403
        </span>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Access Denied
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
          You don&apos;t have permission to access this page.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-slate-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black shadow-lg hover:ring-2 ring-slate-400 transition-all"
          >
            Go back home
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-slate-900 dark:text-white underline decoration-sky-500 underline-offset-4"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
