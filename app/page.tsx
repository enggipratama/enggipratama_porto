import { SpaceBackground } from "@/components/space-background";
import { HeroContent } from "@/components/hero-content";
import { ScrollIcon } from "@/components/scroll-icon";
import { SpotlightPreview } from "@/components/about-section";
import { TimelinePortfolio } from "@/components/portfolio";
import GithubData from "@/components/github-section";

export default function Home() {
  return (
    <main className="no-scrollbar min-h-screen overflow-y-auto scroll-smooth font-sans">
      <section id="home" className="relative min-h-screen">
        <SpaceBackground className="flex min-h-screen w-full flex-col items-center justify-center px-4">
          <HeroContent />
          <ScrollIcon />
        </SpaceBackground>
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
    </main>
  );
}
