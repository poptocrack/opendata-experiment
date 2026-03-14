# Research - Outil de recherche d'opportunites

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

## Workflow
1. Recuperer et analyser les datasets data.gouv.fr via MCP
2. Identifier des patterns et besoins non satisfaits
3. Evaluer les opportunites (marche, faisabilite, monetisation)
4. Produire des fiches opportunites detaillees
