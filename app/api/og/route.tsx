import { ImageResponse } from "next/og";
import { getAllSettings } from "@/lib/data";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const settings = await getAllSettings();
    const name = settings.hero_name || "Enggi Pratama";
    const title = settings.about_title || "Full-Stack Developer";
    const tagline = settings.hero_tagline || "Transforming complex problems into elegant solutions, one line of code at a time.";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundImage: "radial-gradient(circle at 10% 20%, #1e1b4b 0%, #09090b 100%)",
            padding: "80px",
            color: "white",
          }}
        >
          {/* Decorative glows */}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              right: "-150px",
              width: "500px",
              height: "500px",
              borderRadius: "500px",
              backgroundColor: "rgba(14, 165, 233, 0.12)",
              filter: "blur(100px)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-150px",
              left: "-150px",
              width: "500px",
              height: "500px",
              borderRadius: "500px",
              backgroundColor: "rgba(168, 85, 247, 0.12)",
              filter: "blur(100px)",
              display: "flex",
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "30px",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "8px", backgroundColor: "#10b981", marginRight: "8px" }} />
            <span style={{ fontSize: "14px", color: "#d4d4d8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
              Portfolio Website
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "10px",
              color: "white",
              fontFamily: "sans-serif",
            }}
          >
            {name}
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: "28px",
              color: "#38bdf8",
              fontWeight: 500,
              marginBottom: "24px",
              fontFamily: "sans-serif",
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: "20px",
              color: "#a1a1aa",
              maxWidth: "850px",
              lineHeight: 1.6,
              fontFamily: "sans-serif",
            }}
          >
            {tagline}
          </p>

          {/* Footer details */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
              fontFamily: "monospace",
            }}
          >
            <span style={{ fontSize: "16px", color: "#71717a" }}>enggipratama.my.id</span>
            <span style={{ margin: "0 10px", color: "#52525b" }}>·</span>
            <span style={{ fontSize: "16px", color: "#71717a" }}>Available for Opportunities</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("OG generation error", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
