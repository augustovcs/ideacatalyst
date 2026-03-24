import { MarketingAndSales } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, KPICard, ExternalLinkBtn } from "./SharedComponents";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MarketingAndSalesProps {
  data: MarketingAndSales;
}

function StrategiesList({ strategies }: { strategies: MarketingAndSales["strategies"] }) {
  return (
    <ul className="space-y-3">
      {strategies.map((strategy, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-primary font-bold mt-1">•</span>
          <div>
            <p className="font-medium">{strategy.text}</p>
            <ExternalLinkBtn url={strategy.reference} text="Ver detalhes" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ChannelsList({ channels }: { channels: MarketingAndSales["channels"] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {channels.map((channel, i) => (
        <a
          key={i}
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:bg-muted/50 transition"
        >
          <span className="text-3xl mb-2">{channel.icon}</span>
          <p className="text-sm font-medium text-center">{channel.name}</p>
        </a>
      ))}
    </div>
  );
}

function SalesForecastChart({ forecast }: { forecast: MarketingAndSales["salesForecast"] }) {
  const chartData = (forecast || []).map((point) => ({
    year: `Year ${point.year}`,
    revenue: point.revenue / 1000000,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}M`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            dot={{ fill: "#3b82f6", r: 5 }}
            name="Receita Projetada"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ConversionMetricsChart({ metrics }: { metrics: MarketingAndSales["conversionMetrics"] }) {
  const chartData = (metrics || []).map((m) => ({
    metric: m.metric.split(" ")[0],
    target: m.target,
    benchmark: m.benchmark,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="target" fill="#10b981" name="Target" />
          <Bar dataKey="benchmark" fill="#6366f1" name="Benchmark" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarketingAndSalesSection({ data }: MarketingAndSalesProps) {
  const ltv = data.lifetimeValue;
  const cac = data.customerAcquisitionCost;
  const ltvToCacRatio = (ltv / cac).toFixed(1);
  const status = parseFloat(ltvToCacRatio) > 3 ? "good" : parseFloat(ltvToCacRatio) > 1.5 ? "warning" : "critical";

  return (
    <section className="space-y-6">
      <SectionTitle emoji="📢" title="Marketing & Vendas" description="Estratégias, canais e métricas de aquisição" />

      <Card title="Estratégias de Marketing" emoji="🎯">
        <StrategiesList strategies={data.strategies} />
      </Card>

      <Card title="Canais de Aquisição" emoji="📱">
        <ChannelsList channels={data.channels} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard label="Custo de Aquisição por Cliente (CAC)" value={`$${cac.toLocaleString()}`} status="good" icon="💰" />
        <KPICard
          label="Lifetime Value (LTV)"
          value={`$${ltv.toLocaleString()}`}
          status="good"
          icon="💎"
        />
        <KPICard
          label="Razão LTV:CAC"
          value={ltvToCacRatio}
          unit="x"
          status={status}
          icon="📊"
        />
      </div>

      <Card title="Projeção de Vendas (3 anos)" emoji="📈">
        <SalesForecastChart forecast={data.salesForecast} />
      </Card>

      <Card title="Métricas de Conversão" emoji="🎯">
        <ConversionMetricsChart metrics={data.conversionMetrics} />
      </Card>
    </section>
  );
}
