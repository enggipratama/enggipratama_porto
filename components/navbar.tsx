"use client";
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
      link: "/#",
      icon: <IconSmartHome className="h-5 w-5" />,
    },
    {
      name: "About",
      link: "/#about",
      icon: <IconUserSquareRounded className="h-5 w-5" />,
    },
    {
      name: "Portfolio",
      link: "/#portfolio",
      icon: <IconBook2 className="h-5 w-5" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <IconMail className="h-5 w-5" />,
    },
  ];
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
