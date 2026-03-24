import { Financials } from "@/hooks/useDetailedAnalysis";
import { Card, SectionTitle, KPICard } from "./SharedComponents";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FinancialsProps {
  data: Financials;
}

function InitialCostsTable({ costs }: { costs: Financials["initialCosts"] }) {
  const total = (costs || []).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-2">
      {(costs || []).map((cost, i) => (
        <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
          <span className="font-medium">{cost.category}</span>
          <span className="font-semibold">${cost.amount.toLocaleString()}</span>
        </div>
      ))}
      <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg font-bold">
        <span>Total Investimento Inicial</span>
        <span>${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

function RevenueModelCard({ model }: { model: Financials["revenueModel"] }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-primary">Precificação</h4>
        <p className="text-sm">{model.pricing}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-primary">Receita Recorrente</h4>
        <p className="text-sm">{model.recurring}</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-primary">Upsell & Cross-sell</h4>
        <p className="text-sm">{model.upsell}</p>
      </div>
    </div>
  );
}

function CashFlowChart({ projection }: { projection: Financials["cashFlowProjection"] }) {
  const chartData = (projection || []).map((point) => ({
    period: `Mês ${point.month}`,
    entrada: point.inflow / 1000,
    saida: point.outflow / 1000,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}k`} />
          <Legend />
          <Area type="monotone" dataKey="entrada" stroke="#10b981" fillOpacity={1} fill="url(#colorInflow)" name="Entrada" />
          <Area type="monotone" dataKey="saida" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutflow)" name="Saída" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BreakEvenTable({ breakEven }: { breakEven: Financials["breakEvenPoint"] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card title="Tempo até Break-Even">
        <p className="text-3xl font-bold text-blue-600">{breakEven.months}</p>
        <p className="text-sm text-muted-foreground mt-1">meses</p>
      </Card>
      <Card title="Receita no Break-Even">
        <p className="text-2xl font-bold text-green-600">{breakEven.revenue}</p>
      </Card>
    </div>
  );
}

export function FinancialsSection({ data }: FinancialsProps) {
  const totalInitialCosts = data.initialCosts?.reduce((sum, c) => sum + c.amount, 0) || 0;
  const year3Revenue = data.salesForecast && data.salesForecast.length > 0 
    ? data.salesForecast[data.salesForecast.length - 1]?.revenue || 0 
    : 0;
  const estimatedProfit = (year3Revenue * (data.profitMarginEstimate || 0)) / 100;

  return (
    <section className="space-y-6">
      <SectionTitle emoji="💵" title="Financeiro & ROI" description="Custos, receitas e lucratividade" />

      <Card title="Custos Iniciais" emoji="💸">
        <InitialCostsTable costs={data.initialCosts} />
      </Card>

      <Card title="Modelo de Receita" emoji="💰">
        <RevenueModelCard model={data.revenueModel} />
      </Card>

      <Card title="Margem de Lucro Estimada">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
          <p className="text-4xl font-bold text-primary">{data.profitMarginEstimate}%</p>
          <p className="text-sm text-muted-foreground mt-2">de margem de lucro esperada</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard label="Investimento Inicial" value={`$${totalInitialCosts.toLocaleString()}`} status="good" icon="📊" />
        <KPICard label="ROI Esperado" value={`${data.roi}%`} status="good" icon="📈" />
        <KPICard label="Receita Year 3" value={`$${year3Revenue.toLocaleString()}`} status="good" icon="💹" />
      </div>

      <Card title="Projeção de Fluxo de Caixa" emoji="📉">
        <CashFlowChart projection={data.cashFlowProjection} />
      </Card>

      <Card title="Break-Even">
        <BreakEvenTable breakEven={data.breakEvenPoint} />
      </Card>
    </section>
  );
}
