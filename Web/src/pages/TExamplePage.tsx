import { useState } from "react";
import { useDetailedAnalysis } from "@/hooks/useDetailedAnalysis";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IntroScreen } from "@/components/IntroScreen";
import { IdeaInputScreen } from "@/components/AnalysisUI/IdeaInputScreen";
import { AnalysisLoadingScreen } from "@/components/AnalysisUI/AnalysisLoadingScreen";
import { DetailedAnalysisView } from "@/components/AnalysisUI/DetailedAnalysisView";

const MOCK_USER = {
  id: "test-user",
  name: "Usuário Teste",
  email: "test@test.com",
  isAdmin: false,
  apiAccessEnabled: false, // false = usa mock, não chama backend
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
};

const TestPage = () => {
  const { isDark, toggle } = useTheme();
  const analysis = useDetailedAnalysis();

  const onSubmitIdea = async (idea: string) => {
    await analysis.submitIdea(idea, MOCK_USER.id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <header className="flex items-center justify-between p-4 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">IdeaCatalyst</h1>
          <p className="text-sm text-muted-foreground">
            Modo de demonstração
          </p>
        </div>
      </header>

      <ThemeToggle isDark={isDark} onToggle={toggle} />

      <main className="p-4">
        {analysis.phase === "intro" && <IntroScreen onStart={analysis.start} />}
        {analysis.phase === "firstIdea" && <IdeaInputScreen onSubmit={onSubmitIdea} />}
        {analysis.phase === "loading" && <AnalysisLoadingScreen />}
        {analysis.phase === "result" && analysis.result && (
          <DetailedAnalysisView
            result={analysis.result}
            onReset={analysis.reset}
          />
        )}
      </main>
    </div>
  );
};

export default TestPage;