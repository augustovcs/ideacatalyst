import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { returnAPImsg } from "@/services/api";
import { useState } from "react"

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {

  const [message, setMessage] = useState<string>("")

  const handleAPI = async () => {
    const data = await returnAPImsg()
    console.log("RETURNED: ", data)
    setMessage(data[0].answer)
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-8">
          <Lightbulb className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-5 animate-fade-up"
        style={{ animationDelay: "80ms", lineHeight: "1.08" }}
      >
        Analise sua
        <br />
        <span className="text-primary">próxima ideia</span>
      </h1>

      <p
        className="text-muted-foreground text-lg sm:text-xl max-w-md mb-10 animate-fade-up"
        style={{ animationDelay: "160ms" }}
      >
        Responda 6 perguntas rápidas e descubra o potencial da sua ideia com uma análise detalhada.
      </p>

      <div className="animate-fade-up" style={{ animationDelay: "260ms" }}>
        <Button
          size="lg"
          onClick={() => {
            handleAPI()
          }}
          className="h-14 px-8 text-base font-semibold rounded-xl glow-primary transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] gap-2"
        >
          Começar análise
          <ArrowRight className="w-5 h-5" />
        </Button>
        <p>{message}</p>

      </div>

      <div
        className="mt-16 flex items-center gap-6 text-sm text-muted-foreground animate-fade-up"
        style={{ animationDelay: "380ms" }}
      >
        <span className="flex items-center gap-1.5">⏱ ~3 minutos</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
        <span className="flex items-center gap-1.5">🔒 Privado</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
        <span className="flex items-center gap-1.5">✨ Grátis</span>
      </div>
    </div>
  );
}
