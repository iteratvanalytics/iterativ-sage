import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/lib/auth";
import { SageLogo } from "@/components/SageLogo";
import { toast } from "sonner";
import { Loader as Loader2 } from "lucide-react";
import type React from "react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Demo mode (no Supabase project) has no auth — go straight in.
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      navigate({ to: "/", replace: true });
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-[480px] mx-auto bg-background flex flex-col justify-center px-6">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
      </div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-primary shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-orb)" }}>
          <SageLogo size={36} className="text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mt-5">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Your ambient AI agent, ready when you are.</p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-12 rounded-2xl glass border-0 px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-12 rounded-2xl glass border-0 px-4 text-[15px] outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-medium text-primary-foreground active:scale-[0.99] transition-transform disabled:opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(m => (m === "signin" ? "signup" : "signin"))}
        className="text-sm text-muted-foreground mt-6 text-center hover:text-foreground transition-colors"
      >
        {mode === "signin" ? "No account? Sign up" : "Have an account? Sign in"}
      </button>
    </div>
  );
}
