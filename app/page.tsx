import { SpaceBackground } from "@/components/space-background";
import { HeroContent } from "@/components/hero-content";
import { ScrollIcon } from "@/components/scroll-icon";
import { SpotlightPreview } from "@/components/about-section";
import { TimelinePortfolio } from "@/components/portfolio";
import GithubData from "@/components/github-section";
import { getAllSettings, getProjects } from "@/lib/data";

export const revalidate = 0; // Disable static caching to fetch live data

export default async function Home() {
  const settings = await getAllSettings();
  const projects = await getProjects();

  return (
    <main className="scroll-smooth font-sans">
      <section id="home" className="relative min-h-screen">
        <SpaceBackground className="flex min-h-screen w-full flex-col items-center justify-center px-4">
          <HeroContent settings={settings} />
          <ScrollIcon />
        </SpaceBackground>
      </section>
      <section id="about" className="relative z-10 scroll-mt-10 bg-white dark:bg-black">
        <SpotlightPreview settings={settings} />
      </section>
      <section id="portfolio" className="scroll-mt-0">
        <TimelinePortfolio projects={projects} />
      </section>
      <div className="font-mono">
        <GithubData />
      </div>
    </main>
  );
}
