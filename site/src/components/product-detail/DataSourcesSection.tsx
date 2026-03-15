import { Section } from './Section';

type Dataset = { id: number; datasetId: string; name: string; visits: string };
type Api = { id: number; name: string };

type Props = {
  datasets: Dataset[];
  apis: Api[];
};

export function DataSourcesSection({ datasets, apis }: Props) {
  return (
    <Section label="Données" title="Sources de données disponibles">
      <div className="space-y-2">
        {datasets.map((ds) => (
          <div
            key={ds.id}
            className="flex items-center justify-between rounded-lg border border-border/50 p-3 text-sm"
          >
            <a
              href={`https://www.data.gouv.fr/datasets/${ds.datasetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {ds.name}
            </a>
            <span className="text-xs text-muted-foreground">{ds.visits} visites</span>
          </div>
        ))}
        {apis.map((api) => (
          <div
            key={api.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-3 text-sm"
          >
            <span className="font-medium">{api.name}</span>
            <code className="text-xs text-primary/70">API</code>
          </div>
        ))}
      </div>
    </Section>
  );
}
