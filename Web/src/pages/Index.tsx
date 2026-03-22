import { useTheme } from "@/hooks/useTheme";
import { useIdeaAnalysis } from "@/hooks/useIdeaAnalysis";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IntroScreen } from "@/components/IntroScreen";
import { QuestionFlow } from "@/components/QuestionFlow";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisResult } from "@/components/AnalysisResult";

const Index = () => {
  const { isDark, toggle } = useTheme();
  const analysis = useIdeaAnalysis();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <ThemeToggle isDark={isDark} onToggle={toggle} />

      {analysis.phase === "intro" && <IntroScreen onStart={analysis.start} />}

      {analysis.phase === "questions" && (
        <QuestionFlow
          questionIndex={analysis.currentQuestion}
          totalQuestions={analysis.totalQuestions}
          questionText={analysis.questionText}
          onSubmit={analysis.submitAnswer}
        />
      )}

      {analysis.phase === "loading" && <LoadingAnalysis />}

      {analysis.phase === "result" && analysis.result && (
        <AnalysisResult result={analysis.result} onReset={analysis.reset} />
      )}
    </div>
  );
};

export default Index;
