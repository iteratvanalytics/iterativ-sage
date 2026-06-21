import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles, Cpu, Wifi, Zap, ArrowRight } from "lucide-react";

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
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-40 siri-orb shadow-[var(--shadow-glow)]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[280px] h-[280px] rounded-full opacity-20 siri-orb-glow" />
      <div className="relative flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-3xl glass-strong flex items-center justify-center mb-6 shadow-[var(--shadow-elevated)] relative">
          <div className="absolute inset-0 rounded-3xl siri-orb opacity-30" />
          <Sparkles className="w-9 h-9 text-primary relative z-10" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-center">
          Meet <span className="text-gradient">Aria</span>
        </h1>
        <p className="text-muted-foreground text-center mt-3 max-w-xs text-sm leading-relaxed">
          Autonomous AI agent with multi-model orchestration, sub-agents, and persistent memory.
        </p>

        <div className="flex gap-3 mt-6 mb-8">
          {[
            { icon: Cpu, label: "Multi-model" },
            { icon: Wifi, label: "Raft Network" },
            { icon: Zap, label: "Background" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground glass rounded-full px-2.5 py-1">
              <f.icon className="w-3 h-3" />
              {f.label}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="w-full max-w-sm mt-2 space-y-3">
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl glass-strong border-0 px-4 text-[15px]" />
          <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-2xl glass-strong border-0 px-4 text-[15px]" />
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl text-base font-medium flex items-center justify-center gap-2 active:scale-[0.99] transition-transform" style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                {mode === "signin" ? "Sign in" : "Create account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
        <button onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))} className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
          {mode === "signin" ? "New here? Create an account" : "Already have one? Sign in"}
        </button>
      </div>
      <p className="text-center text-[10px] text-muted-foreground/50 mt-6">v0.17.0 — The Reach Release</p>
    </div>
  );
}
