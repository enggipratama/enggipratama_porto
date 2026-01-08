import { BackgroundLines } from "@/components/ui/background-lines";
import { TextFlip } from "@/components/textflip";
import { ScrollIcon } from "@/components/scrollicon";
import { SpotlightPreview } from "@/components/aboutcomponents";
import { TimelinePortfolio } from "@/components/portfolio";
export default function Home() {
  return (
    <>
      <main className="scroll-smooth no-scrollbar overflow-y-auto min-h-screen">
        <section id="home" className="relative min-h-screen">
          <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 min-h-screen">
            <h2 className="relative z-20 px-4 text-center font-mono font-bold tracking-tight py-4">
              <TextFlip />
              <span className="block text-lg mt-3 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white tracking-[0.2em] uppercase">
                Enggi Pratama.
              </span>
            </h2>
            <p className="max-w-2xl italic text-sm sm:text-lg text-neutral-700 dark:text-neutral-400 text-center">
              &quot;Bridging the gap between imagination and reality.
              Specializing in modern web technologies to create fast,
              responsive, and future-proof applications.&quot;
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
      </main>
    </>
  );
}
