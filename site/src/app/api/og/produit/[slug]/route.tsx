import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getGeistFont, getGeistFontBold } from "@/lib/og-font";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.productIdea.findUnique({
    where: { slug },
    include: {
      detail: true,
      opportunity: {
        select: {
          title: true,
          sector: true,
          difficulty: true,
          signals: { orderBy: { order: "asc" }, take: 1 },
        },
      },
    },
  });

  if (!product || !product.detail) {
    return new Response("Not found", { status: 404 });
  }

  const detail = product.detail;
  const opp = product.opportunity;

  const vs = detail.viabilityScore ? JSON.parse(detail.viabilityScore) : null;
  const getScore = (key: string) => {
    if (!vs || !vs[key]) return 0;
    const v = vs[key];
    return typeof v === "object" ? v.score : v;
  };
  const overall = getScore("overall");
  const scoreColor = overall >= 70 ? "#059669" : overall >= 50 ? "#1d4ed8" : "#dc2626";

  // Smart short title
  const raw = detail.oneLiner.split(/[.,:—–]/).filter(Boolean)[0]?.trim() || detail.oneLiner;
  const title = raw.length > 50 ? raw.substring(0, 47) + "..." : raw;

  // Tags: sector, difficulty, MVP
  const diffLabel = opp.difficulty === "facile" ? "Facile" : opp.difficulty === "moyenne" ? "Moyen" : "Complexe";
  const diffColor = opp.difficulty === "facile" ? "#059669" : opp.difficulty === "moyenne" ? "#d97706" : "#dc2626";
  const diffBg = opp.difficulty === "facile" ? "#ecfdf5" : opp.difficulty === "moyenne" ? "#fffbeb" : "#fef2f2";

  // Signal text
  const signalText = opp.signals[0] ? `${opp.signals[0].value} ${opp.signals[0].label}` : "";

  // SVG noise pattern for grain effect (base64 encoded tiny noise)
  const grainSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.08'/></svg>`;
  const grainDataUri = `data:image/svg+xml,${encodeURIComponent(grainSvg)}`;

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
        {/* Left: text content */}
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 52px 44px 52px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", fontWeight: 700, fontSize: "17px", color: "#1c1917" }}>
              Le Filon
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: "46px",
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginTop: "20px",
            }}
          >
            {title}
          </div>

          {/* Sector subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: "17px",
              color: "#78716c",
              lineHeight: 1.5,
              marginTop: "12px",
            }}
          >
            {opp.title}
          </div>

          {/* Tags row */}
          <div style={{ display: "flex", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                background: "#ecfdf5",
                color: "#059669",
                borderRadius: "20px",
                border: "1.5px solid #05966920",
                padding: "8px 18px",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              {opp.sector}
            </div>
            <div
              style={{
                display: "flex",
                background: diffBg,
                color: diffColor,
                borderRadius: "20px",
                padding: "8px 18px",
                fontSize: "15px",
                fontWeight: 600,
                border: `1.5px solid ${diffColor}20`,
              }}
            >
              {diffLabel}
            </div>
            <div
              style={{
                display: "flex",
                background: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: "20px",
                padding: "8px 18px",
                fontSize: "15px",
                fontWeight: 600,
                border: "1.5px solid #1d4ed820",
              }}
            >
              MVP {detail.timeToMvp}
            </div>
            {signalText && (
              <div
                style={{
                  display: "flex",
                  background: "#fefce8",
                  color: "#a16207",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  fontSize: "15px",
                  fontWeight: 600,
                  border: "1.5px solid #a1620720",
                }}
              >
                {signalText.length > 30 ? signalText.substring(0, 28) + "..." : signalText}
              </div>
            )}
          </div>

          {/* Bottom: domain */}
          <div style={{ display: "flex", fontSize: "14px", color: "#a8a29e", marginTop: "auto" }}>
            lefilon.net
          </div>
        </div>

        {/* Right: abstract visual with grain */}
        <div
          style={{
            width: "45%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background: "#e8e6e1",
          }}
        >
          {/* Grain overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url("${grainDataUri}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
              display: "flex",
              zIndex: 5,
            }}
          />

          {/* Large score-colored circle */}
          <div
            style={{
              position: "absolute",
              width: "340px",
              height: "340px",
              borderRadius: "170px",
              background: scoreColor,
              opacity: 0.85,
              top: "70px",
              right: "-50px",
              display: "flex",
            }}
          />
          {/* Dark circle */}
          <div
            style={{
              position: "absolute",
              width: "130px",
              height: "130px",
              borderRadius: "65px",
              background: "#1c1917",
              bottom: "90px",
              left: "50px",
              display: "flex",
            }}
          />
          {/* Small white accent */}
          <div
            style={{
              position: "absolute",
              width: "50px",
              height: "50px",
              borderRadius: "25px",
              background: "#f5f5f0",
              opacity: 0.7,
              top: "110px",
              left: "130px",
              display: "flex",
            }}
          />

          {/* Score bubble */}
          <div
            style={{
              width: "170px",
              height: "170px",
              borderRadius: "85px",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "64px",
                fontWeight: 700,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {overall}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: await getGeistFont(), weight: 400, style: "normal" },
        { name: "Geist", data: await getGeistFontBold(), weight: 700, style: "normal" },
      ],
    }
  );
}
