import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: restricted to known hosts only; extend ALLOWED_HOSTS when new
  // image origins are added. Full lockdown beats `hostname: "**"` (Next.js image
  // optimizer SSRF/DoS advisory).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "qxmyftognahkjuavloui.supabase.co" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
