export function AnalysisLoadingScreen() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 animate-pulse">
            <span className="text-4xl animate-bounce">📊</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3">Analisando sua ideia...</h2>
        <p className="text-muted-foreground mb-8">
          Isso pode levar alguns segundos. Estamos processando mercado, estratégia e viabilidade.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>

        <div className="mt-12 space-y-4 text-left">
          <div className="p-4 rounded-lg bg-muted/50 border border-border animate-pulse">
            <p className="h-4 bg-muted rounded w-3/4 mb-2" />
            <p className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border animate-pulse">
            <p className="h-4 bg-muted rounded w-3/4 mb-2" />
            <p className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border animate-pulse">
            <p className="h-4 bg-muted rounded w-3/4 mb-2" />
            <p className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
