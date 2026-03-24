import { useState, useCallback } from "react";

export interface Demographic {
  ageRange: string;
  gender: string;
  incomeLevel: string;
  location: string;
  psychographics: string[];
}

export interface ExecutiveSummary {
  description: string;
  valueProposition: string;
  targetCustomer: Demographic;
  strategicFit: string;
}

export interface MarketSize {
  current: string;
  projected5Years: string;
  cagr: number;
  subMarkets: SubMarket[];
}

export interface SubMarket {
  name: string;
  percentage: number;
}

export interface Trend {
  trend: string;
  impact: "high" | "medium" | "low";
  dataPoint: string;
  reference: string;
}

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  notes: string;
  reference: string;
}

export interface NewsArticle {
  title: string;
  date: string;
  source: string;
  relevance: "high" | "medium" | "low";
  url: string;
}

export interface MarketAnalysis {
  marketSize: MarketSize;
  trends: Trend[];
  competition: Competitor[];
  recentNews: NewsArticle[];
  barriersToEntry: BarrierToEntry[];
}

export interface BarrierToEntry {
  barrier: string;
  impactLevel: "high" | "medium" | "low";
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TechnicalDetails {
  technologiesRequired: Technology[];
  complexity: "low" | "medium" | "high";
  criticalProcesses: CriticalProcess[];
  humanResources: HumanResource[];
  operationalMetrics: OperationalMetric[];
}

export interface Technology {
  name: string;
  icon: string;
}

export interface CriticalProcess {
  process: string;
  impact: "high" | "medium" | "low";
  dependencies: string;
  reference: string;
}

export interface HumanResource {
  role: string;
  count: number;
  skillLevel: "junior" | "mid" | "senior";
  reference: string;
}

export interface OperationalMetric {
  kpi: string;
  target: string;
  benchmark: string;
  reference: string;
}

export interface MarketingAndSales {
  strategies: Strategy[];
  channels: Channel[];
  customerAcquisitionCost: number;
  lifetimeValue: number;
  salesForecast: SalesForecastPoint[];
  conversionMetrics: ConversionMetric[];
}

export interface Strategy {
  text: string;
  reference: string;
}

export interface Channel {
  name: string;
  icon: string;
  url: string;
}

export interface SalesForecastPoint {
  year: number;
  revenue: number;
}

export interface ConversionMetric {
  metric: string;
  target: number;
  benchmark: number;
}

export interface Financials {
  initialCosts: InitialCost[];
  revenueModel: {
    pricing: string;
    recurring: string;
    upsell: string;
  };
  profitMarginEstimate: number;
  cashFlowProjection: CashFlowPoint[];
  roi: number;
  breakEvenPoint: {
    months: number;
    revenue: string;
  };
}

export interface InitialCost {
  category: string;
  amount: number;
}

export interface CashFlowPoint {
  month: number;
  inflow: number;
  outflow: number;
}

export interface RisksAndMitigation {
  keyRisks: KeyRisk[];
  mitigationActions: MitigationAction[];
  nextSteps: string[];
}

export interface KeyRisk {
  risk: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  reference: string;
}

export interface MitigationAction {
  action: string;
  reference: string;
}

export interface AdditionalInsights {
  partnershipOpportunities: PartnershipOpportunity[];
  emergingTechnologies: EmergingTechnology[];
  regulatoryConsiderations: RegulatoryConsideration[];
}

export interface PartnershipOpportunity {
  partner: string;
  reference: string;
}

export interface EmergingTechnology {
  technology: string;
  relevance: string;
}

export interface RegulatoryConsideration {
  regulation: string;
  impact: string;
  reference: string;
}

export interface DetailedAnalysisResult {
  ideaTitle: string;
  executiveSummary: ExecutiveSummary;
  marketAnalysis: MarketAnalysis;
  swotAnalysis: SWOTAnalysis;
  technicalDetails: TechnicalDetails;
  marketingAndSales: MarketingAndSales;
  financials: Financials;
  risksAndMitigation: RisksAndMitigation;
  additionalInsights: AdditionalInsights;
}

function generateDetailedAnalysis(ideaDescription: string): DetailedAnalysisResult {
  const title = ideaDescription.length > 60 ? ideaDescription.slice(0, 60) + "…" : ideaDescription;

  return {
    ideaTitle: title,
    executiveSummary: {
      description: `${ideaDescription} Esta solução foi elaborada para atender uma lacuna específica no mercado, oferecendo valor tangível e diferenciação clara.`,
      valueProposition: "Redução de custos operacionais e aumento de eficiência em 40% em 12 meses",
      targetCustomer: {
        ageRange: "25-45 anos",
        gender: "Todos",
        incomeLevel: "Classe A e B",
        location: "Centros urbanos principais",
        psychographics: [
          "Early adopters de tecnologia",
          "Buscam otimização e eficiência",
          "Conscientes sobre ROI",
          "Preferem soluções integradas",
        ],
      },
      strategicFit: "https://example.com/estrategia",
    },
    marketAnalysis: {
      marketSize: {
        current: "$12.5B",
        projected5Years: "$42.3B",
        cagr: 28.5,
        subMarkets: [
          { name: "Enterprise", percentage: 45 },
          { name: "Mid-Market", percentage: 35 },
          { name: "SMB", percentage: 20 },
        ],
      },
      trends: [
        {
          trend: "Aumento de adoção de IA em automação",
          impact: "high",
          dataPoint: "+156% year-over-year",
          reference: "https://example.com/trend1",
        },
        {
          trend: "Migração para cloud",
          impact: "high",
          dataPoint: "75% das empresas até 2025",
          reference: "https://example.com/trend2",
        },
        {
          trend: "Foco em sostenibilidade",
          impact: "medium",
          dataPoint: "Regulamentações em 30 países",
          reference: "https://example.com/trend3",
        },
      ],
      competition: [
        {
          name: "Competitor A",
          marketShare: 35,
          strengths: ["Presença global", "Marca estabelecida"],
          weaknesses: ["UI/UX desatualizada", "Suporte lento"],
          notes: "Lider de mercado com custos altos",
          reference: "https://example.com/competitorA",
        },
        {
          name: "Competitor B",
          marketShare: 25,
          strengths: ["Inovação rápida", "Preço competitivo"],
          weaknesses: ["Falta de integração", "Documentação ruim"],
          notes: "Startup em crescimento",
          reference: "https://example.com/competitorB",
        },
      ],
      recentNews: [
        {
          title: "Market Trends Show Growth in Q4",
          date: "2025-01-15",
          source: "TechNews",
          relevance: "high",
          url: "https://example.com/news1",
        },
        {
          title: "New Regulations Announced",
          date: "2025-01-10",
          source: "RegulationBulletin",
          relevance: "high",
          url: "https://example.com/news2",
        },
      ],
      barriersToEntry: [
        { barrier: "Capital inicial alto", impactLevel: "high" },
        { barrier: "Compliance regulatório", impactLevel: "high" },
        { barrier: "Curva de aprendizado", impactLevel: "medium" },
      ],
    },
    swotAnalysis: {
      strengths: [
        "Tecnologia proprietária diferenciada",
        "Equipe com experiência de 15+ anos",
        "Modelo de negócio validado",
      ],
      weaknesses: [
        "Marca desconhecida no mercado",
        "Recursos de marketing limitados",
        "Dependência de fornecedores críticos",
      ],
      opportunities: [
        "Expansão geográfica para 5 novos países",
        "Parcerias estratégicas com líderes de mercado",
        "Verticalização para nichos de alto valor",
      ],
      threats: [
        "Entrada de gigantes de tech (Google, Amazon)",
        "Mudanças em regulamentações",
        "Ciclo econômico recessivo",
      ],
    },
    technicalDetails: {
      technologiesRequired: [
        { name: "AI/ML", icon: "🤖" },
        { name: "Cloud (AWS)", icon: "☁️" },
        { name: "React", icon: "⚛️" },
        { name: "PostgreSQL", icon: "🗄️" },
      ],
      complexity: "high",
      criticalProcesses: [
        {
          process: "Data Processing Pipeline",
          impact: "high",
          dependencies: "Google Cloud, RabbitMQ",
          reference: "https://example.com/process1",
        },
        {
          process: "User Authentication & Authorization",
          impact: "high",
          dependencies: "Auth0, OAuth2",
          reference: "https://example.com/process2",
        },
      ],
      humanResources: [
        { role: "Senior Engineer", count: 3, skillLevel: "senior", reference: "Job posting" },
        { role: "Mid-level Developer", count: 5, skillLevel: "mid", reference: "Job posting" },
        { role: "Product Manager", count: 1, skillLevel: "senior", reference: "Job posting" },
      ],
      operationalMetrics: [
        { kpi: "System Uptime", target: "99.99%", benchmark: "99.95%", reference: "SLA" },
        { kpi: "Response Time", target: "<200ms", benchmark: "<500ms", reference: "Performance" },
      ],
    },
    marketingAndSales: {
      strategies: [
        { text: "Content marketing e thought leadership", reference: "https://example.com/strategy1" },
        { text: "Partnership com consultores", reference: "https://example.com/strategy2" },
      ],
      channels: [
        { name: "LinkedIn", icon: "💼", url: "https://linkedin.com" },
        { name: "Industry Conferences", icon: "🎤", url: "https://example.com" },
        { name: "Direct Sales", icon: "🤝", url: "https://sales.example.com" },
      ],
      customerAcquisitionCost: 2500,
      lifetimeValue: 125000,
      salesForecast: [
        { year: 1, revenue: 2000000 },
        { year: 2, revenue: 8500000 },
        { year: 3, revenue: 22000000 },
      ],
      conversionMetrics: [
        { metric: "Website to Trial", target: 8, benchmark: 5 },
        { metric: "Trial to Paid", target: 25, benchmark: 20 },
        { metric: "Customer Retention", target: 95, benchmark: 90 },
      ],
    },
    financials: {
      initialCosts: [
        { category: "R&D", amount: 500000 },
        { category: "Marketing & Sales", amount: 300000 },
        { category: "Operations", amount: 200000 },
        { category: "Compliance & Legal", amount: 100000 },
      ],
      revenueModel: {
        pricing: "$99/mês (Pro) e $299/mês (Enterprise)",
        recurring: "100% subscription baseado",
        upsell: "Addons de analytics avançados e suporte premium",
      },
      profitMarginEstimate: 68,
      cashFlowProjection: [
        { month: 1, inflow: 0, outflow: 150000 },
        { month: 6, inflow: 250000, outflow: 200000 },
        { month: 12, inflow: 800000, outflow: 420000 },
        { month: 24, inflow: 3500000, outflow: 1200000 },
      ],
      roi: 385,
      breakEvenPoint: {
        months: 18,
        revenue: "$4.2M ARR",
      },
    },
    risksAndMitigation: {
      keyRisks: [
        {
          risk: "Atraso na implementação de features críticas",
          probability: "medium",
          impact: "high",
          reference: "https://example.com/risk1",
        },
        {
          risk: "Churn de clientes acima de 5% ao mês",
          probability: "medium",
          impact: "high",
          reference: "https://example.com/risk2",
        },
      ],
      mitigationActions: [
        { action: "Implementar programa de sucesso do cliente robusto", reference: "CSM Plan" },
        { action: "Estabelecer roadmap de produto transparente", reference: "Product Roadmap" },
        { action: "Criar fundo contingencial de 20% do orçamento", reference: "Finance Plan" },
      ],
      nextSteps: [
        "✓ Validar MVP com 50 usuários beta",
        "✓ Fechar investments de pré-seed",
        "✓ Contratar VP de Vendas",
        "✓ Estabelecer primeiros 5 clientes enterprise",
      ],
    },
    additionalInsights: {
      partnershipOpportunities: [
        {
          partner: "Grande consultoria de gestão (McKinsey, BCG)",
          reference: "https://example.com/partner1",
        },
        {
          partner: "Provedor cloud líder (AWS, GCP)",
          reference: "https://example.com/partner2",
        },
      ],
      emergingTechnologies: [
        {
          technology: "Quantum Computing",
          relevance: "Potencial para otimização de algoritmos em 3-5 anos",
        },
        {
          technology: "Edge Computing",
          relevance: "Redução de latência em processamento de dados",
        },
      ],
      regulatoryConsiderations: [
        {
          regulation: "LGPD (Data Protection)",
          impact: "High - Implementação obrigatória",
          reference: "https://example.com/lgpd",
        },
        {
          regulation: "SOC 2 Compliance",
          impact: "High - Requisitado por clientes enterprise",
          reference: "https://example.com/soc2",
        },
      ],
    },
  };
}

export type AnalysisPhase = "intro" | "firstIdea" | "loading" | "result";

export function useDetailedAnalysis() {
  const [phase, setPhase] = useState<AnalysisPhase>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<DetailedAnalysisResult | null>(null);

  async function sendToBackend(ideaDescription: string) {
    try {
      const response = await fetch("http://localhost:5068/api/input/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: ideaDescription,
          status: "Active",
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar a ideia");

      const data = await response.json();
      console.log("Ideia enviada com sucesso:", data);
    } catch (err) {
      console.error("Erro ao enviar para backend:", err);
    }
  }

  const submitIdea = useCallback(
    (ideaDescription: string) => {
      setAnswers([ideaDescription]);
      setPhase("loading");

      setTimeout(async () => {
        const analysisData = generateDetailedAnalysis(ideaDescription);
        setResult(analysisData);
        setPhase("result");
        await sendToBackend(ideaDescription);
      }, 1500);
    },
    []
  );

  const start = useCallback(() => setPhase("firstIdea"), []);

  const reset = useCallback(() => {
    setPhase("intro");
    setAnswers([]);
    setResult(null);
  }, []);

  return {
    phase,
    result,
    submitIdea,
    start,
    reset,
  };
}
