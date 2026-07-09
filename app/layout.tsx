import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PortfolioShell } from "@/components/portfolio-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getAllSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const title = settings.seo_title || "Enggi Pratama | Full-Stack Developer";
  const description = settings.seo_description || "Personal portfolio website of Enggi Pratama, built with Next.js, React, and Supabase.";
  const keywords = settings.seo_keywords || "Enggi Pratama, portfolio, web developer, full-stack, react, nextjs";

  return {
    title: {
      default: title,
      template: `%s - ${settings.about_nickname || "MEGP"}`,
    },
    description: description,
    keywords: keywords,
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Blocking script — runs synchronously before any render to prevent dark mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),s=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==='system'&&s)||(!t&&s)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}document.addEventListener('DOMContentLoaded',function(){requestAnimationFrame(function(){document.documentElement.classList.add('theme-ready')})})})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-neutral-900 antialiased dark:bg-black dark:text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PortfolioShell>{children}</PortfolioShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
