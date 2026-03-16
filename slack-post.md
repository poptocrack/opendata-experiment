# Post pour #experimentations

Hey 👋

Je partage un retour d'expérience concret sur un projet réalisé quasi intégralement avec Claude Code (Opus).

Le projet : analyser systématiquement les données publiques françaises (data.gouv.fr) pour identifier des opportunités de produits SaaS viables. Pas juste "donne moi des idées" — un vrai travail d'étude de marché structuré.

Ce que l'IA a fait concrètement :
- Exploration de data.gouv.fr via MCP (Model Context Protocol) — recherche de datasets, récupération des métriques de fréquentation, analyse des APIs disponibles
- Génération de 17 fiches sectorielles avec SWOT, personas, analyse concurrentielle
- Génération de 90 fiches produit avec scope MVP, roadmap, calcul vers 10K€ MRR, validation marché (TAM/SAM/SOM, volumes de recherche, concurrents avec pricing réel, contraintes juridiques, CAC par canal)
- Score de viabilité 0-100 pour prioriser les 90 produits
- Recherche web pour valider les prix concurrents et les données marché
- Construction du site Next.js + Prisma + SQLite, déploiement Docker, Caddy, CI/CD GitHub Actions

Ce que j'ai fait :
- Piloté la direction (quels secteurs explorer, quel niveau de détail)
- Challengé la qualité des outputs (est-ce que c'est sourcé ? est-ce que c'est du bullshit ?)
- Décisions produit (paywall, structure des données, UX)
- Résolu les problèmes d'infra que l'IA n'arrivait pas à débloquer seule (Prisma + Turbopack, config Docker multi-site)
- Publication et distribution (Reddit, choix du positionnement)

Quelques chiffres :
- ~80K tokens par secteur analysé (~2-3€ au prix API par secteur)
- 17 secteurs, 90 produits en ~2 jours de travail
- Le site est live, 270 vues le premier jour via un post Reddit

Ce que j'en retiens :
- Le MCP est un game changer pour ce type de projet. Connecter Claude directement à data.gouv.fr a permis d'explorer des centaines de datasets en quelques minutes au lieu de jours.
- Les agents en parallèle c'est puissant mais fragile. J'ai lancé jusqu'à 5 agents simultanés pour générer les fiches produit. Ça va vite mais la qualité est inégale et il faut tout vérifier.
- L'IA est mauvaise pour estimer ce qu'elle ne sait pas. Les volumes de recherche Google, les CAC, les TAM sont des estimations sans outils SEO réels — j'ai dû ajouter un système de "niveaux de confiance" pour être transparent sur ce qui est vérifié vs estimé vs opinion.
- Prisma + SQLite + Next.js Turbopack en dev = cauchemar. L'IA a tourné en rond pendant 30 minutes sur ce problème avant que je doive intervenir.
- Le contenu généré par IA a besoin d'un humain pour être crédible. La transparence sur l'utilisation de l'IA dans le post Reddit a été très bien reçue.

Le résultat : https://lefilon.net

Si vous avez des questions sur le setup technique (MCP, agents, structure du projet), allez-y.
