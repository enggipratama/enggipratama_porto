"use client";

import { useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

/**
 * Dynamically sets the `<html>` background-color AND the `theme-color` meta tag
 * so that the browser overscroll area (top/bottom bounce) and status bar match
 * the currently visible section's background color.
 *
 * On mobile Safari / Chrome, the overscroll rubber-band area inherits from <html>.
 */
export function DynamicThemeColor() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  const setColors = useCallback((color: string) => {
    document.documentElement.style.backgroundColor = color;
    if (document.body) {
      document.body.style.backgroundColor = color;
    }

    const metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas.length > 0) {
      metas.forEach((meta) => {
        (meta as HTMLMetaElement).content = color;
        meta.removeAttribute("media");
      });
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);
    }
  }, []);
  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setColors("#0a0a0a");
      return;
    }

    const isDark = resolvedTheme === "dark";

    // Non-home pages: static color based on page background
    if (pathname !== "/") {
      const isContact = pathname.startsWith("/contact");
      setColors(isDark ? "#000000" : isContact ? "#f8fafc" : "#ffffff");
      return;
    }

    // Home page: dynamically update based on scroll position
    function update() {
      const isDarkNow = resolvedTheme === "dark";
      const heroSection = document.getElementById("home");

      if (!heroSection) {
        setColors(isDarkNow ? "#000000" : "#ffffff");
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const atBottom = scrollY + viewHeight >= docHeight - 10;

      // At the bottom of the page → footer color (white / black)
      if (atBottom) {
        setColors(isDarkNow ? "#000000" : "#ffffff");
        return;
      }

      // Hero is visible at top → match hero gradient top color
      if (rect.bottom > 80) {
        setColors(isDarkNow ? "#000000" : "#7dd3fc");
      } else {
        // Past hero → white / black (about, portfolio, github sections)
        setColors(isDarkNow ? "#000000" : "#ffffff");
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      // Reset to default on cleanup
      document.documentElement.style.backgroundColor = "";
    };
  }, [resolvedTheme, pathname, setColors]);

  return null;
}
