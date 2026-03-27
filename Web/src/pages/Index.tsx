import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useDetailedAnalysis } from "@/hooks/useDetailedAnalysis";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IntroScreen } from "@/components/IntroScreen";
import { IdeaInputScreen } from "@/components/AnalysisUI/IdeaInputScreen";
import { AnalysisLoadingScreen } from "@/components/AnalysisUI/AnalysisLoadingScreen";
import { DetailedAnalysisView } from "@/components/AnalysisUI/DetailedAnalysisView";
import { AuthScreen } from "@/components/AuthScreen";
import { Button } from "@/components/ui/button";

type Tab = "generate" | "history";

interface HistoryItem {
  id: string;
  ideaDescription: string;
  analysisResult: string;
  sessionId: string;
  wasMock: boolean;
  createdAt: string;
}

const Index = () => {
  const { isDark, toggle } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const analysis = useDetailedAnalysis();

  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user?.id]);

  const loadHistory = async () => {
    if (!user?.id) return;
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`http://localhost:5068/api/history/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveToHistory = async (ideaDescription: string, analysisResult: string, sessionId: string, wasMock: boolean) => {
    if (!user?.id) return;
    try {
      await fetch(`http://localhost:5068/api/history?userId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaDescription,
          analysisResult: JSON.stringify(analysisResult),
          sessionId,
          wasMock,
        }),
      });
      await loadHistory();
    } catch (error) {
      console.error("Erro ao salvar análise:", error);
    }
  };

  const onSubmitIdea = async (idea: string) => {
    await analysis.submitIdea(idea, user?.id || "", saveToHistory);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    try {
      const result = JSON.parse(item.analysisResult);
      analysis.setManualResult(result);
      setSelectedHistoryItem(item);
      setActiveTab("generate");
    } catch {
      console.error("Erro ao carregar análise do histórico");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">IdeaCatalyst</h1>
          <p className="text-sm text-muted-foreground">
            {user.name} {user.apiAccessEnabled && <span className="text-green-600">(API Ativa)</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "generate" ? "secondary" : "ghost"}
            onClick={() => { setActiveTab("generate"); setSelectedHistoryItem(null); analysis.reset(); }}
          >
            Gerar Ideia
          </Button>
          <Button variant={activeTab === "history" ? "secondary" : "ghost"} onClick={() => setActiveTab("history")}>
            Histórico
          </Button>
          <Button variant="ghost" onClick={() => { logout(); analysis.reset(); }}>
            Encerrar Sessão
          </Button>
        </div>
      </header>

      <ThemeToggle isDark={isDark} onToggle={toggle} />

      <main className="p-4">
        {activeTab === "history" ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold">Histórico de Ideias</h2>
            {isLoadingHistory ? (
              <p className="text-muted-foreground">Carregando histórico...</p>
            ) : history.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma ideia registrada ainda. Gere sua primeira análise!</p>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="rounded-lg border border-border bg-card p-3 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.ideaDescription.slice(0, 80)}...</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                          {item.wasMock && <span className="ml-2 text-yellow-600">(Mock)</span>}
                        </p>
                      </div>
                      <span className="text-primary text-sm">→</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            {analysis.phase === "intro" && <IntroScreen onStart={analysis.start} />}
            {analysis.phase === "firstIdea" && <IdeaInputScreen onSubmit={onSubmitIdea} />}
            {analysis.phase === "loading" && <AnalysisLoadingScreen />}
            {analysis.phase === "result" && analysis.result && (
              <DetailedAnalysisView result={analysis.result} onReset={() => { analysis.reset(); setSelectedHistoryItem(null); }} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
