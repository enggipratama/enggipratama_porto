"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

export default function GiscusWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [repo, setRepo] = useState("enggipratama/enggipratama");
  const [repoId, setRepoId] = useState("R_kgDOL-qXqQ");
  const [categoryId, setCategoryId] = useState("DIC_kwDOL-qXqc4C0tG-");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchGiscusSettings() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["giscus_repo", "giscus_repo_id", "giscus_category_id"]);
        if (!error && data) {
          const repoRow = data.find((r) => r.key === "giscus_repo");
          if (repoRow && repoRow.value) setRepo(repoRow.value);

          const repoIdRow = data.find((r) => r.key === "giscus_repo_id");
          if (repoIdRow && repoIdRow.value) setRepoId(repoIdRow.value);

          const categoryIdRow = data.find((r) => r.key === "giscus_category_id");
          if (categoryIdRow && categoryIdRow.value) setCategoryId(categoryIdRow.value);
        }
      } catch (err) {
        console.error("Failed to load Giscus settings:", err);
      }
    }
    fetchGiscusSettings();
  }, [mounted]);

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
              repo={repo as `${string}/${string}`}
              repoId={repoId}
              category="General"
              categoryId={categoryId}
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
