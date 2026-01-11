"use client";

import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Activity } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function GitHubHeatmap({ username }: { username: string }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-black p-6 rounded-xl border-2 w-full max-w-4xl mx-auto shadow-sm">
      <h3 className="text-sm font-medium mb-4 text-sky-500 self-start flex items-center gap-2">
        <Activity size={16} className="animate-pulse" /> Contribution Activity
      </h3>

      <div className="w-full overflow-x-auto pb-4">
        <div className="min-w-200 md:min-w-full">
          <GitHubCalendar
            username={username}
            labels={{
              totalCount: "{{count}} contributions in the last year",
            }}
            renderBlock={(block, activity) =>
              React.cloneElement(block, {
                "data-tooltip-id": "github-tooltip",
                "data-tooltip-count": activity.count,
                "data-tooltip-date": activity.date,
              } as React.SVGProps<SVGRectElement>)
            }
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#4a4e53", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            fontSize={12}
            blockSize={12}
            blockMargin={4}
          />
        </div>
      </div>

      <Tooltip
        id="github-tooltip"
        className="z-50 rounded-lg! text-xs! px-3! py-2!"
        style={{ backgroundColor: "#020617", color: "#f8fafc" }}
        render={({ activeAnchor }) => {
          const count = activeAnchor?.getAttribute("data-tooltip-count");
          const date = activeAnchor?.getAttribute("data-tooltip-date");

          if (!date) return null;

          return (
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-sky-400 animate-pulse" />
              <span>
                {count} |{" "}
                {new Date(date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}
