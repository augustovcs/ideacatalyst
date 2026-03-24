import { AdditionalInsights } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, ExternalLinkBtn } from "./SharedComponents";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdditionalInsightsProps {
  data: AdditionalInsights;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition"
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border bg-muted/30">
          {children}
        </div>
      )}
    </div>
  );
}

function PartnershipsList({ opportunities }: { opportunities: AdditionalInsights["partnershipOpportunities"] }) {
  return (
    <ul className="space-y-3">
      {(opportunities || []).map((opp, i) => (
        <li key={i} className="flex items-start justify-between gap-4 p-3 border border-border rounded-lg">
          <span className="font-medium">{opp.partner}</span>
          <ExternalLinkBtn url={opp.reference} text="Explorar" />
        </li>
      ))}
    </ul>
  );
}

function TechnologiesList({ technologies }: { technologies: AdditionalInsights["emergingTechnologies"] }) {
  return (
    <div className="space-y-3">
      {(technologies || []).map((tech, i) => (
        <div key={i} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition">
          <h4 className="font-semibold mb-2">{tech.technology}</h4>
          <p className="text-sm text-muted-foreground">{tech.relevance}</p>
        </div>
      ))}
    </div>
  );
}

function RegulatoryList({ considerations }: { considerations: AdditionalInsights["regulatoryConsiderations"] }) {
  const impactColors = {
    high: "border-red-500/30 bg-red-500/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    low: "border-green-500/30 bg-green-500/5",
  };

  return (
    <div className="space-y-3">
      {(considerations || []).map((reg, i) => {
        const impact = reg.impact.toLowerCase().includes("high") ? "high" : reg.impact.toLowerCase().includes("medium") ? "medium" : "low";

        return (
          <div key={i} className={`p-4 rounded-lg border ${impactColors[impact]}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h4 className="font-semibold">{reg.regulation}</h4>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-current/10">
                {impact === "high" ? "Alto Impacto" : impact === "medium" ? "Médio Impacto" : "Baixo Impacto"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{reg.impact}</p>
            <ExternalLinkBtn url={reg.reference} text="Ver regulamentação" />
          </div>
        );
      })}
    </div>
  );
}

export function AdditionalInsightsSection({ data }: AdditionalInsightsProps) {
  return (
    <section className="space-y-6">
      <SectionTitle emoji="💡" title="Insights Adicionais" description="Oportunidades estratégicas e considerações de mercado" />

      <Card title="Oportunidades de Parceria" emoji="🤝">
        <PartnershipsList opportunities={data.partnershipOpportunities} />
      </Card>

      <Card title="Tecnologias Emergentes" emoji="🔬">
        <div className="space-y-2">
          {data.emergingTechnologies.map((tech, i) => (
            <AccordionItem key={i} title={tech.technology} defaultOpen={i === 0}>
              <p className="text-sm text-muted-foreground">{tech.relevance}</p>
            </AccordionItem>
          ))}
        </div>
      </Card>

      <Card title="Considerações Regulatórias" emoji="⚖️">
        <RegulatoryList considerations={data.regulatoryConsiderations} />
      </Card>
    </section>
  );
}
