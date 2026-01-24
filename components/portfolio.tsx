import { Timeline } from "@/components/ui/timeline";
import {
  PortfolioCard,
  PortfolioCard1,
  PortfolioCard2,
  PortfolioCard3,
} from "./portfolio_card/2023_2025";

export function TimelinePortfolio() {
  const data = [
    {
      title: "2023 - 2024",
      content: (
        <div>
          <PortfolioCard1 />
        </div>
      ),
    },
    {
      title: "2024 - 2025",
      content: (
        <div>
          <PortfolioCard2 />
        </div>
      ),
    },
    {
      title: "2026 - NOW",
      content: (
        <div>
          <PortfolioCard3 />
        </div>
      ),
    },
    {
      title: "Coming soon",
      content: (
        <div>
          <PortfolioCard />
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
