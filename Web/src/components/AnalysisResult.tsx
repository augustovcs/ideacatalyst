import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult as AnalysisResultType } from "@/hooks/useIdeaAnalysis";

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

function ScoreBar({ label, value, emoji, delay }: { label: string; value: number; emoji: string; delay: number }) {
  const color =
    value >= 75 ? "bg-accent" : value >= 50 ? "bg-primary" : "bg-amber-500";

  return (
    <div className="animate-slide-in-left" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-medium text-sm flex items-center gap-1.5">
          {emoji} {label}
        </span>
        <span className="font-mono-data text-sm font-semibold">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%`, transitionDelay: `${delay + 200}ms` }}
        />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  emoji,
  items,
  delay,
}: {
  title: string;
  emoji: string;
  items: string[];
  delay: number;
}) {
  return (
    <div
      className="rounded-xl border border-border bg-card p-5 animate-fade-up shadow-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const overallScore = Math.round(
    result.scores.reduce((sum, s) => sum + s.value, 0) / result.scores.length
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ lineHeight: "1.1" }}>
          Resultado da Análise
        </h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto mt-3">
          &ldquo;{result.ideaTitle}&rdquo;
        </p>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-10 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary/20 glow-primary">
          <span className="text-4xl font-bold font-mono-data text-primary">{overallScore}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Pontuação geral</p>
      </div>

      {/* Score bars */}
      <div className="space-y-5 mb-10">
        {result.scores.map((score, i) => (
          <ScoreBar key={score.label} {...score} delay={200 + i * 120} />
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <SectionCard title="Pontos Fortes" emoji="💪" items={result.strengths} delay={700} />
        <SectionCard title="Riscos" emoji="⚠️" items={result.risks} delay={820} />
      </div>

      {/* Next steps */}
      <SectionCard title="Próximos Passos" emoji="🚀" items={result.nextSteps} delay={940} />

      {/* Summary */}
      <div
        className="mt-8 p-5 rounded-xl surface-sunken border border-border text-sm text-muted-foreground leading-relaxed animate-fade-up"
        style={{ animationDelay: "1060ms" }}
      >
        <p className="font-medium text-foreground mb-1">📝 Resumo</p>
        {result.summary}
      </div>

      {/* Reset */}
      <div className="text-center mt-10 animate-fade-up" style={{ animationDelay: "1180ms" }}>
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-xl gap-2 transition-all duration-200 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Analisar outra ideia
        </Button>
      </div>
    </div>
  );
}
