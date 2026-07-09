"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TypingText } from "./TypingText";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const animationData = require("@/public/Loading/astronaut.json") as object;

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 2000);

    const cleanup = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white dark:bg-black
        transform transition-transform duration-700 ease-in-out
        ${animateOut ? "-translate-y-full" : "translate-y-0"}
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
