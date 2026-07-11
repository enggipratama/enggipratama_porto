"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TypingText } from "./TypingText";

import { usePathname } from "next/navigation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const animationData = require("@/public/Loading/astronaut.json") as object;

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [animateState, setAnimateState] = useState<"top" | "center" | "out">("center");
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    // 1. Slide up to exit after 5 seconds (5000ms)
    const exitTimer = setTimeout(() => {
      setAnimateState("out");
    }, 5000);

    // 2. Unmount after transition completes (5000ms + 700ms transition duration = 5700ms)
    const cleanup = setTimeout(() => {
      setLoading(false);
    }, 5700);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(cleanup);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        ${isAdmin ? "bg-black text-white dark" : "bg-white dark:bg-black"}
        transform transition-transform duration-700 ease-in-out
        ${
          animateState === "top"
            ? "-translate-y-full"
            : animateState === "center"
            ? "translate-y-0"
            : "-translate-y-full"
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-40">
          <Lottie animationData={animationData} loop autoplay />
        </div>

        <TypingText
          texts={["Fly Higher 🚀", "Build Faster ⚡", "Dream Bigger ❤️"]}
        />
      </div>
    </div>
  );
}
