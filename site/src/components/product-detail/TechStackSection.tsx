import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';
import { Section } from './Section';
import type { TechStack } from './types';

type Props = {
  techStack: TechStack;
};

export function TechStackSection({ techStack }: Props) {
  return (
    <Section label="Tech" title="Stack recommandé">
      <Card>
        <CardContent className="py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">Frontend</div>
              <div className="mt-1 text-sm">
                <SmartText>{techStack.frontend}</SmartText>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">Backend</div>
              <div className="mt-1 text-sm">
                <SmartText>{techStack.backend}</SmartText>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Base de données
              </div>
              <div className="mt-1 text-sm">
                <SmartText>{techStack.database}</SmartText>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Hébergement
              </div>
              <div className="mt-1 text-sm">
                <SmartText>{techStack.hosting}</SmartText>
              </div>
            </div>
          </div>
          {techStack.apis.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                APIs à intégrer
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                {techStack.apis.map((api, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {api}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {techStack.notes && (
            <p className="mt-4 text-xs text-muted-foreground">
              <SmartText>{techStack.notes}</SmartText>
            </p>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
