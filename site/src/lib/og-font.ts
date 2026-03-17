let fontCache: ArrayBuffer | null = null;

export async function getGeistFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const res = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-400-normal.woff"
  );
  fontCache = await res.arrayBuffer();
  return fontCache;
}

let fontBoldCache: ArrayBuffer | null = null;

export async function getGeistFontBold(): Promise<ArrayBuffer> {
  if (fontBoldCache) return fontBoldCache;
  const res = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-700-normal.woff"
  );
  fontBoldCache = await res.arrayBuffer();
  return fontBoldCache;
}
