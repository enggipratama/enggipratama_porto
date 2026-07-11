"use client";

import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DynamicThemeColor } from "@/components/dynamic-theme-color";

/**
 * Conditionally wraps children with the portfolio shell (Navbar, Footer, LoadingScreen).
 * Admin routes (/admin/*) are rendered without the portfolio chrome.
 */
export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin routes render without portfolio navbar/footer
  if (isAdmin) {
    return (
      <>
        <DynamicThemeColor />
        <LoadingScreen />
        {children}
      </>
    );
  }

  return (
    <>
      <DynamicThemeColor />
      <LoadingScreen />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
}
