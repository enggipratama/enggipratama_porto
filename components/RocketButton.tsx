"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import rocketAnimation from "@/public/Loading/rocket.json"; // Rocket Lottie JSON

interface RocketButtonProps {
  isLoading: boolean;
  success: boolean;
  children: string;
  onClick: () => void;
}

export default function RocketButton({
  isLoading,
  success,
  children,
  onClick,
}: RocketButtonProps) {
  const [displayText, setDisplayText] = useState(children);

  // Typing animation for "Sending..."
  useEffect(() => {
    if (isLoading) {
      let i = 0;
      const text = "Sending...";
      setDisplayText("");
      const interval = setInterval(() => {
        setDisplayText((prev) => prev + text[i]);
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 80);
      return () => clearInterval(interval);
    } else if (success) {
      setDisplayText("Message sent successfully 🚀");
    } else {
      setDisplayText(children);
    }
  }, [isLoading, success, children]);

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      className="w-full py-3 rounded bg-black text-white dark:bg-white dark:text-black flex justify-center items-center relative overflow-hidden"
      whileTap={{ scale: 0.95 }}
    >
      {isLoading && (
        <motion.div className="absolute left-3 w-6 h-6">
          <Lottie animationData={rocketAnimation} loop autoplay />
        </motion.div>
      )}
      <span
        className={`transition-opacity duration-300 ml-${isLoading ? "6" : "0"}`}
      >
        {displayText}
      </span>
    </motion.button>
  );
}
