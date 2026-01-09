"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";

const cardBodyClass =
  "relative w-auto h-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 group/card " +
  "dark:bg-black dark:border-white/[0.2] " +
  "dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]";

const titleClass =
  "mb-5 w-full text-center text-sm font-bold text-neutral-600 dark:text-white";

const imageClass =
  "h-40 w-full rounded-xl object-cover group-hover/card:shadow-xl";

const actionClass =
  "px-4 py-2 rounded-xl text-sm font-normal dark:text-white";

const githubClass =
  "px-4 py-2 rounded-xl bg-black text-xs font-bold text-white " +
  "dark:bg-white dark:text-black";

export function PortfolioCard1() {
  return (
    <CardContainer className="inter-var">
      <CardBody className={cardBodyClass}>
        <CardItem translateZ="50" className={titleClass}>
          Davibar House - Warehouse Inventory Website
        </CardItem>

        <CardItem translateZ="100" className="mt-2 w-full">
          <Image
            src="/Images/davibar.png"
            width={1000}
            height={1000}
            alt="Davibar House"
            className={imageClass}
          />
        </CardItem>

        <div className="mt-10 flex items-center justify-between">
          <CardItem
            translateZ={20}
            as="a"
            href="https://davibar.enggipratama.my.id"
            target="_blank"
            className={actionClass}
          >
            Demo →
          </CardItem>

          <CardItem
            translateZ={20}
            as="a"
            href="https://github.com/enggipratama/DAVIBARTEST"
            target="_blank"
            className={githubClass}
          >
            Github
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export function PortfolioCard2() {
  return (
    <CardContainer className="inter-var">
      <CardBody className={cardBodyClass}>
        <CardItem translateZ="50" className={titleClass}>
          Web Portfolio - OLD
        </CardItem>

        <CardItem translateZ="100" className="mt-2 w-full">
          <Image
            src="/Images/old_portfolio.png"
            width={1000}
            height={1000}
            alt="Old Portfolio"
            className={imageClass}
          />
        </CardItem>

        <div className="mt-10 flex items-center justify-between">
          <CardItem
            translateZ={20}
            as="a"
            href="https://megp.enggipratama.my.id"
            target="_blank"
            className={actionClass}
          >
            Demo →
          </CardItem>

          <CardItem
            translateZ={20}
            as="a"
            href="https://github.com/enggipratama/porto"
            target="_blank"
            className={githubClass}
          >
            Github
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

export function PortfolioCard3() {
  return (
    <CardContainer className="inter-var">
      <CardBody className={cardBodyClass}>
        <CardItem translateZ="50" className={titleClass}>
          Stay Tune
        </CardItem>

        <CardItem translateZ="100" className="mt-2 w-full">
          <Image
            src="/Images/old_portfolio.png"
            width={1000}
            height={1000}
            alt="Coming soon"
            className={imageClass}
          />
        </CardItem>

        <div className="mt-10 flex items-center justify-between">
          <CardItem
            translateZ={20}
            as="button"
            className={actionClass}
          >
            Soon →
          </CardItem>

          <CardItem
            translateZ={20}
            as="button"
            className={githubClass}
          >
            Soon
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
