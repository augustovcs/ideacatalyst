import { TechnicalDetails } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, Badge, ImpactIndicator, ExternalLinkBtn } from "./SharedComponents";

interface TechnicalDetailsProps {
  data: TechnicalDetails;
}

function TechStackGrid({ technologies }: { technologies: TechnicalDetails["technologiesRequired"] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {(technologies || []).map((tech, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:bg-muted/50 transition">
          <span className="text-3xl mb-2">{tech.icon}</span>
          <p className="text-sm font-medium text-center">{tech.name}</p>
        </div>
      ))}
    </div>
  );
}

function ComplexityBadge({ complexity }: { complexity: string }) {
  const levels = {
    low: { color: "success", label: "Baixa" },
    medium: { color: "warning" as const, label: "Média" },
    high: { color: "danger" as const, label: "Alta" },
  };

  const level = levels[complexity as keyof typeof levels];
  return <Badge text={level.label} variant={level.color} />;
}

function CriticalProcessesList({ processes }: { processes: TechnicalDetails["criticalProcesses"] }) {
  return (
    <div className="space-y-3">
      {(processes || []).map((process, i) => (
        <div key={i} className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="font-semibold">{process.process}</h4>
            <ImpactIndicator level={process.impact} />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Dependências:</span> {process.dependencies}
            </p>
            <div>
              <ExternalLinkBtn url={process.reference} text="Ver detalhes" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HumanResourcesList({ resources }: { resources: TechnicalDetails["humanResources"] }) {
  const skillColors = {
    junior: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    mid: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    senior: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  };

  return (
    <div className="space-y-3">
      {(resources || []).map((hr, i) => (
        <div key={i} className={`border rounded-lg p-4 ${skillColors[hr.skillLevel]}`}>
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold">{hr.role}</h4>
            <span className="text-lg font-bold">{hr.count}</span>
          </div>
          <p className="text-xs mb-2 opacity-75">
            Nível: {hr.skillLevel === "junior" ? "Júnior" : hr.skillLevel === "mid" ? "Pleno" : "Sênior"}
          </p>
          <ExternalLinkBtn url={hr.reference} text="Ver descrição" />
        </div>
      ))}
    </div>
  );
}

function OperationalMetricsList({ metrics }: { metrics: TechnicalDetails["operationalMetrics"] }) {
  return (
    <div className="space-y-3">
      {(metrics || []).map((metric, i) => (
        <div key={i} className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-3">{metric.kpi}</h4>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Target</p>
              <p className="font-semibold text-green-600">{metric.target}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Benchmark</p>
              <p className="font-semibold text-blue-600">{metric.benchmark}</p>
            </div>
          </div>
          <ExternalLinkBtn url={metric.reference} text="Ver métrica completa" />
        </div>
      ))}
    </div>
  );
}

export function TechnicalDetailsSection({ data }: TechnicalDetailsProps) {
  return (
    <section className="space-y-6">
      <SectionTitle emoji="⚙️" title="Detalhes Técnicos & Operacionais" description="Tecnologias e processos críticos" />

      <Card title="Stack Tecnológico" emoji="🛠️">
        <TechStackGrid technologies={data.technologiesRequired} />
      </Card>

      <Card title="Complexidade do Projeto">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <span className="font-medium">Nível de Complexidade</span>
          <ComplexityBadge complexity={data.complexity} />
        </div>
      </Card>

      <Card title="Processos Críticos" emoji="⚡">
        <CriticalProcessesList processes={data.criticalProcesses} />
      </Card>

      <Card title="Recursos Humanos" emoji="👨‍💼">
        <HumanResourcesList resources={data.humanResources} />
      </Card>

      <Card title="Métricas Operacionais" emoji="📊">
        <OperationalMetricsList metrics={data.operationalMetrics} />
      </Card>
    </section>
  );
}
