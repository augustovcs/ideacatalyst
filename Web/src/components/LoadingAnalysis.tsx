import { useEffect, useState } from "react";

const LOADING_STAGES = [
  { emoji: "🔍", text: "Analisando suas respostas..." },
  { emoji: "🧠", text: "Processando padrões..." },
  { emoji: "📊", text: "Calculando métricas..." },
  { emoji: "✨", text: "Finalizando análise..." },
];

export function LoadingAnalysis() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s < LOADING_STAGES.length - 1 ? s + 1 : s));
    }, 1300);
    return () => clearInterval(interval);
  }, []);

  const current = LOADING_STAGES[stage];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* Animated emoji */}
      <div className="text-7xl mb-8 animate-bounce-emoji">{current.emoji}</div>

      {/* Text */}
      <p className="text-xl font-medium mb-8 animate-fade-in" key={stage}>
        {current.text}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary animate-progress-fill" />
      </div>

      {/* Stage dots */}
      <div className="flex gap-2 mt-6">
        {LOADING_STAGES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i <= stage ? "bg-primary scale-110" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
