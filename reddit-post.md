Salut à tous,
Je suis dev et je cherchais ma prochaine idée de produit. Au lieu de partir de mon intuition, j'ai décidé de partir des données : qu'est-ce que les gens cherchent vraiment sur data.gouv.fr ?
J'ai passé plusieurs jours à analyser les métriques de fréquentation des datasets publics français (visites, téléchargements) pour identifier où il y a de la demande non satisfaite. Pour chaque piste, j'ai regardé les concurrents, leurs prix, et estimé ce qu'il faudrait pour atteindre 10K€ MRR.
Transparence : je me suis fait aider par Claude (IA) pour l'exploration des datasets et la structuration des fiches. Les métriques data.gouv.fr sont réelles (API publique), les prix concurrents vérifiés sur leurs sites, mais les volumes de recherche Google sont des ordres de grandeur. Chaque donnée est taggée avec son niveau de fiabilité.
Quelques exemples de ce que j'ai trouvé :
🏠 Immobilier — personne ne croise les données
Les DVF (transactions immobilières) font 573K visites/an. La criminalité par commune 108K visites + 102K téléchargements. Le registre des copropriétés 119K visites. Les logements vacants 21K visites.
Aujourd'hui si tu veux évaluer un quartier avant d'acheter, tu dois aller sur 6-7 sites différents. Lybox fait de l'analyse locative à partir de 9€/mois mais ne croise ni la criminalité, ni les permis de construire, ni les DPE. "Zone tendue" c'est 22 200 recherches/mois sur Google, "charges copropriété" 12 100/mois.

---

⚡ Bornes de recharge — le meilleur score de mon analyse
411 datasets, marché IRVE de 2.5 milliards €. Chargemap est une app pour conducteurs mais aucun outil B2B n'aide les opérateurs et collectivités à décider où installer les prochaines bornes. Score de viabilité : 77/100. MVP en 5 semaines.

---

🏥 Déserts médicaux — 14 800 recherches/mois
FINESS (établissements sanitaires) fait 128K téléchargements/an. Aucun outil ne croise proprement la densité médicale + démographie + aides à l'installation pour aider les jeunes médecins à choisir où s'installer. Score : 75/100.

---

Au total j'ai analysé 16 secteurs (immobilier, énergie, entreprises, santé, éducation, handicap, alimentaire, marchés publics, environnement...) et produit 85 fiches produit.
C'est pas juste une liste d'idées. Pour chaque produit il y a : le scope MVP (4-8 semaines solo dev), la validation terrain à faire avant de coder, qui contacter en premier (communautés spécifiques, pas "les professionnels du secteur"), le calcul vers 10K€ MRR, l'analyse concurrentielle avec les vrais prix, les contraintes juridiques, le coût d'acquisition par canal, et un score de viabilité 0-100 pour prioriser.
Mes questions :
Est-ce que certains d'entre vous utilisent déjà des données publiques dans leur business ?
Quels secteurs j'ai pu rater ?
Le modèle "données publiques + valeur ajoutée = SaaS" vous paraît viable en France au-delà de Pappers ?
Si vous deviez en choisir un, lequel vous lancerait ?
J'ai mis mes conclusions sur un site (les fiches secteurs sont en accès libre), mais je préfère d'abord avoir vos retours ici.
