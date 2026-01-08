"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      Icon: Github,
      href: "https://github.com/enggipratama",
      label: "GitHub",
    },
    {
      Icon: Linkedin,
      href: "https://linkedin.com/in/enggipratama",
      label: "LinkedIn",
    },
    {
      Icon: Instagram,
      href: "https://instagram.com/enggiipratama",
      label: "Instagram",
    },
    {
      Icon: Mail,
      href: "mailto:work.enggipratama@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="relative w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-xl font-bold font-mono text-neutral-800 dark:text-neutral-200 tracking-tighter">
              Enggi Pratama<span className="text-blue-500">.</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-mono text-center lg:text-left">
              Feel free to reach out. — Say hello anytime!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono text-center">
          © {currentYear} — Made with{" "}
          <motion.span
            aria-hidden
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex align-middle"
          >
            <Heart size={14} className="text-red-500 fill-red-500" />
          </motion.span>{" "}
          <span className="block sm:inline">by Enggi Pratama</span>
        </p>
      </div>
    </footer>
  );
}
