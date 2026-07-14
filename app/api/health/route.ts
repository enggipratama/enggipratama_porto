import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isLocalHost = hostname === "localhost" || hostname.endsWith(".localhost");
    const isPrivateIp =
      /^(10|127)\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      hostname === "0.0.0.0" ||
      hostname === "::1";

    if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.port || isLocalHost || isPrivateIp) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(parsedUrl, {
        method: "GET",
        headers: { "User-Agent": "MEGP-Portfolio-HealthCheck/1.0" },
        signal: controller.signal,
      });

      const status = response.status === 502 || response.status === 503
        ? "maintenance"
        : response.ok
          ? "up"
          : "down";

      return NextResponse.json(
        { status },
        { headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30" } },
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    return NextResponse.json(
      { status: "down" },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } },
    );
  }
}
