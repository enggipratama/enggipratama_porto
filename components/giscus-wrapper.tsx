"use client";
import { useState, useEffect } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function GiscusWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return <div className="min-h-[100px]" />;

  return (
    <section className="w-full font-mono text-center">
      {!isLoaded ? (
        <div className="py-10">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Click the button below to load messages and comments
          </p>
          <button
            onClick={() => setIsLoaded(true)}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold hover:scale-105 transition-transform shadow-xl"
          >
            OPEN GISCUS
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500" style={{ minHeight: '300px' }}>
          {/* Scale down Giscus UI */}
          <div 
            className="relative w-full overflow-hidden"
            style={{ 
              transform: 'scale(0.92)',
              transformOrigin: 'top center',
              marginLeft: '-4%',
              width: '108%'
            }}
          >
            <Giscus
              id="comments"
              repo="enggipratama/enggipratama"
              repoId="R_kgDOL-qXqQ"
              category="General"
              categoryId="DIC_kwDOL-qXqc4C0tG-"
              mapping="specific"
              term="Let's Connect"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              lang="id"
              loading="eager"
            />
          </div>

          <button
            onClick={() => setIsLoaded(false)}
            className="px-4 py-2 mt-3 bg-black dark:bg-white text-white dark:text-black rounded-md text-xs font-bold hover:scale-105 transition-transform shadow-xl"
          >
            Close Giscus
          </button>
        </div>
      )}
    </section>
  );
}
