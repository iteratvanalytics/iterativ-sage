import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/` } });
    setLoading(false);
    if (res.error) return toast.error(res.error.message);
    if (mode === "signup") toast.success("Welcome to Aria");
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen flex flex-col px-6 pt-20 pb-10 overflow-hidden max-w-[480px] mx-auto">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-40 siri-orb" />
      <div className="relative flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-3xl glass-strong flex items-center justify-center mb-6 shadow-[var(--shadow-elevated)]">
          <Sparkles className="w-9 h-9 text-primary" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-center">
          Meet <span className="text-gradient">Aria</span>
        </h1>
        <p className="text-muted-foreground text-center mt-3 max-w-xs">
          An ambient AI agent that remembers, researches, and works in the background.
        </p>
        <form onSubmit={submit} className="w-full max-w-sm mt-10 space-y-3">
          <Input type="email" required placeholder="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-2xl glass border-0 px-4" />
          <Input type="password" required minLength={6} placeholder="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-2xl glass border-0 px-4" />
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl text-base font-medium" style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}>
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button onClick={() => setMode(m => m === "signin" ? "signup" : "signin")} className="mt-6 text-sm text-muted-foreground">
          {mode === "signin" ? "New here? Create an account" : "Already have one? Sign in"}
        </button>
      </div>
    </div>
  );
}