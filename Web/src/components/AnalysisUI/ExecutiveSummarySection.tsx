import { ExecutiveSummary, Demographic } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, ExternalLinkBtn } from "./SharedComponents";

interface ExecutiveSummaryProps {
  data: ExecutiveSummary;
  ideaTitle: string;
}

function DemographicCard({ demographic }: { demographic: Demographic }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Faixa Etária</p>
        <p className="font-semibold">{demographic.ageRange}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Gênero</p>
        <p className="font-semibold">{demographic.gender}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Nível de Renda</p>
        <p className="font-semibold">{demographic.incomeLevel}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">Localização</p>
        <p className="font-semibold">{demographic.location}</p>
      </div>
      <div className="col-span-full">
        <p className="text-sm font-medium text-muted-foreground mb-2">Psicografia</p>
        <div className="flex flex-wrap gap-2">
          {(demographic.psychographics || []).map((psycho, i) => (
            <span
              key={i}
              className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {psycho}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExecutiveSummarySection({ data, ideaTitle }: ExecutiveSummaryProps) {
  return (
    <section className="space-y-4">
      <SectionTitle emoji="📋" title="Resumo Executivo" description="Visão rápida da ideia e público-alvo" />

      <Card title="Descrição da Ideia" emoji="💡">
        <p className="text-sm leading-relaxed">{data.description}</p>
      </Card>

      <Card title="Proposta de Valor" emoji="⭐">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="font-semibold text-primary">{data.valueProposition}</p>
        </div>
      </Card>

      <Card title="Cliente-Alvo" emoji="👥">
        <DemographicCard demographic={data.targetCustomer} />
      </Card>

      <Card title="Encaixe Estratégico">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Análise estratégica da ideia no contexto de mercado</p>
          <ExternalLinkBtn url={data.strategicFit} text="Ver análise" />
        </div>
      </Card>
    </section>
  );
}
