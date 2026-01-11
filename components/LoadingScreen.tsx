"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "@/public/Loading/astronaut.json";
import { TypingText } from "./TypingText";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, 4500);

    const cleanup = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`
        fixed inset-0 z-99999
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
