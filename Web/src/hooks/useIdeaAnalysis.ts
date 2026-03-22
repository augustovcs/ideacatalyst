import { useState, useCallback } from "react";

export interface AnalysisResult {
  ideaTitle: string;
  scores: { label: string; value: number; emoji: string }[];
  strengths: string[];
  risks: string[];
  nextSteps: string[];
  summary: string;
}

const QUESTIONS = [
  "Descreva sua ideia em poucas frases. O que ela resolve?",
  "Quem é o público-alvo principal da sua ideia?",
  "Já existe algo parecido no mercado? Se sim, qual o diferencial?",
  "Quais recursos (tempo, dinheiro, equipe) você tem disponíveis?",
  "Qual seria o primeiro passo para validar essa ideia?",
  "Onde você imagina essa ideia em 1 ano?",
];

function generateAnalysis(answers: string[]): AnalysisResult {
  const ideaText = answers[0] || "Ideia sem título";
  const title = ideaText.length > 60 ? ideaText.slice(0, 60) + "…" : ideaText;

  const wordCount = answers.join(" ").split(/\s+/).length;
  const detailLevel = Math.min(100, Math.round(wordCount * 1.2));
  const hasCompetitor = answers[2]?.toLowerCase().includes("sim") || answers[2]?.length > 30;
  const hasResources = answers[3]?.length > 20;

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
      answers[1]?.length > 10 ? "Público-alvo bem definido" : "Há espaço para refinar o público-alvo",
      hasCompetitor ? "Consciência competitiva demonstrada" : "Potencial de ser pioneiro no nicho",
    ],
    risks: [
      !hasResources ? "Recursos limitados podem atrasar a execução" : "Alocar recursos de forma estratégica",
      "Validação com usuários reais é essencial antes de escalar",
      "Mudanças regulatórias ou tecnológicas podem impactar o modelo",
    ],
    nextSteps: [
      "Criar um MVP com as funcionalidades essenciais",
      "Entrevistar 15-20 potenciais usuários para validar a dor",
      "Mapear 3 canais de aquisição de clientes prioritários",
      "Definir métricas de sucesso para os primeiros 90 dias",
    ],
    summary: `Sua ideia "${title}" demonstra ${detailLevel > 50 ? "bom nível de clareza" : "potencial que pode ser mais detalhado"}. ${hasCompetitor ? "O conhecimento do cenário competitivo é um ponto positivo." : "Pesquisar concorrentes pode revelar oportunidades."} O próximo passo mais importante é validar com usuários reais.`,
  };
}

export type Phase = "intro" | "questions" | "loading" | "result";

export function useIdeaAnalysis() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const questions = QUESTIONS;

  const submitAnswer = useCallback(
    (answer: string) => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
      } else {
        setPhase("loading");
        setTimeout(() => {
          setResult(generateAnalysis(newAnswers));
          setPhase("result");
        }, 5000);
      }
    },
    [answers, currentQuestion, questions.length]
  );

  const start = useCallback(() => setPhase("questions"), []);

  const reset = useCallback(() => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  return {
    phase,
    currentQuestion,
    totalQuestions: questions.length,
    questionText: questions[currentQuestion],
    answers,
    result,
    submitAnswer,
    start,
    reset,
  };
}
