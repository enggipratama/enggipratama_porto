"use client";
import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import {
  IconSmartHome,
  IconUserSquareRounded,
  IconMail,
  IconBook2,
} from "@tabler/icons-react";

export function Navbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: (
        <IconSmartHome className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "About",
      link: "/#about",
      icon: (
        <IconUserSquareRounded className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Portfolio",
      link: "/#portfolio",
      icon: (
        <IconBook2 className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMail className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
