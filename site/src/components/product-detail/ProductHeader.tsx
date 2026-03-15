import { Badge } from '@/components/ui/badge';
import { SmartText } from '@/components/smart-text';
import { DifficultyBadge } from '@/components/badge-tooltip';

type ProductDetail = {
  timeToMvp?: string | null;
  oneLiner?: string | null;
};

type Props = {
  productTitle: string;
  sector: string;
  difficulty: string;
  detail: ProductDetail | null;
};

export function ProductHeader({ productTitle, sector, difficulty, detail }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline">{sector}</Badge>
        <DifficultyBadge difficulty={difficulty} />
        {detail?.timeToMvp && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <SmartText>{`${detail.timeToMvp} pour le MVP`}</SmartText>
          </Badge>
        )}
      </div>
      <h1 className="text-2xl font-bold sm:text-3xl">
        <SmartText>{productTitle}</SmartText>
      </h1>
      {detail?.oneLiner && (
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          <SmartText>{detail.oneLiner}</SmartText>
        </p>
      )}
    </div>
  );
}
