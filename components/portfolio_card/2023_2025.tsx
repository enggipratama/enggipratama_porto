"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export function PortfolioCard1() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="mb-5 text-sm text-center w-full font-bold text-neutral-600 dark:text-white"
        >
          Davibar House - Warehouse Inventory Website
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-2">
          <img
            src="/Images/davibar.png"
            height="1000"
            width="1000"
            className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <CardItem
            translateZ={20}
            as="a"
            href="https://davibar.enggipratama.my.id"
            target="__blank"
            className="px-4 py-2 rounded-xl text-sm font-normal dark:text-white"
          >
            Demo →
          </CardItem>
          <CardItem
            translateZ={20}
            as="a"
            href="https://github.com/enggipratama/DAVIBARTEST"
            target="__blank"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
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
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="mb-5 text-sm text-center w-full font-bold text-neutral-600 dark:text-white"
        >
          Web Portfolio - OLD
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-2">
          <img
            src="/Images/old_portfolio.png"
            height="1000"
            width="1000"
            className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <CardItem
            translateZ={20}
            as="a"
            href="https://megp.enggipratama.my.id"
            target="__blank"
            className="px-4 py-2 rounded-xl text-sm font-normal dark:text-white"
          >
            Demo →
          </CardItem>
          <CardItem
            translateZ={20}
            as="a"
            href="https://github.com/enggipratama/porto"
            target="__blank"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
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
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="mb-5 text-sm text-center w-full font-bold text-neutral-600 dark:text-white"
        >
          Stay Tune
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-2">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-10">
          <CardItem
            translateZ={20}
            as="button"
            href="-"
            target="__blank"
            className="px-4 py-2 rounded-xl text-sm font-normal dark:text-white"
          >
            Soon →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            href="-"
            target="__blank"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Soon
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
