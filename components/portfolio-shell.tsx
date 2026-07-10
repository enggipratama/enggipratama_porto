"use client";

import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Conditionally wraps children with the portfolio shell (Navbar, Footer, LoadingScreen).
 * Admin routes (/admin/*) are rendered without the portfolio chrome.
 */
export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin routes render without portfolio navbar/footer
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <LoadingScreen />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
}
