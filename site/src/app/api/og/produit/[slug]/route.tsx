import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

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
      opportunity: { select: { title: true, sector: true, difficulty: true } },
    },
  });

  if (!product || !product.detail) {
    return new Response("Not found", { status: 404 });
  }

  const detail = product.detail;
  const opp = product.opportunity;

  // Parse viability score
  const vs = detail.viabilityScore ? JSON.parse(detail.viabilityScore) : null;
  const getScore = (key: string) => {
    if (!vs || !vs[key]) return 0;
    const v = vs[key];
    return typeof v === "object" ? v.score : v;
  };
  const overall = getScore("overall");

  // Score color
  const scoreColor = overall >= 70 ? "#22c55e" : overall >= 50 ? "#f59e0b" : "#ef4444";

  // Difficulty color
  const diffColor =
    opp.difficulty === "facile" ? "#22c55e" : opp.difficulty === "moyenne" ? "#f59e0b" : "#ef4444";

  const scores = [
    { label: "Demande", value: getScore("demand"), color: getScore("demand") >= 70 ? "#22c55e" : getScore("demand") >= 50 ? "#f59e0b" : "#ef4444" },
    { label: "Faisabilité", value: getScore("feasibility"), color: getScore("feasibility") >= 70 ? "#22c55e" : getScore("feasibility") >= 50 ? "#f59e0b" : "#ef4444" },
    { label: "Marché", value: getScore("market"), color: getScore("market") >= 70 ? "#22c55e" : getScore("market") >= 50 ? "#f59e0b" : "#ef4444" },
    { label: "Concurrence", value: getScore("competition"), color: getScore("competition") >= 70 ? "#22c55e" : getScore("competition") >= 50 ? "#f59e0b" : "#ef4444" },
    { label: "Juridique", value: getScore("legal"), color: getScore("legal") >= 70 ? "#22c55e" : getScore("legal") >= 50 ? "#f59e0b" : "#ef4444" },
  ];

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
        {/* Header: logo + sector + difficulty */}
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
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "4px 12px",
                color: "#a1a1aa",
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
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                padding: "4px 12px",
                color: "#a1a1aa",
                fontSize: "14px",
              }}
            >
              MVP : {detail.timeToMvp}
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "36px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {product.text.length > 100 ? product.text.substring(0, 100) + "..." : product.text}
        </div>

        {/* One-liner */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "20px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {detail.oneLiner.length > 120 ? detail.oneLiner.substring(0, 120) + "..." : detail.oneLiner}
        </div>

        {/* Score section */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "flex-end",
            gap: "40px",
          }}
        >
          {/* Overall score */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#71717a", marginBottom: "8px" }}>
              Score de viabilité
            </span>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 900,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {overall}
            </div>
            <span style={{ fontSize: "20px", color: "#71717a" }}>/100</span>
          </div>

          {/* Sub-scores */}
          <div style={{ display: "flex", gap: "20px", marginLeft: "20px" }}>
            {scores.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#71717a" }}>{s.label}</span>
                <div
                  style={{
                    width: "60px",
                    height: "8px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${s.value}%`,
                      height: "100%",
                      background: s.color,
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: s.color,
                  }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
