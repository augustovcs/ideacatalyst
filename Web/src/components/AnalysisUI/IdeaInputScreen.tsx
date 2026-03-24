import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface IdeaInputScreenProps {
  onSubmit: (idea: string) => void;
  isLoading?: boolean;
}

export function IdeaInputScreen({ onSubmit, isLoading = false }: IdeaInputScreenProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = () => {
    if (idea.trim().length > 10) {
      onSubmit(idea.trim());
    }
  };

  const isValid = idea.trim().length > 10;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <span className="text-3xl">💡</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Descreva sua Ideia</h1>
        <p className="text-muted-foreground">
          Forneça uma descrição clara e detalhada da sua ideia para receber uma análise completa de mercado, viabilidade e estratégia.
        </p>
      </div>

      <div className="space-y-6">
        <Textarea
          placeholder="Ex: Uma plataforma SaaS que usa IA para automatizar análise de documentos legais, reduzindo custos em 60% para pequenos escritórios de advocacia..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="min-h-32"
          disabled={isLoading}
        />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {idea.length} caracteres {idea.trim().length > 10 ? "✓" : "(mínimo 10)"}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? "Analisando..." : "Gerar Análise Completa"}
          </Button>
        </div>

        <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
          <h3 className="font-semibold mb-3">📝 Dicas para melhor análise:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Descreva o problema que sua ideia resolve</li>
            <li>• Mencione o público-alvo principal</li>
            <li>• Destaque a diferenciação ou inovação</li>
            <li>• Inclua estimativas de tamanho de mercado, se houver</li>
            <li>• Mencione tecnologias ou parcerias chave</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
