import { useTheme } from "@/hooks/useTheme";
import { useIdeaAnalysis, FirstIdea } from "@/hooks/useIdeaAnalysis";
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

    {analysis.phase === "firstIdea" && (
      <QuestionFlow
        questionIndex={0}
        totalQuestions={1}
        questionText={FirstIdea}
        onSubmit={analysis.submitAnswer}
        showProgress={false}
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
