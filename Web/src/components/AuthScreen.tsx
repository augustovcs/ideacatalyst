import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export function AuthScreen() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setMessage({ type: "error", text: "Todos os campos são obrigatórios." });
          setIsLoading(false);
          return;
        }
        await register(name, email, password);
        setMessage({ type: "success", text: "Registro realizado! Faça login com suas credenciais." });
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        if (!email.trim() || !password.trim()) {
          setMessage({ type: "error", text: "Email e senha são obrigatórios." });
          setIsLoading(false);
          return;
        }
        await login(email, password);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">IdeaCatalyst</h1>
          <p className="text-sm text-muted-foreground text-center">
            {isRegister ? "Crie sua conta" : "Acesse sua conta"}
          </p>
        </div>

        {isRegister && (
          <>
            <label className="block mb-2 text-sm font-medium">Nome Completo</label>
            <Input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Seu nome"
              disabled={isLoading}
            />
          </>
        )}

        <label className="block mt-4 mb-2 text-sm font-medium">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="seu@email.com"
          disabled={isLoading}
        />

        <label className="block mt-4 mb-2 text-sm font-medium">Senha</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Sua senha"
          disabled={isLoading}
        />

        {message && (
          <p className={`mt-3 text-sm ${message.type === "error" ? "text-destructive" : "text-green-600"}`}>
            {message.text}
          </p>
        )}

        <Button className="mt-6 w-full" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processando..." : isRegister ? "Registrar" : "Entrar"}
        </Button>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          {isRegister ? "Já tem conta?" : "Não tem conta?"}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage(null);
              setName("");
              setEmail("");
              setPassword("");
            }}
            className="font-semibold text-primary hover:underline ml-1"
            disabled={isLoading}
          >
            {isRegister ? "Faça login" : "Registre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}
