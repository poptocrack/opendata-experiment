import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const opp = await prisma.opportunity.findUnique({
    where: { slug },
    include: {
      signals: { orderBy: { order: "asc" }, take: 4 },
      productIdeas: { select: { id: true } },
      datasets: { select: { id: true } },
      apis: { select: { id: true } },
    },
  });

  if (!opp) {
    return new Response("Not found", { status: 404 });
  }

  const diffColor =
    opp.difficulty === "facile" ? "#22c55e" : opp.difficulty === "moyenne" ? "#f59e0b" : "#ef4444";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "#f59e0b",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 900,
              color: "#0a0a0a",
            }}
          >
            F
          </div>
          <span style={{ color: "#f59e0b", fontSize: "20px", fontWeight: 700 }}>Le Filon</span>
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            <span
              style={{
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: "6px",
                padding: "4px 12px",
                color: "#f59e0b",
                fontSize: "14px",
              }}
            >
              {opp.sector}
            </span>
            <span
              style={{
                background: `${diffColor}20`,
                border: `1px solid ${diffColor}50`,
                borderRadius: "6px",
                padding: "4px 12px",
                color: diffColor,
                fontSize: "14px",
              }}
            >
              {opp.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "44px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
          }}
        >
          {opp.title}
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "22px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {opp.tagline.length > 150 ? opp.tagline.substring(0, 150) + "..." : opp.tagline}
        </div>

        {/* Signals */}
        <div style={{ marginTop: "auto", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {opp.signals.map((signal, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                minWidth: "180px",
              }}
            >
              <span style={{ fontSize: "28px", fontWeight: 900, color: "#f59e0b" }}>
                {signal.value}
              </span>
              <span style={{ fontSize: "13px", color: "#71717a" }}>{signal.label}</span>
            </div>
          ))}
        </div>

        {/* Footer stats */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "24px",
            fontSize: "14px",
            color: "#52525b",
          }}
        >
          <span>{opp.productIdeas.length} idées de produit</span>
          <span>{opp.datasets.length} datasets</span>
          {opp.apis.length > 0 && <span>{opp.apis.length} APIs</span>}
          <span>{opp.monetization}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
