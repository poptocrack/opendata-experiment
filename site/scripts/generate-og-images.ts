import fs from "fs";
import path from "path";

const OG_DIR = path.resolve("public/og-images");
const OPP_DIR = path.resolve("prisma/opportunities");
const PROD_DIR = path.resolve("prisma/products");

function getScore(vs: any, key: string): number {
  if (!vs || !vs[key]) return 0;
  const v = vs[key];
  return typeof v === "object" ? v.score : v;
}

function scoreColor(val: number): string {
  if (val >= 70) return "#059669";
  if (val >= 50) return "#2563eb";
  return "#dc2626";
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.substring(0, max - 3) + "...";
}

function generateProductHtml(product: any): string {
  const detail = product;
  const overall = getScore(detail.viabilityScore, "overall");
  const color = scoreColor(overall);
  const title = escapeHtml(truncate(detail.oneLiner || detail.productSlug, 70));
  const mvp = escapeHtml(detail.timeToMvp || "N/A");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200, height=630">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  <div style="width: 1200px; height: 630px;" class="bg-white flex flex-col justify-between p-16">
    <!-- Top: logo + sector -->
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-stone-900 rounded-md flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
          <path d="M16 4 L26 14 L16 28 L6 14 Z" stroke="#f59e0b" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
          <path d="M6 14 L26 14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <span class="text-stone-900 text-lg font-bold">Le Filon</span>
      <span class="text-stone-400 text-lg mx-1">·</span>
      <span class="text-stone-500 text-lg">Idée de produit</span>
    </div>

    <!-- Middle: big title -->
    <div class="flex-1 flex items-center">
      <h1 class="text-[52px] font-extrabold text-stone-900 leading-[1.1] tracking-tight max-w-[950px]">
        ${title}
      </h1>
    </div>

    <!-- Bottom: score + mvp -->
    <div class="flex items-end gap-8">
      <div class="flex items-baseline gap-2">
        <span class="text-[72px] font-extrabold leading-none" style="color: ${color}">${overall}</span>
        <span class="text-2xl text-stone-400 font-medium">/100</span>
      </div>
      <div class="h-12 w-px bg-stone-200"></div>
      <div class="flex flex-col">
        <span class="text-xl text-stone-900 font-semibold">MVP en ${mvp}</span>
        <span class="text-base text-stone-500">Score de viabilité</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateSectorHtml(opp: any): string {
  const title = escapeHtml(truncate(opp.title, 50));
  const tagline = escapeHtml(truncate(opp.tagline, 120));
  const signals = (opp.signals || []).slice(0, 3);
  const nbProducts = (opp.productIdeas || []).length;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200, height=630">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  <div style="width: 1200px; height: 630px;" class="bg-white flex flex-col justify-between p-16">
    <!-- Top: logo + meta -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-stone-900 rounded-md flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path d="M16 4 L26 14 L16 28 L6 14 Z" stroke="#f59e0b" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
            <path d="M6 14 L26 14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="text-stone-900 text-lg font-bold">Le Filon</span>
        <span class="text-stone-400 text-lg mx-1">·</span>
        <span class="text-stone-500 text-lg">Analyse sectorielle</span>
      </div>
      <div class="flex gap-2">
        <span class="bg-stone-100 text-stone-600 text-sm font-semibold px-3 py-1 rounded">${opp.sector || ""}</span>
        <span class="bg-stone-100 text-stone-600 text-sm font-semibold px-3 py-1 rounded">${nbProducts} idées de produit</span>
      </div>
    </div>

    <!-- Title -->
    <div class="mt-10">
      <h1 class="text-[56px] font-extrabold text-stone-900 leading-[1.05] tracking-tight">${title}</h1>
      <p class="text-xl text-stone-500 mt-4 leading-relaxed max-w-[900px]">${tagline}</p>
    </div>

    <!-- Signals -->
    <div class="flex gap-4 mt-auto">
      ${signals.map((s: any) => `
        <div class="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-5 py-4">
          <div class="text-2xl font-extrabold text-stone-900">${escapeHtml(s.value)}</div>
          <div class="text-sm text-stone-400 mt-0.5">${escapeHtml(s.label)}</div>
        </div>
      `).join("")}
    </div>
  </div>
</body>
</html>`;
}

async function htmlToPng(html: string, outputPath: string): Promise<boolean> {
  try {
    const res = await fetch(
      "https://html2png.dev/api/convert?width=1200&height=630&format=png&deviceScaleFactor=2",
      {
        method: "POST",
        headers: { "Content-Type": "text/html" },
        body: html,
      }
    );
    const json = await res.json() as { url?: string };
    if (!json.url) {
      console.error("  No URL in response");
      return false;
    }
    const imgRes = await fetch(json.url);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    return true;
  } catch (e: any) {
    console.error("  Error:", e.message);
    return false;
  }
}

async function main() {
  // Generate sector images
  const oppFiles = fs.readdirSync(OPP_DIR).filter((f) => f.endsWith(".json"));
  console.log(`\nGenerating ${oppFiles.length} sector images...`);

  for (const file of oppFiles) {
    const opp = JSON.parse(fs.readFileSync(path.join(OPP_DIR, file), "utf-8"));
    const outPath = path.join(OG_DIR, `secteur-${opp.slug}.png`);

    if (fs.existsSync(outPath)) {
      console.log(`  ✓ ${opp.slug} (exists)`);
      continue;
    }

    const html = generateSectorHtml(opp);
    process.stdout.write(`  → ${opp.slug}...`);
    const ok = await htmlToPng(html, outPath);
    console.log(ok ? " ✓" : " ✗");
  }

  // Generate product images
  const prodFiles = fs.readdirSync(PROD_DIR).filter((f) => f.endsWith(".json"));
  console.log(`\nGenerating ${prodFiles.length} product images...`);

  for (const file of prodFiles) {
    const prod = JSON.parse(fs.readFileSync(path.join(PROD_DIR, file), "utf-8"));
    const outPath = path.join(OG_DIR, `produit-${prod.productSlug}.png`);

    if (fs.existsSync(outPath)) {
      console.log(`  ✓ ${prod.productSlug.substring(0, 50)} (exists)`);
      continue;
    }

    const html = generateProductHtml(prod);
    process.stdout.write(`  → ${prod.productSlug.substring(0, 50)}...`);
    const ok = await htmlToPng(html, outPath);
    console.log(ok ? " ✓" : " ✗");

    // Rate limit — be nice to the API
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\nDone!");
}

main();
