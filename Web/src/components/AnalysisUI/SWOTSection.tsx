import { SWOTAnalysis } from "@/hooks/useDetailedAnalysis";
import { SectionTitle } from "./SharedComponents";

interface SWOTSectionProps {
  data: SWOTAnalysis;
}

function SWOTColumn({ title, emoji, items, color }: { title: string; emoji: string; items: string[]; color: string }) {
  return (
    <div className={`rounded-lg border-2 p-5 ${color}`}>
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="text-lg mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SWOTAnalysisSection({ data }: SWOTSectionProps) {
  return (
    <section className="space-y-4">
      <SectionTitle emoji="🔄" title="Análise SWOT" description="Forças, fraquezas, oportunidades e ameaças" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SWOTColumn title="Forças" emoji="💪" items={data.strengths} color="border-green-500 bg-green-500/5" />
        <SWOTColumn title="Fraquezas" emoji="⚠️" items={data.weaknesses} color="border-red-500 bg-red-500/5" />
        <SWOTColumn title="Oportunidades" emoji="🚀" items={data.opportunities} color="border-blue-500 bg-blue-500/5" />
        <SWOTColumn title="Ameaças" emoji="🔥" items={data.threats} color="border-orange-500 bg-orange-500/5" />
      </div>
    </section>
  );
}
