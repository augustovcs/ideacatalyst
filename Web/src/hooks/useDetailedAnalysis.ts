import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

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

export interface SubMarket {
  name: string;
  percentage: number;
}

export interface MarketSize {
  current: string;
  projected5Years: string;
  cagr: number;
  subMarkets: SubMarket[];
}

export interface Trend {
  trend: string;
  impact: 'high' | 'medium' | 'low';
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
  relevance: 'high' | 'medium' | 'low';
  url: string;
}

export interface BarrierToEntry {
  barrier: string;
  impactLevel: 'high' | 'medium' | 'low';
}

export interface MarketAnalysis {
  marketSize: MarketSize;
  trends: Trend[];
  competition: Competitor[];
  recentNews: NewsArticle[];
  barriersToEntry: BarrierToEntry[];
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Technology {
  name: string;
  icon: string;
}

export interface CriticalProcess {
  process: string;
  impact: 'high' | 'medium' | 'low';
  dependencies: string;
  reference: string;
}

export interface HumanResource {
  role: string;
  count: number;
  skillLevel: 'junior' | 'mid' | 'senior';
  reference: string;
}

export interface OperationalMetric {
  kpi: string;
  target: string;
  benchmark: string;
  reference: string;
}

export interface TechnicalDetails {
  technologiesRequired: Technology[];
  complexity: 'low' | 'medium' | 'high';
  criticalProcesses: CriticalProcess[];
  humanResources: HumanResource[];
  operationalMetrics: OperationalMetric[];
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

export interface MarketingAndSales {
  strategies: Strategy[];
  channels: Channel[];
  customerAcquisitionCost: number;
  lifetimeValue: number;
  salesForecast: SalesForecastPoint[];
  conversionMetrics: ConversionMetric[];
}

export interface CashFlowPoint {
  month: number;
  inflow: number;
  outflow: number;
}

export interface Financials {
  initialCosts: { category: string; amount: number }[];
  revenueModel: { pricing: string; recurring: string; upsell: string };
  profitMarginEstimate: number;
  cashFlowProjection: CashFlowPoint[];
  roi: number;
  breakEvenPoint: { months: number; revenue: string };
}

export interface KeyRisk {
  risk: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  reference: string;
}

export interface MitigationAction {
  action: string;
  reference: string;
}

export interface RisksAndMitigation {
  keyRisks: KeyRisk[];
  mitigationActions: MitigationAction[];
  nextSteps: string[];
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

export interface AdditionalInsights {
  partnershipOpportunities: PartnershipOpportunity[];
  emergingTechnologies: EmergingTechnology[];
  regulatoryConsiderations: RegulatoryConsideration[];
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

interface BackendAnalysisResult {
  id: string;
  sessionId: string;
  score: number | null;
  fullAnalysis: string;
  ideaTitle: string | null;
  marketSize: string | null;
  cagr: number | null;
  roi: number | null;
  breakEvenMonths: number | null;
  customerAcquisitionCost: number | null;
  lifetimeValue: number | null;
  status: string;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export const FirstIdea = 'Descreva sua ideia em poucas frases. O que ela resolve?';
export type AnalysisPhase = 'intro' | 'firstIdea' | 'loading' | 'result';

const API_BASE = 'http://localhost:5068/api/input';
const SESSION_STORAGE_KEY = 'analysis_session';

function mapBackendToDetailedAnalysis(backend: BackendAnalysisResult): DetailedAnalysisResult | null {
  if (backend.status.toLowerCase() !== 'completed' || !backend.fullAnalysis) {
    return null;
  }

  let aiData: any;
  try {
    aiData = JSON.parse(backend.fullAnalysis);
  } catch (error) {
    console.error('Falha no JSON do backend:', error);
    return null;
  }

  const executiveData = aiData.executiveSummary || {};
  const marketAnalysisData = aiData.marketAnalysis || {};
  const swotData = aiData.swotAnalysis || {};
  const technicalData = aiData.technicalDetails || { technologiesRequired: [], complexity: 'medium', criticalProcesses: [], humanResources: [], operationalMetrics: [] };
  const marketingData = aiData.marketingAndSales || {};
  const financialsData = aiData.financials || {};
  const risksData = aiData.risksAndMitigation || {};
  const additionalData = aiData.additionalInsights || {};

  return {
    ideaTitle: backend.ideaTitle || aiData.ideaTitle || 'Ideia sem t�tulo',
    executiveSummary: {
      description: executiveData.description || aiData.description || 'Resumo n�o dispon�vel',
      valueProposition: executiveData.valueProposition || 'Proposta de valor n�o dispon�vel',
      targetCustomer: executiveData.targetCustomer || { ageRange: 'N/A', gender: 'N/A', incomeLevel: 'N/A', location: 'N/A', psychographics: [] },
      strategicFit: executiveData.strategicFit || 'N/A',
    },
    marketAnalysis: {
      marketSize: {
        current: marketAnalysisData.marketSize?.current || backend.marketSize || 'N/A',
        projected5Years: marketAnalysisData.marketSize?.projected5Years || 'N/A',
        cagr: marketAnalysisData.marketSize?.cagr || backend.cagr || 0,
        subMarkets: marketAnalysisData.marketSize?.subMarkets || [],
      },
      trends: marketAnalysisData.trends || [],
      competition: marketAnalysisData.competition || [],
      recentNews: marketAnalysisData.recentNews || [],
      barriersToEntry: marketAnalysisData.barriersToEntry || [],
    },
    swotAnalysis: {
      strengths: swotData.strengths || [],
      weaknesses: swotData.weaknesses || [],
      opportunities: swotData.opportunities || [],
      threats: swotData.threats || [],
    },
    technicalDetails: technicalData,
    marketingAndSales: {
      strategies: marketingData.strategies || [],
      channels: marketingData.channels || [],
      customerAcquisitionCost: marketingData.customerAcquisitionCost || backend.customerAcquisitionCost || 0,
      lifetimeValue: marketingData.lifetimeValue || backend.lifetimeValue || 0,
      salesForecast: marketingData.salesForecast || [],
      conversionMetrics: marketingData.conversionMetrics || [],
    },
    financials: {
      initialCosts: financialsData.initialCosts || [],
      revenueModel: financialsData.revenueModel || { pricing: 'N/A', recurring: 'N/A', upsell: 'N/A' },
      profitMarginEstimate: financialsData.profitMarginEstimate || 0,
      cashFlowProjection: financialsData.cashFlowProjection || [],
      roi: financialsData.roi || backend.roi || 0,
      breakEvenPoint: financialsData.breakEvenPoint || { months: backend.breakEvenMonths || 0, revenue: 'N/A' },
    },
    risksAndMitigation: {
      keyRisks: risksData.keyRisks || [],
      mitigationActions: risksData.mitigationActions || [],
      nextSteps: risksData.nextSteps || [],
    },
    additionalInsights: {
      partnershipOpportunities: additionalData.partnershipOpportunities || [],
      emergingTechnologies: additionalData.emergingTechnologies || [],
      regulatoryConsiderations: additionalData.regulatoryConsiderations || [],
    },
  };
}

function generateMockDetailedAnalysis(ideaDescription: string): DetailedAnalysisResult {
  const title = ideaDescription ? ideaDescription.split(/\.\?|\.|!/)[0].slice(0, 70) : 'Ideia de fallback';

  return {
    ideaTitle: title || 'Ideia sem título',
    executiveSummary: {
      description: `Análise baseada em dados simulados para a ideia: ${ideaDescription}`,
      valueProposition: 'Solução inovadora com foco em eficiência e experiência do usuário.',
      targetCustomer: { ageRange: '25-45', gender: 'Todos', incomeLevel: 'R$5k+', location: 'Brasil', psychographics: ['Focado em tecnologia', 'Busca eficiência', 'Disposto a pagar por valor'] },
      strategicFit: 'Alta aderência ao mercado atual de transformação digital.',
    },
    marketAnalysis: {
      marketSize: { current: 'R$ 2.5B', projected5Years: 'R$ 4.0B', cagr: 14.3, subMarkets: [{ name: 'SaaS corporativo', percentage: 42 }, { name: 'Automação', percentage: 29 }] },
      trends: [{ trend: 'Adoção de automação', impact: 'high', dataPoint: '70% de empresas planejam investir', reference: 'Relatório 2025' }],
      competition: [{ name: 'Concorrente A', marketShare: 0.25, strengths: ['Escala', 'Preço'], weaknesses: ['Baixa personalização'], notes: 'Atenção ao nicho', reference: 'Benchmark interno' }],
      recentNews: [{ title: 'Investimento em IA cresce', date: '2025-06-14', source: 'Tech News', relevance: 'high', url: 'https://example.com' }],
      barriersToEntry: [{ barrier: 'Regulação', impactLevel: 'medium', reference: 'Agência reguladora' }],
    },
    swotAnalysis: { strengths: ['Proposta de valor clara', 'Mercado em crescimento'], weaknesses: ['Dependência inicial de recursos técnicos'], opportunities: ['Integração com parceiros estratégicos'], threats: ['Concorrência de players consolidados'] },
    technicalDetails: { technologiesRequired: [{ name: 'React', icon: '⚛️' }, { name: 'Node.js', icon: '🟢' }], complexity: 'medium', criticalProcesses: [{ process: 'Validação de MVP', impact: 'high', dependencies: 'Equipe de produto', reference: 'Roadmap' }], humanResources: [{ role: 'Fullstack', count: 2, skillLevel: 'senior', reference: 'Recrutamento' }], operationalMetrics: [{ kpi: 'CAC', target: 'R$ 350', benchmark: 'R$ 450', reference: 'Análise de mercado' }] },
    marketingAndSales: { strategies: [{ text: 'Campanha digital segmentada', reference: 'Plano marketing' }], channels: [{ name: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com' }], customerAcquisitionCost: 400, lifetimeValue: 2300, salesForecast: [{ year: 2025, revenue: 520000 }], conversionMetrics: [{ metric: 'Lead-to-customer', target: 4, benchmark: 2.2 }] },
    financials: { initialCosts: [{ category: 'Desenvolvimento', amount: 180000 }], revenueModel: { pricing: 'Assinatura', recurring: 'Sim', upsell: 'Suporte premium' }, profitMarginEstimate: 29, cashFlowProjection: [{ month: 1, inflow: 0, outflow: 35000 }], roi: 36, breakEvenPoint: { months: 14, revenue: 'R$ 420k' } },
    risksAndMitigation: { keyRisks: [{ risk: 'Adoção lenta', probability: 'medium', impact: 'high', reference: 'Estudo' }], mitigationActions: [{ action: 'Piloto com early adopters', reference: 'Estratégia' }], nextSteps: ['Definir MVP', 'Validar com clientes'] },
    additionalInsights: { partnershipOpportunities: [{ partner: 'Aceleradora X', reference: 'Contato' }], emergingTechnologies: [{ technology: 'IA conversacional', relevance: 'Alta' }], regulatoryConsiderations: [{ regulation: 'LGPD', impact: 'Médio', reference: 'Compliance' }] },
  };
}

async function postIdea(answer: string, userId: string): Promise<string> {
  const sessionId = localStorage.getItem(SESSION_STORAGE_KEY) || crypto.randomUUID();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);


  const body = {
    answer: answer,
    userId: userId,
    status: 'Active',
    created_at: new Date().toISOString(),
    
  };

  console.log("BODY SENDO ENVIADO:", body);
  
  const response = await fetch(`${API_BASE}/idea?userId=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer: answer, status: 'Active', created_at: new Date().toISOString()}),
    
  });

  
  

  if (!response.ok) throw new Error('Erro ao salvar a ideia');

  const data = await response.json();
  return data.sessionId || sessionId;
}



async function fetchAnalysisResult(sessionId: string): Promise<BackendAnalysisResult | null> {
  const response = await fetch(`${API_BASE}/analysis/${sessionId}`);

  if (response.status === 404) {
    // Análise ainda não registrada no backend (processamento em fila).
    return null;
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar análise: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function waitForAnalysis(sessionId: string, maxAttempts = 200): Promise<BackendAnalysisResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fetchAnalysisResult(sessionId);
    if (!result) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }

    if (result.status.toLowerCase() === 'completed') return result;
    if (result.status.toLowerCase() === 'error') throw new Error('Análise retornou erro no backend');

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error('Timeout aguardando análise completar');
}

export function useDetailedAnalysis() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<AnalysisPhase>('intro');
  const [result, setResult] = useState<DetailedAnalysisResult | null>(null);

  useEffect(() => {
    const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!savedSessionId || phase !== 'intro') return;

    (async () => {
      try {
        const backendResult = await fetchAnalysisResult(savedSessionId);
        if (!backendResult || backendResult.status.toLowerCase() !== 'completed') return;

        const detailed = mapBackendToDetailedAnalysis(backendResult);
        if (detailed) {
          setResult(detailed);
          setPhase('result');
        }
      } catch (error) {
        console.error('Erro no refresh de análise:', error);
      }
    })();
  }, [phase]);

  const submitIdea = useCallback(
    async (
      ideaDescription: string,
      userId: string = '',
      saveToHistory?: (idea: string, result: string, sessionId: string, wasMock: boolean) => Promise<void>
    ) => {
      setPhase('loading');

      if (!user?.apiAccessEnabled) {
        //console.log('Usuário sem acesso à API, aplicando mock');
        const fallback = generateMockDetailedAnalysis(ideaDescription);
        setResult(fallback);
        setPhase('result');
        return;


      }

      try {
        const sessionId = await postIdea(ideaDescription, userId);
        const backendResult = await waitForAnalysis(sessionId);
        const detailed = mapBackendToDetailedAnalysis(backendResult);
        if (!detailed) throw new Error('Dados insuficientes do backend');

        setResult(detailed);
        setPhase('result');

        // Salva no histórico se callback foi fornecido
        if (saveToHistory && userId) {
          await saveToHistory(ideaDescription, JSON.stringify(detailed), sessionId, false);
        }
      } catch (error) {
        console.error('Erro no submitIdea, aplicando mock:', error);
        const fallback = generateMockDetailedAnalysis(ideaDescription);
        setResult(fallback);
        setPhase('result');

        // Salva mock no histórico também
        if (saveToHistory && userId) {
          const sessionId = crypto.randomUUID();
          await saveToHistory(ideaDescription, JSON.stringify(fallback), sessionId, true);
        }
      }
    },
    [user]
  );

  const setManualResult = useCallback((resultData: DetailedAnalysisResult) => {
    setResult(resultData);
    setPhase('result');
  }, []);

  const start = useCallback(() => setPhase('firstIdea'), []);
  const reset = useCallback(() => {
    setPhase('intro');
    setResult(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  return {
    phase,
    result,
    submitIdea,
    setManualResult,
    start,
    reset,
  };
}
