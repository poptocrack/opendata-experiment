import { ImageResponse } from "next/og";
import { getGeistFont, getGeistFontBold } from "@/lib/og-font";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5f5f0",
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Geist",
        }}
      >
        {/* Left: text */}
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 56px 48px 56px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                fontWeight: 700,
                fontSize: "22px",
                color: "#1c1917",
              }}
            >
              Le Filon
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                fontWeight: 700,
                color: "#1c1917",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Opportunités cachées dans les données publiques françaises
            </div>

            {/* Subtitle */}
            <div
              style={{
                display: "flex",
                fontSize: "22px",
                color: "#78716c",
                lineHeight: 1.4,
              }}
            >
              17 secteurs analysés · 90 idées de produit
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
            }}
          >
            <div
              style={{ display: "flex", fontSize: "15px", color: "#a8a29e" }}
            >
              lefilon.net
            </div>
          </div>
        </div>

        {/* Right: abstract visual */}
        <div
          style={{
            width: "45%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background: "#eeece7",
          }}
        >
          {/* Large amber circle */}
          <div
            style={{
              position: "absolute",
              width: "360px",
              height: "360px",
              borderRadius: "180px",
              background: "#d97706",
              opacity: 0.85,
              top: "60px",
              right: "-60px",
              display: "flex",
            }}
          />
          {/* Dark circle */}
          <div
            style={{
              position: "absolute",
              width: "140px",
              height: "140px",
              borderRadius: "70px",
              background: "#1c1917",
              bottom: "80px",
              left: "40px",
              display: "flex",
            }}
          />
          {/* White accent */}
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "100px",
              background: "#ffffff",
              opacity: 0.9,
              top: "40px",
              left: "100px",
              display: "flex",
            }}
          />
          {/* Small yellow accent */}
          <div
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              borderRadius: "20px",
              background: "#fde68a",
              top: "160px",
              left: "70px",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: await getGeistFont(),
          weight: 400,
          style: "normal",
        },
        {
          name: "Geist",
          data: await getGeistFontBold(),
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
