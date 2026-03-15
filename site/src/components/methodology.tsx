import { SmartText } from "@/components/smart-text";

export function Methodology() {
  const steps = [
    {
      number: "01",
      title: "Exploration des datasets",
      description:
        "Recherche systématique dans data.gouv.fr par domaines : immobilier, entreprises, urbanisme, énergie, santé...",
    },
    {
      number: "02",
      title: "Analyse des signaux",
      description:
        "Métriques de popularité (visites, téléchargements), fréquence de mise à jour, richesse des données.",
    },
    {
      number: "03",
      title: "Croisement de sources",
      description:
        "Identification des combinaisons de datasets qui créent une valeur supérieure à la somme de leurs parties.",
    },
    {
      number: "04",
      title: "Évaluation business",
      description:
        "Taille de marché, clients cibles, monétisation, concurrence, faisabilité technique.",
    },
  ];

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Méthodologie
        </h2>
        <p className="mt-2 text-2xl font-bold">Comment on trouve les opportunités</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="font-mono text-3xl font-bold text-primary/30">
                {step.number}
              </span>
              <h3 className="mt-2 font-semibold"><SmartText>{step.title}</SmartText></h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                <SmartText>{step.description}</SmartText>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
