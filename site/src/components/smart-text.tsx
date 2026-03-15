"use client";

import { Acronym, ACRONYM_KEYS } from "@/components/acronym";

const ACRONYM_SET = new Set(ACRONYM_KEYS);

function escapeRegex(s: string): string {
  return s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

const ACRONYM_PATTERN = new RegExp(
  String.raw`\b(${ACRONYM_KEYS.map(escapeRegex).join("|")})\b`,
  "g"
);

/**
 * Affiche du texte et enveloppe automatiquement les acronymes connus
 * avec le composant Acronym (tooltip au survol).
 * À utiliser pour tout contenu texte dans l'app.
 * Optionnel : className pour appliquer des styles au conteneur.
 */
export function SmartText({
  children,
  className,
}: Readonly<{ children: string; className?: string }>) {
  const text = String(children);
  if (!text) return null;

  const parts = text.split(ACRONYM_PATTERN);

  const content = (
    <>
      {parts.map((part, i) =>
        ACRONYM_SET.has(part) ? (
          <Acronym key={`${i}-${part}`}>{part}</Acronym>
        ) : (
          part
        )
      )}
    </>
  );

  if (className) {
    return <span className={className}>{content}</span>;
  }
  return content;
}
