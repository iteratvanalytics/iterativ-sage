import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Brain,
  Cpu,
  Globe,
  Mail,
  Calendar,
  MessageSquare,
  Shield,
  Zap,
  Bot,
  Volume2,
  Smartphone,
  Lock,
  Eye,
  ArrowRight,
  Mic,
} from "lucide-react";
import { toast } from "sonner";
import { SageLogo } from "@/components/SageLogo";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoProfileSwitcher } from "@/components/DemoProfileSwitcher";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const MODELS = [
  {
    id: "auto",
    label: "Auto-route",
    sub: "Sage picks the best model — recommended",
    icon: Sparkles,
    primary: true,
  },
  {
    id: "claude",
    label: "Claude Sonnet 4",
    sub: "Best for writing, email, reasoning",
    icon: Brain,
    primary: false,
  },
  {
    id: "gemini",
    label: "Gemini 2.5 Pro",
    sub: "Best for code, long docs, vision",
    icon: Cpu,
    primary: false,
  },
  { id: "o3", label: "o3", sub: "Best for logic, math, analysis", icon: Zap, primary: false },
  {
    id: "pplx",
    label: "Perplexity Sonar",
    sub: "Best for live web research",
    icon: Globe,
    primary: false,
  },
];

const INTEGRATIONS = [
  {
    id: "gmail",
    label: "Gmail",
    icon: Mail,
    desc: "Read, draft, triage",
    color: "text-rose-400 bg-rose-400/15",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    desc: "Events, scheduling",
    color: "text-cyan-400 bg-cyan-400/15",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageSquare,
    desc: "Send messages",
    color: "text-emerald-400 bg-emerald-400/15",
  },
  {
    id: "notion",
    label: "Notion",
    icon: Brain,
    desc: "Read notes, pages",
    color: "text-amber-400 bg-amber-400/15",
  },
  {
    id: "slack",
    label: "Slack",
    icon: Zap,
    desc: "Post, read channels",
    color: "text-indigo-400 bg-indigo-400/15",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Globe,
    desc: "PRs, issues, CI",
    color: "text-fuchsia-400 bg-fuchsia-400/15",
  },
];

const SEED_MEMORIES = [
  { label: "Email style", placeholder: "e.g. Concise, warm, no exclamation marks" },
  { label: "Focus hours", placeholder: "e.g. 9am–11am — protect these daily" },
  { label: "Role context", placeholder: "e.g. Founder at a B2B SaaS startup" },
];

const STEPS = ["Welcome", "Model", "Integrations", "Memory", "Privacy", "Done"] as const;
type Step = (typeof STEPS)[number];

const PRIVACY_OPTIONS = [
  {
    id: "ondevice",
    label: "On-device first",
    sub: "Keep everything local. Only send data to cloud when you explicitly approve each time.",
    icon: Smartphone,
    recommended: true,
  },
  {
    id: "balanced",
    label: "Balanced",
    sub: "Sensitive data on-device. Research and web queries cloud-routed with your consent.",
    icon: Shield,
    recommended: false,
  },
  {
    id: "cloud",
    label: "Cloud-assisted",
    sub: "Most tasks cloud-routed for speed. You'll see what was sent in the consent audit log.",
    icon: Globe,
    recommended: false,
  },
];

function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-4 h-1.5 bg-primary"
              : i < current
                ? "w-1.5 h-1.5 bg-primary/40"
                : "w-1.5 h-1.5 bg-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [selectedIntegrations, setSelectedIntegrations] = useState<Set<string>>(
    new Set(["gmail", "calendar"]),
  );
  const [memories, setMemories] = useState(["", "", ""]);
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);
  const { setPersona } = useDemoMode();
  const [privacyMode, setPrivacyMode] = useState("ondevice");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const step = STEPS[stepIdx];

  const goTo = (idx: number, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStepIdx(idx);
      setAnimating(false);
    }, 180);
  };

  const next = () => {
    if (stepIdx < STEPS.length - 1) goTo(stepIdx + 1, "forward");
  };
  const prev = () => {
    if (stepIdx > 0) goTo(stepIdx - 1, "back");
  };

  const finish = () => {
    localStorage.setItem("sage_onboarded", "1");
    localStorage.setItem(
      "sage_prefs",
      JSON.stringify({
        model: selectedModel,
        integrations: [...selectedIntegrations],
        privacyMode,
        voiceEnabled,
        memories: memories.filter(Boolean),
      }),
    );
    toast.success("Sage is ready — welcome.");
    navigate({ to: "/" });
  };

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-6 py-12 max-w-[480px] mx-auto">
      {/* Top: dots + back */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={prev}
          className={`w-9 h-9 rounded-full glass flex items-center justify-center transition-all ${stepIdx === 0 ? "opacity-0 pointer-events-none" : "active:scale-90"}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <ProgressDots current={stepIdx} />
        <button
          onClick={step === "Done" ? finish : next}
          className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          {step === "Done" ? "" : "Skip"}
        </button>
      </div>

      {/* Step content */}
      <div
        className={`flex-1 w-full flex flex-col transition-all duration-180 ${
          animating
            ? direction === "forward"
              ? "opacity-0 translate-x-4"
              : "opacity-0 -translate-x-4"
            : "opacity-100 translate-x-0"
        }`}
        style={{ transitionDuration: "180ms" }}
      >
        {/* ── WELCOME ─────────────────────────────────────────────── */}
        {step === "Welcome" && (
          <div className="flex flex-col items-center text-center gap-6 pt-8">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-primary shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-orb)" }}
              >
                <SageLogo size={56} className="text-primary" />
              </div>
              <div
                className="absolute inset-0 rounded-3xl"
                style={{ background: "var(--gradient-orb)" }}
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Meet Sage</h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Your AI assistant that attends meetings, drafts emails, orchestrates agents, and
                remembers everything — with your control over every action.
              </p>
            </div>
            <div className="w-full space-y-2.5">
              {[
                { icon: Brain, label: "Remembers your context across every session" },
                { icon: Bot, label: "Runs background agents — even while offline" },
                { icon: Shield, label: "Privacy-first: on-device by default" },
                { icon: Mic, label: "Voice input + TTS readback built in" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-[13px] text-left">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODEL ───────────────────────────────────────────────── */}
        {step === "Model" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Choose your default model</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sage automatically picks the best model for each task, but you can set a preference.
              </p>
            </div>
            <div className="space-y-2">
              {MODELS.map((m) => {
                const Icon = m.icon;
                const selected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.99] ${
                      selected ? "ring-1 ring-primary/50" : "glass"
                    }`}
                    style={
                      selected
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.62 0.10 150 / 0.12), oklch(0.72 0.12 165 / 0.06))",
                          }
                        : {}
                    }
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-primary/20" : "glass"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${selected ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${selected ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {m.label}
                        </span>
                        {m.primary && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground/70">{m.sub}</span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── INTEGRATIONS ────────────────────────────────────────── */}
        {step === "Integrations" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Connect your tools</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sage needs your permission before accessing anything. You can change this any time
                in Skills.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INTEGRATIONS.map((s) => {
                const Icon = s.icon;
                const on = selectedIntegrations.has(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleIntegration(s.id)}
                    className={`flex flex-col items-start gap-2.5 p-4 rounded-2xl text-left transition-all active:scale-[0.99] ${on ? "ring-1 ring-primary/40" : "glass"}`}
                    style={
                      on
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.62 0.10 150 / 0.10), oklch(0.72 0.12 165 / 0.05))",
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${on ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                      >
                        {on && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              {selectedIntegrations.size} selected · Nothing connects until you confirm each
              permission in the app
            </p>
          </div>
        )}

        {/* ── MEMORY ──────────────────────────────────────────────── */}
        {step === "Memory" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Seed your memory</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Tell Sage the essentials — it'll use this to match your tone and context from the
                first message.
              </p>
            </div>
            <div className="space-y-3">
              {SEED_MEMORIES.map((m, i) => (
                <div key={m.label} className="glass rounded-2xl p-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                    {m.label}
                  </p>
                  <input
                    type="text"
                    value={memories[i]}
                    onChange={(e) =>
                      setMemories((prev) => {
                        const next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    placeholder={m.placeholder}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/40"
                  />
                </div>
              ))}
            </div>

            {/* Voice toggle */}
            <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-400/15 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Voice I/O</p>
                <p className="text-[11px] text-muted-foreground">
                  Speak to Sage · hear responses read aloud
                </p>
              </div>
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                className={`w-11 h-6 rounded-full transition-all ${voiceEnabled ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all m-0.5 ${voiceEnabled ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              You can add or edit memories any time in the Memory tab
            </p>
          </div>
        )}

        {/* ── PRIVACY ─────────────────────────────────────────────── */}
        {step === "Privacy" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Choose your privacy mode</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Controls where your data is processed by default. You'll always see what goes where
                before it happens.
              </p>
            </div>
            <div className="space-y-2">
              {PRIVACY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const selected = privacyMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPrivacyMode(opt.id)}
                    className={`w-full flex items-start gap-3 px-4 py-4 rounded-2xl text-left transition-all active:scale-[0.99] ${selected ? "ring-1 ring-primary/50" : "glass"}`}
                    style={
                      selected
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.62 0.10 150 / 0.12), oklch(0.72 0.12 165 / 0.06))",
                          }
                        : {}
                    }
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-primary/20" : "glass"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${selected ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-semibold ${selected ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {opt.label}
                        </span>
                        {opt.recommended && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 font-semibold">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-relaxed">
                        {opt.sub}
                      </span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-primary shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-[11px] text-emerald-400/90">
              <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                You'll always see a privacy badge on every action showing whether it's on-device or
                cloud. You can change this mode any time in Settings.
              </span>
            </div>
          </div>
        )}

        {/* ── DONE ────────────────────────────────────────────────── */}
        {step === "Done" && (
          <div className="flex flex-col items-center text-center gap-6 pt-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-primary shadow-[var(--shadow-glow)]"
                style={{ background: "var(--gradient-orb)" }}
              >
                <SageLogo size={44} className="text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold">All set.</h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Sage is configured and ready. Your preferences are stored locally — nothing was
                sent.
              </p>
            </div>
            <div className="w-full glass rounded-2xl divide-y divide-white/5">
              {[
                {
                  label: "Default model",
                  value: MODELS.find((m) => m.id === selectedModel)?.label ?? "Auto-route",
                },
                {
                  label: "Integrations",
                  value:
                    selectedIntegrations.size > 0
                      ? `${selectedIntegrations.size} selected`
                      : "None — add later",
                },
                {
                  label: "Memory seeds",
                  value:
                    memories.filter(Boolean).length > 0
                      ? `${memories.filter(Boolean).length} saved`
                      : "Skipped",
                },
                {
                  label: "Privacy mode",
                  value:
                    PRIVACY_OPTIONS.find((p) => p.id === privacyMode)?.label ?? "On-device first",
                },
                { label: "Voice I/O", value: voiceEnabled ? "Enabled" : "Disabled" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[12px] text-muted-foreground">{label}</span>
                  <span className="text-[12px] font-medium text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="w-full mt-8 space-y-2">
        <button
          onClick={step === "Done" ? finish : next}
          className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}
        >
          {step === "Welcome" && (
            <>
              Get started <ArrowRight className="w-4 h-4" />
            </>
          )}
          {step === "Model" && (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
          {step === "Integrations" && (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
          {step === "Memory" && (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
          {step === "Privacy" && (
            <>
              Continue <ChevronRight className="w-4 h-4" />
            </>
          )}
          {step === "Done" && (
            <>
              Start using Sage <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
        {step === "Welcome" && (
          <button
            onClick={finish}
            className="w-full py-3 rounded-2xl text-sm text-muted-foreground glass"
          >
            Skip setup — go straight in
          </button>
        )}
        {step === "Done" && (
          <button
            onClick={() => setShowDemoSwitcher(true)}
            className="w-full py-3 rounded-2xl text-sm text-muted-foreground glass hover:text-foreground hover:bg-white/[3%] transition-colors"
          >
            Try a demo persona
          </button>
        )}
      </div>
      {showDemoSwitcher && <DemoProfileSwitcher onClose={() => setShowDemoSwitcher(false)} />}
    </div>
  );
}
