import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartText } from '@/components/smart-text';

type Props = {
  problem: string;
  solution: string;
  uniqueValue: string;
};

export function VisionCards({ problem, solution, uniqueValue }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            Problème
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <SmartText>{problem}</SmartText>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            Solution
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <SmartText>{solution}</SmartText>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            Avantage unique
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <SmartText>{uniqueValue}</SmartText>
        </CardContent>
      </Card>
    </div>
  );
}
