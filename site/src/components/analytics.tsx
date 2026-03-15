"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/panel-")) return;

    const referrer = document.referrer || null;

    // Fire and forget — no await, no error handling
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
