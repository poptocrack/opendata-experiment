---
name: find-prospects
description: Trouver des prospects qualifiés à partir de datasets data.gouv.fr. Télécharge un dataset, identifie les entreprises avec un pain point récurrent, enrichit avec l'API Sirene, et génère une liste de contacts pour des interviews utilisateurs.
---

# Find Prospects — Recherche de prospects à partir de l'open data

## Objectif

À partir d'un dataset data.gouv.fr identifié, extraire une liste de prospects qualifiés (PME/ETI françaises) avec leurs contacts pour des interviews utilisateurs.

## Arguments

- `$0` : Description du type de prospects recherchés (ex: "entreprises assujetties à 4+ filières REP", "collectivités avec un rendement réseau eau sous le seuil")
- `$1` (optionnel) : ID du dataset data.gouv.fr à utiliser. Si absent, chercher le dataset pertinent via MCP.

## Workflow

### Étape 1 — Identifier le dataset

Si aucun dataset_id n'est fourni :
1. Utiliser `search_datasets` avec 3+ requêtes variées (synonymes, acronymes)
2. Pour chaque dataset prometteur, vérifier `get_metrics` (visites/téléchargements)
3. Choisir le dataset le plus pertinent et le plus riche

### Étape 2 — Télécharger et analyser

1. Télécharger le CSV brut via l'URL de la ressource (curl)
2. Sauvegarder dans le dossier `repTracker/` ou un sous-dossier dédié au projet
3. Analyser avec Python :
   - Identifier la structure (colonnes, clés de jointure)
   - Compter les entités uniques
   - Trouver le critère de segmentation pertinent (ex: nombre de filières, seuil de rendement)

### Étape 3 — Filtrer les prospects

1. Appliquer les filtres selon $0 :
   - Seuil minimum sur le critère identifié
   - Pays = FR uniquement
   - Exclure les grandes entreprises (grande distribution, constructeurs auto, GAFAM)
2. Extraire les identifiants (SIREN/SIRET) de chaque prospect

### Étape 4 — Enrichir avec Sirene

Pour chaque prospect, appeler l'API publique :
```
https://recherche-entreprises.api.gouv.fr/search?q={SIREN}
```

Extraire :
- `nom_complet`
- `categorie_entreprise` (PME, ETI, GE)
- `tranche_effectif_salarie`
- `activite_principale` + `section_activite_principale`
- `siege.commune`, `siege.code_postal`, `siege.departement`
- `date_creation`
- `nombre_etablissements`

Rate limit : 5 requêtes puis `time.sleep(0.2)`. Timeout 5s par requête.

### Étape 5 — Filtrer PME/ETI

Garder uniquement `categorie_entreprise` in ("PME", "ETI", "").
Trier par le critère de segmentation (décroissant).

### Étape 6 — Rechercher les contacts

Pour les 10-15 meilleurs prospects, utiliser WebSearch pour trouver :
- Le dirigeant (Président, DG, Gérant) via societe.com ou pappers.fr
- Le responsable qualité/achats/environnement via LinkedIn
- Le profil LinkedIn de l'entreprise

### Étape 7 — Générer les livrables

Sauvegarder dans le dossier du projet :

1. **`prospects-enriched.json`** — Liste complète des prospects avec données Sirene
2. **`prospects-enriched.csv`** — Même chose en CSV (pour Excel/Sheets)
3. **`interview-targets.md`** — Top 10 prospects avec :
   - Nom de l'entreprise, activité, lieu, taille
   - Nombre de [critère], filières/détails
   - Contact identifié + lien LinkedIn
   - Raison de les contacter (personnalisée)
   - Template de message LinkedIn
   - Questions pour l'interview (15 min)

## Règles

- Ne jamais inventer de données — toutes les métriques viennent des APIs
- Être respectueux du rate limiting des APIs publiques
- Prioriser les PME (50-250 salariés) qui ont la douleur maximale sans les ressources pour la gérer
- Les questions d'interview doivent être ouvertes et non-biaisées (pas "est-ce que c'est dur ?", mais "comment vous faites aujourd'hui ?")
- Le template de message ne doit pas être commercial — c'est de la recherche utilisateur
