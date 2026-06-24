import { useEffect, useState } from "react";
import {
  Sparkles,
  Globe,
  Mail,
  Calendar,
  Cpu,
  Zap,
  Brain,
  Shield,
  Wifi,
  Mic,
  ArrowRight,
  Compass,
  Image,
  Pen,
} from "lucide-react";
import { SageLogo } from "@/components/SageLogo";

export function EmptyState({ onChip }: { onChip: (s: string) => void }) {
  const suggestions = [
    {
      label: "Daily Brief",
      icon: Compass,
      color: "#f59e0b",
      prompt: "Brief me on my day",
      desc: "Summarize your agenda",
    },
    {
      label: "Create Image",
      icon: Image,
      color: "#d946ef",
      prompt: "Generate a stunning image",
      desc: "AI image generation",
    },
    {
      label: "Draft Email",
      icon: Mail,
      color: "#ec4899",
      prompt: "Draft a professional email",
      desc: "Write with AI",
    },
    {
      label: "Write Story",
      icon: Pen,
      color: "#8b5cf6",
      prompt: "Help me write a story",
      desc: "Creative writing",
    },
  ];
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-4">
      {/* Voice Orb */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "var(--gradient-voice)",
            boxShadow: "0 0 60px rgba(217, 70, 239, 0.3)",
          }}
        >
          <SageLogo size={40} className="text-white" />
        </div>
        <div
          className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping"
          style={{ animationDuration: "2.5s" }}
        />
        <div
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "var(--gradient-sunset)", border: "2px solid #1a0a2e" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-1">How can I help?</h2>
      <p className="text-sm text-white/50 mb-6 px-4 leading-relaxed">
        Ask a question, create content, or delegate tasks. I can write, research, design, and more.
      </p>

      {/* Suggestion Cards — clearer with descriptions */}
      <div className="grid grid-cols-2 gap-2 w-full px-1">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onChip(s.prompt)}
            className="rounded-2xl p-3.5 text-left active:scale-95 transition-all duration-200 hover:bg-white/[8%]"
            style={{
              background: "rgba(45, 27, 78, 0.5)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
              style={{ background: `${s.color}20` }}
            >
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-[12px] font-medium text-white/90 mb-0.5">{s.label}</p>
            <p className="text-[10px] text-white/40">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Quick action row */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => onChip("Use voice input")}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium text-white/60"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Mic className="w-3.5 h-3.5" />
          Tap to speak
        </button>
        <span className="text-[11px] text-white/25">or type below</span>
      </div>
    </div>
  );
}

export function ThinkingOrchestrator() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Cpu, text: "Analysing your request...", color: "#d946ef" },
    { icon: Zap, text: "Routing to best AI model...", color: "#f59e0b" },
    { icon: Brain, text: "Retrieving your context...", color: "#8b5cf6" },
    { icon: Shield, text: "Checking privacy settings...", color: "#10b981" },
    { icon: Wifi, text: "Synthesising response...", color: "#06b6d4" },
  ];
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const S = steps[step];
  const Icon = S.icon;

  return (
    <div
      className="flex items-center gap-3 max-w-[90%] animate-in fade-in slide-in-from-bottom-2"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <SageLogo size={14} className="text-white" />
      </div>
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{
          background: "rgba(45, 27, 78, 0.6)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Icon
          className="w-4 h-4 animate-spin"
          style={{ color: S.color, animationDuration: "2s" }}
          aria-hidden="true"
        />
        <span className="text-sm text-white/60">{S.text}</span>
        <div className="flex gap-0.5 ml-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                background: S.color,
                opacity: 0.5,
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
