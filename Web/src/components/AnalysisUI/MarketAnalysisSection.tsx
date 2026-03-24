import { MarketAnalysis } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, ProgressBar, ImpactIndicator, ExternalLinkBtn, Badge } from "./SharedComponents";
import { Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

interface MarketAnalysisProps {
  data: MarketAnalysis;
}

function MarketSizeCard({ current, projected5Years, cagr, subMarkets }: MarketAnalysis["marketSize"]) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Tamanho Atual" emoji="📊">
        <p className="text-3xl font-bold">{current}</p>
      </Card>
      <Card title="Projeção 5 Anos" emoji="📈">
        <p className="text-3xl font-bold">{projected5Years}</p>
        <p className="text-sm text-muted-foreground mt-1">CAGR: {cagr}%</p>
      </Card>
      <Card className="col-span-full" title="Sub-mercados">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Pie data={subMarkets || []} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name} ${entry.percentage}%`} outerRadius={80} fill="#8884d8" dataKey="percentage">
              {(subMarkets || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function TrendsList({ trends }: { trends: MarketAnalysis["trends"] }) {
  return (
    <div className="space-y-3">
      {(trends || []).map((trend, i) => (
        <div key={i} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="font-semibold">{trend.trend}</h4>
            <ImpactIndicator level={trend.impact} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{trend.dataPoint}</p>
          <ExternalLinkBtn url={trend.reference} text="Ver fonte" />
        </div>
      ))}
    </div>
  );
}

function CompetitorsList({ competitors }: { competitors: MarketAnalysis["competition"] }) {
  return (
    <div className="space-y-4">
      {(competitors || []).map((competitor, i) => (
        <Card key={i} title={competitor.name} emoji="🏢">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Market Share</p>
              <ProgressBar value={competitor.marketShare} label={`${competitor.marketShare}%`} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-green-600">Pontos Fortes</p>
              <ul className="space-y-1">
                {competitor.strengths.map((s, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2 text-red-600">Fraquezas</p>
              <ul className="space-y-1">
                {competitor.weaknesses.map((w, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✕</span> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">{competitor.notes}</p>
              <ExternalLinkBtn url={competitor.reference} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function NewsSection({ news }: { news: MarketAnalysis["recentNews"] }) {
  const relevanceColors = {
    high: "bg-red-500/10 border-red-500/20",
    medium: "bg-amber-500/10 border-amber-500/20",
    low: "bg-green-500/10 border-green-500/20",
  };

  return (
    <div className="space-y-3">
      {(news || []).map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block border rounded-lg p-4 transition hover:shadow-md ${relevanceColors[article.relevance]}`}
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="font-semibold hover:underline">{article.title}</h4>
            <Badge text={article.relevance === "high" ? "Alta" : article.relevance === "medium" ? "Média" : "Baixa"} variant={article.relevance === "high" ? "danger" : article.relevance === "medium" ? "warning" : "success"} />
          </div>
          <p className="text-xs text-muted-foreground">
            {article.source} • {new Date(article.date).toLocaleDateString("pt-BR")}
          </p>
        </a>
      ))}
    </div>
  );
}

function BarriersSection({ barriers }: { barriers: MarketAnalysis["barriersToEntry"] }) {
  return (
    <div className="space-y-2">
      {(barriers || []).map((barrier, i) => (
        <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
          <p className="font-medium text-sm">{barrier.barrier}</p>
          <ImpactIndicator level={barrier.impactLevel} />
        </div>
      ))}
    </div>
  );
}

export function MarketAnalysisSection({ data }: MarketAnalysisProps) {
  return (
    <section className="space-y-6">
      <SectionTitle emoji="📊" title="Análise de Mercado" description="Tamanho, tendências e posicionamento competitivo" />

      <Card title="Tamanho de Mercado" emoji="💰">
        <MarketSizeCard {...data.marketSize} />
      </Card>

      <Card title="Tendências de Mercado" emoji="📈">
        <TrendsList trends={data.trends} />
      </Card>

      <Card title="Concorrência" emoji="🎯">
        <CompetitorsList competitors={data.competition} />
      </Card>

      <Card title="Notícias Recentes" emoji="📰">
        <NewsSection news={data.recentNews} />
      </Card>

      <Card title="Barreiras para Entrada" emoji="🚧">
        <BarriersSection barriers={data.barriersToEntry} />
      </Card>
    </section>
  );
}
