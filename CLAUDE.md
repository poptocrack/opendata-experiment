# Research - Outil de recherche d'opportunites

## Regles de dev du site

### SmartText obligatoire

Tout texte affiché dans un composant React DOIT utiliser `<SmartText>` (de `@/components/smart-text`).
Ce composant détecte automatiquement les acronymes connus et les enveloppe dans un `<Acronym>` avec tooltip au hover.

- Ne JAMAIS afficher du texte brut directement dans un `<p>`, `<span>`, `<div>`, `<td>`, etc. , toujours `<SmartText>{texte}</SmartText>`
- Si un acronyme apparaît dans le contenu et n'est pas encore dans `src/components/acronym.tsx`, l'ajouter au dictionnaire `definitions`
- Exceptions : labels courts de navigation, badges, noms propres

### Accents français obligatoires

Tout texte en français (composants, données JSON, labels) DOIT contenir les accents corrects (é, è, ê, à, ù, ç, î, ô, û).

- Ne JAMAIS écrire "opportunite", "donnees", "marche", "securite" , toujours "opportunité", "données", "marché", "sécurité"
- Les champs techniques (slug, id, clés JSON, URLs) restent sans accents
- Les valeurs de `confidenceLevels.level` restent "verifie"/"estime"/"opine" (compatibilité code)

## Objectif

Analyser les donnees du MCP data.gouv.fr pour identifier des opportunites de creation de produits repondant a des besoins reels, avec des personnes pretes a payer.

## MCP data.gouv.fr

Endpoint: https://mcp.data.gouv.fr/mcp (read-only, pas de cle API)

### Outils disponibles

**Datasets (fichiers statiques):**

- `search_datasets` - Recherche par mots-cles (query, page, page_size)
- `get_dataset_info` - Details d'un dataset (dataset_id)
- `list_dataset_resources` - Liste les ressources/fichiers d'un dataset (dataset_id)
- `get_resource_info` - Details d'une ressource (resource_id)
- `query_resource_data` - Interroger les donnees d'une ressource via Tabular API (question, resource_id)

**Dataservices (APIs externes):**

- `search_dataservices` - Recherche d'APIs (query, page, page_size)
- `get_dataservice_info` - Details d'un dataservice (dataservice_id)
- `get_dataservice_openapi_spec` - Spec OpenAPI d'un dataservice (dataservice_id)

**Metriques:**

- `get_metrics` - Visites/telechargements d'un dataset ou ressource (dataset_id, resource_id)

### Workflow recommande

1. `search_datasets` pour trouver le dataset
2. `list_dataset_resources` pour voir les ressources
3. `query_resource_data` (page_size=20) pour preview, puis paginer ou telecharger le fichier brut pour les gros datasets

## Skills installees

- `/tech-entrepreneur-coach-adhd` - Coach entrepreneur tech
- `/product-manager-toolkit` - Product Manager
- `/market-researcher` - Recherche de marche
- `/accountant-expert` - Comptable expert
- `/legal-advisor` - Conseiller juridique
- `/business-outcomes-advisor` - Conseiller resultats business
- `/data-analysis` - Analyse de donnees
- `/idea-consultant` - Consultant en idees/validation

## Architecture du site (site/)

### Stack
- Next.js 16 (App Router, SSG via generateStaticParams)
- shadcn/ui + Tailwind CSS (dark/light mode)
- Prisma + SQLite (prisma/dev.db)
- Données en fichiers JSON (prisma/opportunities/ et prisma/products/)

### Pages
- `/` — Landing (hero, méthodologie, ranking, grille opportunités)
- `/opportunites/[slug]` — Fiche opportunité (signaux, datasets, APIs, SWOT, personas, produits)
- `/produits/[productSlug]` — Fiche produit (score viabilité, problem/solution, validation terrain, roadmap, pricing, validation marché, tech, risques, confiance)

### Données
```
prisma/
  opportunities/   # 1 JSON par opportunité (XX-slug.json) — 16 fichiers
  products/        # 1 JSON par produit (slug-complet.json) — 85 fichiers
  seed.ts          # Loader auto — lit les JSON et peuple la DB
  schema.prisma    # Modèles : Opportunity, Signal, Dataset, Api, ProductIdea, ProductDetail, TargetCustomer, Competitor
```

### Commandes
- Seed : `DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts`
- Reset DB : `rm -f prisma/dev.db && npx prisma db push && DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts`
- Build : `npx next build`

### Composants obligatoires
- `<SmartText>` pour tout texte (auto-détection acronymes)
- `<Acronym>` dictionnaire dans src/components/acronym.tsx (ajouter les nouveaux acronymes ici)
- `<StatusBadge>` / `<DifficultyBadge>` pour les badges avec tooltips

### État actuel (mars 2026)
- 16 opportunités, 85 produits avec fiches complètes
- SWOT + Personas : 16/16
- Validation marché : 85/85
- Scores viabilité avec justifications : 85/85
- Niveaux de confiance : 85/85
- Accents français : OK

### TODO
- [ ] Paywall freemium (opportunités gratuites, produits payants)
- [ ] Skill `/analyze-sector` pour analyse sectorielle à la demande
- [ ] Cron découverte automatique (nouveaux datasets data.gouv.fr)
- [ ] Page macro PESTEL (mégatendances)
- [ ] Déploiement VPS (Caddy reverse proxy, domaine dataopps.fr)

---

## Règles d'analyse de secteur

### But

Determiner si un secteur contient suffisamment de donnees open data exploitables pour creer un ou plusieurs produits SaaS viables (objectif : 10K MRR).

### Criteres de rejet rapide (stop si un de ces criteres est vrai)

- Moins de 3 datasets pertinents dans le secteur
- Aucun dataset avec plus de 5K visites/an (= pas de demande prouvee)
- Donnees uniquement locales (1 departement/commune) sans equivalent national
- Marche domine par un acteur avec des donnees proprietaires inimitables
- Contrainte juridique bloquante (RGPD, licence restrictive) sans contournement

### Phase 1 : Exploration (15 min max par secteur)

**Recherches obligatoires :**

1. Minimum 3 requetes `search_datasets` avec des mots-cles varies (synonymes, acronymes, termes metier)
2. Minimum 1 requete `search_dataservices` pour trouver les APIs existantes
3. Pour chaque dataset prometteur : `get_metrics` pour mesurer la demande reelle (visites + telechargements)
4. Pour le top dataset : `get_dataset_info` pour comprendre le contenu, la licence, la frequence de MAJ

**Signaux a chercher :**

- Volume de visites/telechargements (proxy de la demande)
- Frequence de mise a jour (donnees vivantes vs snapshot ancien)
- Nombre de datasets dans le secteur (profondeur de l'ecosysteme)
- Existence d'APIs (facilite d'integration technique)
- Possibilite de croiser avec d'autres secteurs deja analyses

**Resultat attendu :** Decision go/no-go avec justification en 2 lignes.

### Phase 2 : Analyse approfondie (secteurs go uniquement)

**Pour chaque secteur retenu, produire :**

#### 2.1 Fiche opportunite (fichier `prisma/opportunities/XX-slug.json`)

```
Champs obligatoires :
- id, rank, title, slug, sector, tagline
- status : "exploration" (par defaut)
- difficulty : "facile" | "moyenne" | "complexe" (base sur le nombre de sources a croiser et la complexite du pipeline)
- marketSize : estimation qualitative du marche avec chiffres cles
- monetization : modele de revenu envisage avec fourchette de prix
- context : paragraphe d'analyse expliquant POURQUOI cette opportunite existe (pas juste QUOI)
- signals[] : 3-5 signaux chiffres prouves par les metriques data.gouv.fr
- datasets[] : tous les datasets pertinents avec metriques reelles
- apis[] : toutes les APIs disponibles avec baseUrl
- productIdeas[] : 4-6 idees de produit concrets et distincts
- targetCustomers[] : segments clients avec fourchette de prix
- competitors[] : concurrents identifies avec faiblesses specifiques
```

**Regles de qualite :**

- Les metriques (visites, telechargements) doivent etre reelles, pas inventees
- Le context doit expliquer le "pourquoi maintenant" (regulation, tendance, besoin non satisfait)
- Chaque productIdea doit etre suffisamment distinct pour justifier sa propre fiche produit
- Les competitors doivent etre des produits reels avec des faiblesses verifiables

#### 2.2 Fiches produit (fichiers `prisma/products/slug-du-produit.json`)

Une fiche par productIdea. Chaque fiche contient :

```
Vision :
- oneLiner : phrase d'accroche (max 20 mots)
- problem : le probleme concret vecu par l'utilisateur (pas abstrait)
- solution : comment le produit resout ce probleme
- uniqueValue : pourquoi CE produit et pas un existant

Execution :
- mvpScope : ce que le MVP contient ET ce qu'il ne contient PAS
- timeToMvp : estimation realiste pour un dev solo (4-10 semaines)
- milestones[] : 4-5 jalons de la validation au 10K MRR

Validation terrain (LE PLUS IMPORTANT) :
- validationChecks[] : 3-4 hypotheses a verifier AVANT de coder
  - check : l'hypothese
  - how : comment la verifier concretement
  - successCriteria : critere mesurable de succes

Go to market :
- earlyAdopters[] : qui contacter, ou les trouver, comment les approcher
  - Doit etre SPECIFIQUE : noms de communautes FR, groupes Facebook, forums, federations
- pricingStrategy : modele de prix avec justification
- pathTo10kMrr : CALCUL mathematique (X clients × Y prix = 10K)

Tech :
- techStack : frontend, backend, database, hosting, APIs a integrer
  - Doit etre adapte a un dev solo (pas de Kubernetes)

Risques :
- risks[] : 2-4 risques avec mitigation concrete
- inspirations : produits similaires dans d'autres marches/pays

Validation marche :
- searchVolume[] : mots-cles FR avec volume mensuel estime
- tamSamSom : TAM/SAM/SOM chiffre avec methodologie sourcee
- competitorDeep[] : concurrents avec pricing reel, trafic, avis, forces/faiblesses
- legalConstraints[] : RGPD, licences, restrictions avec status ok/attention/bloquant
- cacEstimate[] : CAC par canal avec taux de conversion et ratio LTV/CAC
```

**Regles de qualite fiches produit :**

- Le pathTo10kMrr doit etre un CALCUL, pas une aspiration
- Les earlyAdopters doivent pointer vers des lieux reels (pas "les professionnels du secteur")
- Le mvpScope doit explicitement lister ce qui N'EST PAS dans le MVP
- Les validationChecks doivent etre faisables en 2 semaines sans coder
- Le techStack doit utiliser des technos accessibles a un solo dev
- Les legalConstraints doivent identifier les vrais risques (DVF = donnees personnelles, DPE = OK, etc.)
- Le competitorDeep doit contenir des prix reels trouves sur les sites concurrents

### Phase 3 : Enrichissement croise

Apres l'analyse initiale, verifier systematiquement :

1. Est-ce que des datasets d'autres secteurs enrichissent cette opportunite ? (ex: criminalite enrichit l'immobilier)
2. Est-ce que des APIs deja identifiees dans d'autres secteurs sont reutilisables ? (ex: API BAN pour tout ce qui est geolocalise)
3. Est-ce que des idees de produit de ce secteur pourraient etre des features d'un produit d'un autre secteur ?

### Phase 4 : Cadrage etude de marche

Pour que l'analyse soit au standard d'une etude de marche professionnelle, chaque secteur doit aussi contenir :

#### 4.1 Analyse macro (au niveau du site, pas par secteur)

Le site doit contenir une page d'analyse macro (PESTEL-like) repondant a :

- Pourquoi les opportunites open data existent MAINTENANT (politique, regulation, technologie)
- Quelles megatendances portent ces opportunites (CSRD, loi Climat, transformation numerique collectivites, deserts medicaux, crise logement...)
- Quel est l'etat de l'ecosysteme open data francais

#### 4.2 SWOT par opportunite (champ `swot` dans le JSON opportunite)

```
swot: {
  strengths: ["..."],    // Forces internes du produit/approche
  weaknesses: ["..."],   // Faiblesses internes
  opportunities: ["..."], // Facteurs externes favorables
  threats: ["..."]       // Facteurs externes defavorables
}
```

Les elements du SWOT doivent etre SPECIFIQUES au secteur, pas generiques.

#### 4.3 Personas par opportunite (champ `personas` dans le JSON opportunite)

2-3 personas par opportunite (pas par produit , les produits d'une meme opportunite partagent les memes personas).

```
personas: [{
  name: "...",           // Prenom fictif
  role: "...",           // Role / metier
  age: "...",            // Tranche d'age
  context: "...",        // Situation professionnelle et personnelle
  painPoints: ["..."],   // Frustrations concretes (pas abstraites)
  currentSolution: "...", // Comment il/elle fait aujourd'hui
  budget: "...",         // Budget outils / willingness to pay
  channels: ["..."]      // Ou le trouver (reseaux, communautes, evenements)
}]
```

#### 4.4 Score de viabilite par produit (champ `viabilityScore` dans le JSON produit)

Score composite 0-100 calcule sur :

- demandScore (25%) : metriques data.gouv + volume de recherche
- feasibilityScore (25%) : difficulte MVP + nombre d'APIs disponibles
- marketScore (25%) : TAM/SOM + nombre de clients necessaires pour 10K MRR
- competitionScore (15%) : nombre et force des concurrents
- legalScore (10%) : risque juridique (0 si bloquant, 100 si tout est OK)

Le score permet de classer les 85 produits du plus au moins viable.

#### 4.5 Disclaimer

Chaque page doit contenir un disclaimer clair :
"Cette etude est basee sur des donnees secondaires (open data data.gouv.fr, sites publics, recherche web). Aucune interview prospect n'a ete realisee. Les hypotheses de marche (volumes de recherche, CAC, TAM/SAM/SOM) sont des estimations qui necessitent une validation terrain avant investissement."

#### 4.6 Niveaux de confiance (champ `confidenceLevels` dans le JSON produit)

Chaque fiche produit doit afficher le niveau de confiance par section :

- verifie : source publique verifiable (lien cliquable)
- estime : calcul sur donnees publiques, methodologie transparente
- opine : benchmark ou avis expert, a valider sur le terrain

### Structure des fichiers

```
prisma/
  opportunities/     # 1 fichier JSON par opportunite (XX-slug.json)
  products/          # 1 fichier JSON par produit (slug-complet.json)
  seed.ts            # Loader automatique , ne pas modifier pour ajouter des donnees
```

Ajouter une opportunite = creer un fichier JSON dans `opportunities/`
Ajouter un produit = creer un fichier JSON dans `products/`
Puis lancer : `DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts`

### Checklist de completude d'un secteur

- [ ] Minimum 3 requetes search_datasets avec mots-cles varies
- [ ] Minimum 1 requete search_dataservices
- [ ] Metriques reelles pour chaque dataset retenu
- [ ] Fiche opportunite avec tous les champs obligatoires
- [ ] SWOT specifique au secteur
- [ ] 2-3 personas detailles par opportunite
- [ ] 4-6 idees de produit distinctes
- [ ] Fiche produit detaillee pour chaque idee
- [ ] Score de viabilite calcule pour chaque produit
- [ ] Validation marche (searchVolume, TAM/SAM/SOM, competitors, legal, CAC) pour chaque produit
- [ ] Niveaux de confiance par section
- [ ] Croisements avec les autres secteurs identifies
- [ ] Disclaimer present
- [ ] Seed et build reussis
