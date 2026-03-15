import { Separator } from '@/components/ui/separator';
import { ViabilityScoreCard } from './ViabilityScoreCard';
import { VisionCards } from './VisionCards';
import { ValidationTerrainSection } from './ValidationTerrainSection';
import { EarlyAdoptersSection } from './EarlyAdoptersSection';
import { MvpSection } from './MvpSection';
import { RoadmapSection } from './RoadmapSection';
import { MonetizationSection } from './MonetizationSection';
import { MarketValidationSection } from './MarketValidationSection';
import { TechStackSection } from './TechStackSection';
import { RisksSection } from './RisksSection';
import { InspirationsSection } from './InspirationsSection';
import { DataSourcesSection } from './DataSourcesSection';
import { ConfidenceLevelsSection } from './ConfidenceLevelsSection';
import type { ProductWithDetail } from '@/lib/queries';
import type { ParsedProductDetail } from './types';

type Props = Readonly<{
  detail: NonNullable<ProductWithDetail['detail']>;
  opp: ProductWithDetail['opportunity'];
  parsed: ParsedProductDetail;
}>;

export function ProductDetailContent({ detail, opp, parsed }: Props) {
  const hasMarketValidation =
    parsed.searchVolumes.length > 0 ||
    parsed.tamSamSom ||
    parsed.competitorDeeps.length > 0 ||
    parsed.legalConstraints.length > 0 ||
    parsed.cacEstimates.length > 0;

  return (
    <>
      {parsed.viabilityScore && (
        <ViabilityScoreCard viabilityScore={parsed.viabilityScore} />
      )}

      <VisionCards
        problem={detail.problem}
        solution={detail.solution}
        uniqueValue={detail.uniqueValue}
      />

      <Separator />
      <ValidationTerrainSection validationChecks={parsed.validationChecks} />
      <Separator />
      <EarlyAdoptersSection earlyAdopters={parsed.earlyAdopters} />
      <Separator />
      <MvpSection mvpScope={detail.mvpScope} />
      <Separator />
      <RoadmapSection milestones={parsed.milestones} />
      <Separator />
      <MonetizationSection
        pricingStrategy={detail.pricingStrategy}
        pathTo10kMrr={detail.pathTo10kMrr}
      />

      {hasMarketValidation && (
        <>
          <Separator />
          <MarketValidationSection
            searchVolumes={parsed.searchVolumes}
            tamSamSom={parsed.tamSamSom}
            competitorDeeps={parsed.competitorDeeps}
            cacEstimates={parsed.cacEstimates}
            legalConstraints={parsed.legalConstraints}
          />
        </>
      )}

      <Separator />
      {parsed.techStack && (
        <>
          <TechStackSection techStack={parsed.techStack} />
          <Separator />
        </>
      )}

      {parsed.risks.length > 0 && <RisksSection risks={parsed.risks} />}

      {detail.inspirations && (
        <>
          <Separator />
          <InspirationsSection inspirations={detail.inspirations} />
        </>
      )}

      <Separator />
      <DataSourcesSection datasets={opp.datasets} apis={opp.apis} />

      {parsed.confidenceLevels && (
        <>
          <Separator />
          <ConfidenceLevelsSection confidenceLevels={parsed.confidenceLevels} />
        </>
      )}
    </>
  );
}
