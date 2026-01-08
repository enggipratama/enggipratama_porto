"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "./ui/spotlight";
import { CometCardProfile } from "@/components/cometcard";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

export function SpotlightPreview() {
  const socials = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/enggipratama",
      label: "Github",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://linkedin.com/in/enggipratama",
      label: "LinkedIn",
    },
    {
      icon: <Instagram size={20} />,
      href: "https://instagram.com/enggiipratama",
      label: "Instagram",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:work.enggipratama@gmail.com",
      label: "Email",
    },
  ];

  return (
    <div className="relative flex flex-col p-4 md:p-10 min-h-screen md:min-h-[25rem] w-full overflow-hidden rounded-md bg-white dark:bg-black/[0.96] antialiased items-center justify-center transition-colors duration-500">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none opacity-15 dark:opacity-15",
          "[background-size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]"
        )}
      />

      <Spotlight
        className="-top-20 left-0\ md:-top-20 md:left-60 text-neutral-300/50 dark:text-white"
        fill="currentColor"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-10 px-6 w-full max-w-5xl">
        <div className="flex flex-col font-mono items-center md:items-start max-w-2xl">
          <h1 className="bg-clip-text text-4xl md:text-5xl font-bold leading-tight flex items-center gap-3">
            Hi there 🙌
          </h1>

          <p className="mt-4 italic text-sm text-justify md:text-left text-neutral-700 dark:text-neutral-400 leading-relaxed">
            My name is{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Muhammad Einggi Gusti P
            </span>
            . I graduated with a{" "}
            <span className="text-neutral-900 dark:text-neutral-100">
              Bachelor&apos;s Degree in Computer Science
            </span>{" "}
            from the University of Muhammadiyah Malang in 2024. With a deep
            passion for technology, I am constantly evolving my skill set and am
            eager to contribute to innovative projects in dynamic environments.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {socials.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 transition-colors shadow-sm"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0">
          <CometCardProfile />
        </div>
      </div>
    </div>
  );
}
