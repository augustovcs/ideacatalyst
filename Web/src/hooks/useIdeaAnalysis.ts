import { useState, useCallback } from "react";

export interface AnalysisResult {
  ideaTitle: string;
  scores: { label: string; value: number; emoji: string }[];
  strengths: string[];
  risks: string[];
  nextSteps: string[];
  summary: string;
}

export const FirstIdea = "Descreva sua ideia em poucas frases. O que ela resolve?";

export type Phase = "intro" | "firstIdea" | "loading" | "result";

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
  subMarket: string | null;
}

function mapBackendToFrontend(backend: BackendAnalysisResult): AnalysisResult | null {
  console.log("Mapping backend result:", backend);
  if (backend.status !== "completed" || !backend.fullAnalysis) {
    console.log("Not completed or no fullAnalysis");
    return null; // Não mapear se não estiver completo ou sem dados
  }

  const title = backend.ideaTitle || "Ideia sem título";

  let parsedData: any = {};
  try {
    parsedData = JSON.parse(backend.fullAnalysis);
    console.log("Parsed data:", parsedData);
  } catch (e) {
    console.log("Failed to parse fullAnalysis:", e);
    return null; // Se não conseguir parsear, não mapear
  }

  // Extrair dados do JSON
  const marketAnalysis = parsedData.marketAnalysis || {};
  const financials = parsedData.financials || {};
  const marketingAndSales = parsedData.marketingAndSales || {};

  const marketSize = backend.marketSize || marketAnalysis.marketSize?.current;
  const cagr = backend.cagr || marketAnalysis.marketSize?.cagr;
  const roi = backend.roi || financials.roi;
  const breakEvenMonths = backend.breakEvenMonths || financials.breakEvenPoint?.months;
  const customerAcquisitionCost = backend.customerAcquisitionCost || marketingAndSales.customerAcquisitionCost;
  const lifetimeValue = backend.lifetimeValue || marketingAndSales.lifetimeValue;

  // Só mapear se houver pelo menos alguns dados reais
  if (!marketSize && !cagr && !roi && !customerAcquisitionCost && !lifetimeValue) {
    return null;
  }

  // Criar scores baseados em dados reais
  const scores = [
    { label: "ROI", value: roi ? Math.min(100, Math.max(0, roi)) : 0, emoji: "💰" },
    { label: "CAGR", value: cagr ? Math.min(100, Math.max(0, cagr)) : 0, emoji: "📈" },
    { label: "Break-even (meses)", value: breakEvenMonths ? Math.min(100, breakEvenMonths) : 0, emoji: "⏱️" },
    { label: "CAC", value: customerAcquisitionCost ? Math.min(100, customerAcquisitionCost) : 0, emoji: "💸" },
  ];

  const strengths = [
    marketSize ? `Tamanho de mercado: ${marketSize}` : null,
    cagr ? `CAGR: ${cagr}%` : null,
    roi ? `ROI: ${roi}%` : null,
    customerAcquisitionCost ? `Custo de aquisição: R$ ${customerAcquisitionCost}` : null,
    lifetimeValue ? `Valor vitalício: R$ ${lifetimeValue}` : null,
  ].filter(s => s);

  const risks = [
    breakEvenMonths && breakEvenMonths > 12 ? `Break-even em ${breakEvenMonths} meses - longo prazo` : "Break-even acessível",
    "Validação com usuários reais é essencial",
  ];

  const nextSteps = [
    "Criar um MVP com as funcionalidades essenciais",
    "Entrevistar potenciais usuários para validar a dor",
    "Mapear canais de aquisição de clientes",
    "Definir métricas de sucesso",
  ];

  const summary = `Análise completa da ideia "${title}". Dados reais extraídos da IA: Mercado ${marketSize || 'N/A'}, CAGR ${cagr || 'N/A'}%, ROI ${roi || 'N/A'}%, Break-even ${breakEvenMonths || 'N/A'} meses, CAC R$ ${customerAcquisitionCost || 'N/A'}, LTV R$ ${lifetimeValue || 'N/A'}.`;

  return {
    ideaTitle: title,
    scores,
    strengths,
    risks,
    nextSteps,
    summary,
  };
}

function generateMockAnalysis(ideaDescription: string): AnalysisResult {
  const title = ideaDescription ? ideaDescription.split(/[.?!]/)[0].slice(0, 70) : 'Ideia de fallback';

  return {
    ideaTitle: title || 'Ideia sem título',
    scores: [
      { label: 'ROI', value: 40, emoji: '💰' },
      { label: 'CAGR', value: 18, emoji: '📈' },
      { label: 'Break-even', value: 45, emoji: '⏱️' },
      { label: 'CAC', value: 30, emoji: '💸' },
    ],
    strengths: ['Mercado em expansão', 'Proposta de valor clara', 'Alto potencial de escalabilidade'],
    risks: ['Validação de usuário necessária', 'Dependência de aquisição de clientes', 'Concorrência direta em nicho'],
    nextSteps: ['Prototipar MVP', 'Testar preço', 'Obter feedback de early adopters'],
    summary: `Análise mock para ${title}. Resultados estimados com base em heurísticas.`,
  };
}

export function useIdeaAnalysis() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function fetchAnalysisResult(sessionId: string): Promise<BackendAnalysisResult> {
    const response = await fetch(`http://localhost:5068/api/input/analysis/${sessionId}`);
    if (!response.ok) throw new Error("Erro ao buscar análise");
    return await response.json();
  }

  async function waitForAnalysis(sessionId: string, maxAttempts = 30): Promise<BackendAnalysisResult> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const result = await fetchAnalysisResult(sessionId);
        console.log("Polling attempt", i + 1, "status:", result.status, "data:", result);
        if (result.status === "completed") {
          return result;
        }
      } catch (e) {
        console.log("Polling error:", e);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
    }
    throw new Error("Análise não completou a tempo");
  }

  async function sendToBackend(firstIdea: string): Promise<string> {
    try {
      const response = await fetch("http://localhost:5068/api/input/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: firstIdea,
          status: "Active",
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar a ideia");

      const data = await response.json();
      return data.sessionId;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Função para enviar respostas
  const submitAnswer = useCallback(
    async (answer: string) => {
      const newAnswers = [answer];
      setAnswers(newAnswers);

      setPhase("loading");
      try {
        const sessionId = await sendToBackend(newAnswers[0]);
        const backendResult = await waitForAnalysis(sessionId);
        const resultData = mapBackendToFrontend(backendResult);
        if (resultData) {
          setResult(resultData);
          setPhase("result");
        } else {
          // Se não conseguiu mapear, talvez erro ou retry
          console.error("Dados insuficientes para exibir análise");
          setPhase("firstIdea");
        }
      } catch (err) {
        console.error('Erro no submitAnswer, usando mock:', err);
        const fallback = generateMockAnalysis(answer);
        setResult(fallback);
        setPhase("result");
      }
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
    questionText: phase === "firstIdea" ? FirstIdea : "",
    answers,
    result,
    submitAnswer,
    start,
    reset,
  };
}