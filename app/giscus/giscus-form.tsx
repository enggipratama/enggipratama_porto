import Giscus from "@/components/giscus-wrapper";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb-giscus";

export default function GiscusForm() {
  return (
    <main className="max-w-4xl mx-auto p-4 font-mono">
      <div className="w-full bg-white dark:bg-black px-5 mb-5 text-center">
        <h2 className="text-2xl md:text-4xl mb-2 text-black dark:text-white font-bold">
          Public Discussions
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm">
          Share your thoughts, feedback, or questions. Let&apos;s make it 🎉 ✨
        </p>
      </div>
      <div className="mb-4 px-5">
        <BreadcrumbWithCustomSeparator />
      </div>
      <hr className="my-1" />
      <Giscus />
    </main>
  );
}
