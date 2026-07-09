"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});

const Footer = dynamic(
  () => import("@/components/footer").then((m) => ({ default: m.Footer })),
  { ssr: false }
);

export function LayoutClient({ children }: { children: React.ReactNode }) {
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
