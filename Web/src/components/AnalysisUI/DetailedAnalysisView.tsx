import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DetailedAnalysisResult } from "@/hooks/useDetailedAnalysis";
import { ExecutiveSummarySection } from "./ExecutiveSummarySection";
import { MarketAnalysisSection } from "./MarketAnalysisSection";
import { SWOTAnalysisSection } from "./SWOTSection";
import { TechnicalDetailsSection } from "./TechnicalDetailsSection";
import { MarketingAndSalesSection } from "./MarketingAndSalesSection";
import { FinancialsSection } from "./FinancialsSection";
import { RisksAndMitigationSection } from "./RisksAndMitigationSection";
import { AdditionalInsightsSection } from "./AdditionalInsightsSection";

interface DetailedAnalysisViewProps {
  result: DetailedAnalysisResult;
  onReset: () => void;
}

export function DetailedAnalysisView({ result, onReset }: DetailedAnalysisViewProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">📊 Análise Completa</h1>
            <p className="text-lg text-muted-foreground mt-2">{result.ideaTitle}</p>
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="rounded-lg gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Análise</span>
          </Button>
        </div>
      </header>

      <div className="space-y-12">
        <ExecutiveSummarySection data={result.executiveSummary} ideaTitle={result.ideaTitle} />
        <MarketAnalysisSection data={result.marketAnalysis} />
        <SWOTAnalysisSection data={result.swotAnalysis} />
        <TechnicalDetailsSection data={result.technicalDetails} />
        <MarketingAndSalesSection data={result.marketingAndSales} />
        <FinancialsSection data={result.financials} />
        <RisksAndMitigationSection data={result.risksAndMitigation} />
        <AdditionalInsightsSection data={result.additionalInsights} />
      </div>

      <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>Análise gerada em {new Date().toLocaleDateString("pt-BR")}</p>
      </footer>
    </div>
  );
}
