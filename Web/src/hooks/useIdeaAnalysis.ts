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

function generateAnalysis(answers: string[]): AnalysisResult {
  const ideaText = answers[0] || "Ideia sem título";
  const title = ideaText.length > 60 ? ideaText.slice(0, 60) + "…" : ideaText;

  const wordCount = answers.join(" ").split(/\s+/).length;
  const detailLevel = Math.min(100, Math.round(wordCount * 1.2));
  // Since no additional questions, set defaults
  const hasCompetitor = false;
  const hasResources = false;

  return {
    ideaTitle: title,
    scores: [
      { label: "Viabilidade", value: Math.min(95, 55 + (hasResources ? 25 : 8) + Math.round(Math.random() * 12)), emoji: "⚙️" },
      { label: "Inovação", value: Math.min(95, 50 + (hasCompetitor ? 15 : 30) + Math.round(Math.random() * 10)), emoji: "💡" },
      { label: "Potencial de Mercado", value: Math.min(95, 45 + detailLevel / 5 + Math.round(Math.random() * 15)), emoji: "📈" },
      { label: "Clareza da Proposta", value: Math.min(95, 40 + Math.min(40, detailLevel / 2) + Math.round(Math.random() * 10)), emoji: "🎯" },
    ],
    strengths: [
      "A proposta aborda uma necessidade real do mercado",
      "Potencial de ser pioneiro no nicho",
      "Há espaço para refinar o público-alvo",
    ],
    risks: [
      "Recursos limitados podem atrasar a execução",
      "Validação com usuários reais é essencial antes de escalar",
      "Mudanças regulatórias ou tecnológicas podem impactar o modelo",
    ],
    nextSteps: [
      "Criar um MVP com as funcionalidades essenciais",
      "Entrevistar 15-20 potenciais usuários para validar a dor",
      "Mapear 3 canais de aquisição de clientes prioritários",
      "Definir métricas de sucesso para os primeiros 90 dias",
    ],
    summary: `Sua ideia "${title}" demonstra ${detailLevel > 50 ? "bom nível de clareza" : "potencial que pode ser mais detalhado"}. Pesquisar concorrentes pode revelar oportunidades. O próximo passo mais importante é validar com usuários reais.`,
  };
}

export type Phase = "intro" | "firstIdea" | "loading" | "result";

export function useIdeaAnalysis() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function sendToBackend(firstIdea: string) {
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
      //console.log("Salvo com sucesso:", data);
    } catch (err) {
      console.error(err);
    }
  }

  // Função para enviar respostas
  const submitAnswer = useCallback(
    (answer: string) => {
      const newAnswers = [answer];
      setAnswers(newAnswers);

      setPhase("loading");
      setTimeout(async () => {
        const resultData = generateAnalysis(newAnswers);
        setResult(resultData);
        setPhase("result");

        await sendToBackend(newAnswers[0]);
      }, 500);
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