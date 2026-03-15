import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Le Filon — Opportunités cachées dans les données publiques françaises";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#f59e0b",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            F
          </div>
          <span
            style={{
              fontSize: "28px",
              color: "#f59e0b",
              fontWeight: 700,
            }}
          >
            Le Filon
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          Opportunités cachées dans les données publiques françaises
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            lineHeight: 1.5,
          }}
        >
          16 secteurs · 85 idées de produit · Validation marché · Score de viabilité
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#f59e0b",
              fontSize: "18px",
            }}
          >
            data.gouv.fr
          </div>
          <div
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#f59e0b",
              fontSize: "18px",
            }}
          >
            Étude de marché
          </div>
          <div
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#f59e0b",
              fontSize: "18px",
            }}
          >
            Open Data
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
