"use client";

import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Activity } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function GithubHeatmap({ username }: { username: string }) {
  return (
    <div className="relative z-10 h-full rounded-xl border border-neutral-300/50 bg-neutral-50/80 p-4 shadow-md shadow-neutral-200/40 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/50 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-sky-500" />
        <h3 className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
          Contribution Activity
        </h3>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[600px]">
          <GitHubCalendar
            username={username}
            blockSize={10}
            blockMargin={3}
            fontSize={12}
            style={{
              maxWidth: "100%",
            }}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#2d333b", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            renderBlock={(block, activity) =>
              React.cloneElement(block, {
                "data-tooltip-id": "github-tooltip",
                "data-tooltip-count": activity.count,
                "data-tooltip-date": activity.date,
              } as React.SVGProps<SVGRectElement>)
            }
          />
        </div>
      </div>

      <style jsx global>{`
        .react-github-calendar__legend,
        .react-github-calendar__legend-colors,
        [data-testid="calendar-legend"] {
          display: none !important;
        }
        .react-github-calendar__count,
        [data-testid="calendar-count"] {
          display: none !important;
        }
        .react-github-calendar > div:last-child,
        .react-github-calendar footer,
        .react-github-calendar__footer {
          display: none !important;
        }
        svg + div,
        svg ~ div {
          display: none !important;
        }
      `}</style>

      <Tooltip
        id="github-tooltip"
        className="z-50 rounded-lg text-xs"
        style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
        render={({ activeAnchor }) => {
          const count = activeAnchor?.getAttribute("data-tooltip-count");
          const date = activeAnchor?.getAttribute("data-tooltip-date");

          if (!date) return null;

          return (
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono">
                {count} contributions on{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}
