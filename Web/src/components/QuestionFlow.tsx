import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionFlowProps {
  questionIndex: number;
  totalQuestions: number;
  questionText: string;
  onSubmit: (answer: string) => void;
  showProgress?: boolean;
}

export function QuestionFlow({ questionIndex, totalQuestions, questionText, onSubmit, showProgress }: QuestionFlowProps) {
  const [value, setValue] = useState("");

  

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  const progress = ((questionIndex) / totalQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6" key={questionIndex}>
      {/* Progress */}
      {showProgress &&( 
      <div className="w-full max-w-lg mb-12 animate-fade-in">
        <div className="flex justify-between text-sm text-muted-foreground mb-2 font-mono-data">
          <span>Pergunta {questionIndex + 1}/{totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      )}

   
      {/* Question */}
      <div className="w-full max-w-lg animate-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 leading-snug" style={{ lineHeight: "1.2" }}>
          {questionText}
        </h2>

        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Digite sua resposta..."
            rows={4}
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-shadow duration-200"
            autoFocus
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground">
            Enter para enviar · Shift+Enter para nova linha
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="rounded-xl gap-2 transition-all duration-200 active:scale-95"
          >
            Enviar
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    
  );
}


