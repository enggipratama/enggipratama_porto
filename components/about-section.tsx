"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { SiteSettings } from "@/lib/data";

const getSocialHref = (platform: string, href: string) => {
  if (platform === "email" && href && !href.startsWith("mailto:")) {
    return `mailto:${href}`;
  }
  return href;
};

interface SocialLinkData {
  label: string;
  href: string;
  platform: string;
  icon?: string;
  color?: string;
}

function SocialIconLink({ link }: { link: SocialLinkData }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseColor = "text-neutral-700 dark:text-neutral-300";
  
  let activeColorClass = "";
  let activeStyle: React.CSSProperties = {};
  
  if (isHovered) {
    if (link.platform === "github") {
      activeColorClass = "text-neutral-900 dark:text-white";
    } else if (link.platform === "linkedin") {
      activeColorClass = "text-blue-600 dark:text-blue-400";
    } else if (link.platform === "instagram") {
      activeColorClass = "text-pink-600 dark:text-pink-400";
    } else if (link.platform === "email") {
      activeColorClass = "text-sky-500 dark:text-sky-400";
    } else if (link.color) {
      activeStyle = { color: link.color };
    } else {
      activeColorClass = "text-sky-500 dark:text-sky-400";
    }
  }
  
  let Icon = Lucide.Globe;
  if (link.platform === "github") Icon = Lucide.Github;
  else if (link.platform === "linkedin") Icon = Lucide.Linkedin;
  else if (link.platform === "instagram") Icon = Lucide.Instagram;
  else if (link.platform === "email") Icon = Lucide.Mail;
  else if (link.icon) {
    const IconComp = (Lucide as any)[link.icon];
    if (IconComp) Icon = IconComp;
  }
  
  return (
    <motion.a
      href={getSocialHref(link.platform, link.href)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-xl bg-neutral-200 p-3 transition-all dark:bg-neutral-800 hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50",
        isHovered ? activeColorClass : baseColor
      )}
      style={activeStyle}
    >
      <Icon size={18} />
    </motion.a>
  );
}

interface SpotlightPreviewProps {
  settings?: SiteSettings;
}

export function SpotlightPreview({ settings }: SpotlightPreviewProps) {
  const fullName = settings?.about_fullname || "Muhammad Einggi Gusti P";
  const nickname = settings?.about_nickname || "Enggi";
  const badgeTitle = settings?.about_badge_title || "Full-Stack Dev";
  const badgeText = settings?.about_badge_text || "Open to Collaborate";
  const profileImage = settings?.about_profile_image || "/Images/profile.png";
  const cvUrl = settings?.about_cv_url || "/Resume.pdf";
  
  const paragraphs = Array.isArray(settings?.about_description)
    ? (settings.about_description as string[])
    : [
        "My full name is Muhammad Einggi Gusti P, a passionate Full-Stack Developer with a strong foundation in Computer Science from Universitas Muhammadiyah Malang. I specialize in building scalable web applications that combine clean code with intuitive user experiences.",
        "Currently focused on modern JavaScript ecosystems and Laravel ecosystem, always eager to tackle challenging problems and learn cutting-edge technologies.",
      ];

  const dbSkills = Array.isArray(settings?.skills)
    ? (settings.skills as { name: string; variant: string }[])
    : [
        { name: "Next.js", variant: "neutral" },
        { name: "React", variant: "sky" },
        { name: "TypeScript", variant: "blue" },
        { name: "Tailwind", variant: "cyan" },
        { name: "Laravel", variant: "red" },
        { name: "PHP", variant: "indigo" },
        { name: "MySQL", variant: "blue" },
        { name: "Framer", variant: "pink" },
      ];

  const dbSocials = Array.isArray(settings?.social_links)
    ? (settings.social_links as { label: string; href: string; platform: string }[])
    : [
        { label: "Github", href: "https://github.com/enggipratama", platform: "github" },
        { label: "LinkedIn", href: "https://linkedin.com/in/enggipratama", platform: "linkedin" },
        { label: "Instagram", href: "https://instagram.com/enggiipratama", platform: "instagram" },
        { label: "Email", href: "mailto:work.enggipratama@gmail.com", platform: "email" },
      ];

  return (
    <section className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-white py-12 px-4 font-mono antialiased dark:bg-black md:min-h-[30rem] md:py-20 md:px-10">
      {/* Background Grid */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 select-none opacity-[0.08] dark:opacity-15",
          "[background-size:30px_30px]",
          "[mask-image:radial-gradient(ellipse_at_center,black,transparent)]",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)]"
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-10 px-4 sm:px-6 md:flex-row md:gap-12">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0 }}
          className="flex max-w-2xl flex-col items-center md:items-start"
        >
          {/* Badge */}
          <div className="mb-4">
            <Badge variant="success" icon={
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            }>
              {badgeText}
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold leading-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl text-center md:text-left">
            Hello, I&apos;m {nickname} <span className="inline-block animate-bounce">👋</span>
          </h1>

          {/* Description */}
          <div className="mt-4 space-y-3">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-justify text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {para}
              </p>
            ))}
          </div>

          {/* Tech Stack - Staggered reveal animation */}
          <motion.div 
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start"
          >
            {dbSkills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 10 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: {
                      type: "tween",
                      ease: [0.16, 1, 0.3, 1],
                      duration: 0.5
                    }
                  }
                }}
              >
                <Badge variant={skill.variant as any}>
                  {skill.name}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Icons + Resume */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full md:justify-start">
              {dbSocials.map((link) => (
                <SocialIconLink key={link.label} link={link as any} />
              ))}
            
            {/* Download CV Button */}
            <motion.a
              href={cvUrl}
              download={cvUrl.split("/").pop() || "Resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto md:ml-auto flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-sky-600"
            >
              <Lucide.Download size={14} />
              Download CV
            </motion.a>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0, delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="flex-shrink-0"
        >
          <div className="my-6 w-full max-w-[280px] cursor-pointer rounded-[20px] border border-neutral-300/50 bg-neutral-50/80 p-4 shadow-xl shadow-neutral-200/40 backdrop-blur-md transition-all duration-500 hover:ring-2 hover:ring-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-white/[0.08] dark:bg-neutral-800/80 dark:shadow-2xl dark:shadow-black/50 dark:hover:ring-sky-500/50 dark:hover:shadow-sky-500/10 md:my-0 md:p-5">
            <div className="mx-1 flex-1">
              <div className="relative mt-1 aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-neutral-200 dark:bg-neutral-800">
                <Image
                  src={profileImage}
                  alt="Profile picture"
                  fill
                  priority
                  quality={75}
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover transition-all duration-500 hover:scale-110"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="mt-3 text-center">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 font-mono tracking-tighter">
                {fullName}
              </h2>
            </div>

            {/* Card Footer dengan badge style */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="sky">{badgeTitle}</Badge>
              <Badge variant="success">Open to Work</Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
