import Image from "next/image";

import { BackgroundLines } from "@/components/ui/background-lines";
import { TextFlip } from "@/components/text-flip";
import { ScrollIcon } from "@/components/scroll-icon";
import { SpotlightPreview } from "@/components/about-section";
import { TimelinePortfolio } from "@/components/portfolio";
import GithubData from "@/components/github-section";

export default function Home() {
  return (
    <main className="no-scrollbar min-h-screen overflow-y-auto scroll-smooth">
      <section id="home" className="relative min-h-screen">
        <BackgroundLines className="flex min-h-screen w-full flex-col items-center justify-center px-4">
          <h2 className="relative z-20 px-4 py-4 text-center font-mono font-bold tracking-tight">
            <TextFlip />

            <span className="mt-3 block bg-linear-to-b from-neutral-900 to-neutral-700 bg-clip-text text-lg tracking-[0.2em] text-transparent uppercase dark:from-neutral-600 dark:to-white">
              Enggi Pratama.
            </span>
          </h2>

          <p className="max-w-2xl text-center text-sm italic text-neutral-700 dark:text-neutral-400 sm:text-lg">
            &quot;Bridging the gap between imagination and reality. Specializing
            in modern web technologies to create fast, responsive, and
            future-proof applications.&quot;
          </p>

          <ScrollIcon />
        </BackgroundLines>
      </section>

      <section id="about" className="scroll-mt-10">
        <SpotlightPreview />
      </section>

      <section id="portfolio" className="scroll-mt-0">
        <TimelinePortfolio />
      </section>
      <div className="font-mono">
        <GithubData />
      </div>

      <footer className="mb-10 font-mono flex flex-col items-center justify-center text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-600 dark:text-gray-400">
            Lets discuss with us -
          </span>

          <a
            href="/giscus"
            className="group flex items-center gap-1 hover:text-sky-500 transition-colors text-sky-500"
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
          </a>
        </div>

        <span className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
          Powered by Github
        </span>
      </footer>
    </main>
  );
}
