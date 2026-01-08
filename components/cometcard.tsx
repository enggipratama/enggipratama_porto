import { CometCard } from "@/components/ui/comet-card";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CometCardProfile() {
  return (
    <CometCard>
      <button
        type="button"
        className={cn(
          "my-10 flex w-60 cursor-pointer flex-col items-stretch rounded-[20px] border p-2 md:my-20 md:p-4 transition-all duration-500",
          "bg-white border-neutral-200",
          "dark:bg-[#161616] dark:border-neutral-800"
        )}
        aria-label="Profile card"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        <div className="mx-2 flex-1">
          <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-neutral-100 dark:bg-neutral-800">
            <Image
              src="/Images/profile.jpeg"
              alt="Profile picture"
              fill
              priority
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8AKp79997wAAAABJRU5ErkJggg=="
              sizes="(max-width: 640px) 100vw, 240px"
              className="object-cover transition-all duration-500 hover:scale-110"
            />
          </div>
        </div>

        {/* Bagian Teks yang Adaptif */}
        <div className="mt-4 flex flex-shrink-0 items-center justify-between p-2 font-mono transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-white">
            Web Developer
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-gray-400 opacity-70">
            #Beginner
          </div>
        </div>
      </button>
    </CometCard>
  );
}
