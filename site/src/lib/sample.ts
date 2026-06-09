/**
 * Fiche produit offerte en accès libre comme échantillon de démonstration.
 * Objectif conversion : permettre au visiteur de juger la profondeur d'une fiche
 * complète AVANT d'acheter, ce qui dé-risque l'achat à l'aveugle à 79€.
 *
 * Choix : la fiche immobilier la plus riche et la plus consultée (trafic Reddit
 * majoritairement sur le secteur immobilier).
 */
export const FREE_SAMPLE_SLUG =
  "score-de-quartier-multicritere-prix-dvf-securite-dpe-risques-naturels-ecoles-dyn";

export function isFreeSample(slug: string): boolean {
  return slug === FREE_SAMPLE_SLUG;
}
