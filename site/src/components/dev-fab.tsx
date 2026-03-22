"use client";

import { useState, useEffect } from "react";

export function DevFab() {
  const [open, setOpen] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setPaid(document.cookie.includes("lefilon_dev_paid=true"));
  }, []);

  function togglePaid() {
    const newVal = !paid;
    setPaid(newVal);
    if (newVal) {
      document.cookie = "lefilon_dev_paid=true; path=/; max-age=31536000; samesite=lax";
    } else {
      document.cookie = "lefilon_dev_paid=; path=/; max-age=0";
    }
    window.location.reload();
  }

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition-colors"
        title="Dev tools"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-16 right-4 z-50 w-72 rounded-lg border border-border bg-background p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-violet-500">Dev Tools</h4>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-xs">
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Paywall</span>
              <button
                onClick={togglePaid}
                className={`relative h-6 w-11 rounded-full transition-colors ${paid ? "bg-green-500" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${paid ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {paid ? "Mode payé — accès complet" : "Mode gratuit — paywall actif"}
            </p>
          </div>
        </>
      )}
    </>
  );
}
