import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    
    // Secure endpoint by restricting domains
    const isAllowed = hostname.endsWith("enggipratama.my.id") || hostname.endsWith("my.id");

    if (!isAllowed) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "MEGP-Portfolio-HealthCheck/1.0",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let status = "down";
    if (response.status === 503 || response.status === 502) {
      status = "maintenance";
    } else if (response.ok) {
      status = "up";
    }

    return NextResponse.json(
      { status },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { status: "down" },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=30",
        },
      }
    );
  }
}
