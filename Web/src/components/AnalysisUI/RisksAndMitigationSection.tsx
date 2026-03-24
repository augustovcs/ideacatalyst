import { RisksAndMitigation } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, ImpactIndicator, ExternalLinkBtn } from "./SharedComponents";

interface RisksAndMitigationProps {
  data: RisksAndMitigation;
}

function RiskMatrix({ risks }: { risks: RisksAndMitigation["keyRisks"] }) {
  const probabilityOrder = { low: 0, medium: 1, high: 2 };
  const impactOrder = { low: 0, medium: 1, high: 2 };

  const sortedRisks = (risks || []).sort(
    (a, b) =>
      (probabilityOrder[b.probability] - probabilityOrder[a.probability]) ||
      (impactOrder[b.impact] - impactOrder[a.impact])
  );

  return (
    <div className="space-y-3">
      {sortedRisks.map((risk, i) => {
        const severity =
          (risk.probability === "high" && risk.impact === "high") ||
          (risk.probability === "high" && risk.impact === "medium") ||
          (risk.probability === "medium" && risk.impact === "high")
            ? "high"
            : risk.probability === "medium" || risk.impact === "medium"
              ? "medium"
              : "low";

        const colors = {
          high: "border-red-500/30 bg-red-500/5",
          medium: "border-amber-500/30 bg-amber-500/5",
          low: "border-green-500/30 bg-green-500/5",
        };

        return (
          <div key={i} className={`border rounded-lg p-4 ${colors[severity]}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-semibold">{risk.risk}</h4>
              <div className="flex items-center gap-2">
                <ImpactIndicator level={risk.probability} showLabel={false} />
                <ImpactIndicator level={risk.impact} showLabel={false} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Probabilidade:</span> {risk.probability === "high" ? "Alta" : risk.probability === "medium" ? "Média" : "Baixa"}
              </div>
              <div>
                <span className="font-medium">Impacto:</span> {risk.impact === "high" ? "Alto" : risk.impact === "medium" ? "Médio" : "Baixo"}
              </div>
            </div>
            <ExternalLinkBtn url={risk.reference} text="Ver análise detalhada" />
          </div>
        );
      })}
    </div>
  );
}

function MitigationCheckList({ actions }: { actions: RisksAndMitigation["mitigationActions"] }) {
  return (
    <ul className="space-y-3">
      {(actions || []).map((action, i) => (
        <li key={i} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition">
          <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center mt-0.5">
            <input type="checkbox" disabled className="w-4 h-4 cursor-pointer" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{action.action}</p>
            <ExternalLinkBtn url={action.reference} text="Ver plano" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function NextStepsTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-3">
      {(steps || []).map((step, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
              <span className="text-primary font-semibold">{i + 1}</span>
            </div>
          </div>
          <p className="font-medium text-sm">{step}</p>
        </div>
      ))}
    </div>
  );
}

export function RisksAndMitigationSection({ data }: RisksAndMitigationProps) {
  const highRiskCount = data.keyRisks.filter((r) => r.probability === "high" && r.impact === "high").length;
  const riskLevel = highRiskCount > 2 ? "critical" : highRiskCount > 0 ? "warning" : "good";

  return (
    <section className="space-y-6">
      <SectionTitle emoji="⚠️" title="Riscos & Mitigação" description="Identificação e planos de contingência" />

      <div className={`p-4 rounded-lg border ${riskLevel === "critical" ? "border-red-500/30 bg-red-500/5" : riskLevel === "warning" ? "border-amber-500/30 bg-amber-500/5" : "border-green-500/30 bg-green-500/5"}`}>
        <p className="text-sm">
          <span className="font-semibold">Nível de Risco Geral:</span>{" "}
          {riskLevel === "critical" ? "🔴 Crítico" : riskLevel === "warning" ? "🟡 Moderado" : "🟢 Baixo"}
        </p>
      </div>

      <Card title="Riscos-Chave" emoji="🎯">
        <RiskMatrix risks={data.keyRisks} />
      </Card>

      <Card title="Ações de Mitigação" emoji="🛡️">
        <MitigationCheckList actions={data.mitigationActions} />
      </Card>

      <Card title="Próximos Passos" emoji="🚀">
        <NextStepsTimeline steps={data.nextSteps} />
      </Card>
    </section>
  );
}
