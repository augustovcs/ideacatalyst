import { useTheme } from "@/hooks/useTheme";
import { useDetailedAnalysis } from "@/hooks/useDetailedAnalysis";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IntroScreen } from "@/components/IntroScreen";
import { IdeaInputScreen } from "@/components/AnalysisUI/IdeaInputScreen";
import { AnalysisLoadingScreen } from "@/components/AnalysisUI/AnalysisLoadingScreen";
import { DetailedAnalysisView } from "@/components/AnalysisUI/DetailedAnalysisView";

const Index = () => {
  const { isDark, toggle } = useTheme();
  const analysis = useDetailedAnalysis();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <ThemeToggle isDark={isDark} onToggle={toggle} />

      {analysis.phase === "intro" && <IntroScreen onStart={analysis.start} />}
      {analysis.phase === "firstIdea" && <IdeaInputScreen onSubmit={analysis.submitIdea} />}
      {analysis.phase === "loading" && <AnalysisLoadingScreen />}
      {analysis.phase === "result" && analysis.result && (
        <DetailedAnalysisView result={analysis.result} onReset={analysis.reset} />
      )}
    </div>
  );
};

export default Index;
