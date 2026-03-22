import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="fixed top-5 right-5 z-50 rounded-full backdrop-blur-sm bg-card/60 border border-border shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-primary transition-transform duration-300" />
      )}
    </Button>
  );
}
