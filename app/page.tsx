import Image from "next/image";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextFlip } from "@/components/text-flip";
import { ScrollIcon } from "@/components/scroll-icon";
import { OpenToWorkBadge, CTAButtons } from "@/components/hero-badge";
import { SpotlightPreview } from "@/components/about-section";
import { TimelinePortfolio } from "@/components/portfolio";
import GithubData from "@/components/github-section";

export default function Home() {
  return (
    <main className="no-scrollbar min-h-screen overflow-y-auto scroll-smooth font-sans">
      <section id="home" className="relative min-h-screen">
        <BackgroundLines className="flex min-h-screen w-full flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <OpenToWorkBadge />
            <h2 className="relative z-20 px-4 py-4 text-center font-mono font-bold tracking-tight">
              <TextFlip />
              <span className="mt-3 block bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-lg tracking-[0.2em] text-transparent uppercase dark:from-neutral-600 dark:to-white">
                Enggi Pratama.
              </span>
            </h2>
            <p className="max-w-2xl text-center text-sm italic text-neutral-700 dark:text-neutral-400 sm:text-lg">
              &ldquo;Transforming complex problems into elegant solutions, one line of code at a time.&rdquo;
            </p>
            <CTAButtons />
          </div>
          <ScrollIcon />
        </BackgroundLines>
      </section>
      <section id="about" className="relative z-10 scroll-mt-10 bg-white dark:bg-black">
        <SpotlightPreview />
      </section>
      <section id="portfolio" className="scroll-mt-0">
        <TimelinePortfolio />
      </section>
      <div className="font-mono">
        <GithubData />
      </div>
      {/* Footer */}
      <footer className="bg-white py-10 text-center font-mono text-sm dark:bg-black">
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">
            Lets discuss with us -
          </span>

          <Link
            href="/giscus"
            className="group flex items-center gap-1 text-sky-500 transition-colors hover:text-sky-500"
          >
            <span className="font-bold underline-offset-2 group-hover:underline">
              Giscus
            </span>
            <Image
              src="/Images/giscus.png"
              alt="Giscus"
              width={24}
              height={24}
              className="h-5 w-5 transition-transform group-hover:scale-110"
            />
          </Link>
        </div>

        <span className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
          Powered by Github
        </span>
      </footer>
    </main>
  );
}
