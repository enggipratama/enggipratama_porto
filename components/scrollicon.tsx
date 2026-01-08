"use client";

import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import scrollAnimation from "@/public/Loading/scroll.json";

export function ScrollIcon() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest <= 80);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
      }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="flex flex-col items-center gap-1">
        <motion.div className="w-20 h-20">
          <Lottie animationData={scrollAnimation} loop autoplay />
        </motion.div>
      </div>
    </motion.div>
  );
}
