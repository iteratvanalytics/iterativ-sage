import { useEffect, useState } from "react";
import { Sparkles, Globe, Mail, Calendar, Cpu, Zap, Brain, Shield, Wifi } from "lucide-react";
import { SageLogo } from "@/components/SageLogo";

export function EmptyState({ onChip }: { onChip: (s: string) => void }) {
  const suggestions = [
    { label: "Brief me on my day",  icon: Sparkles, color: "text-amber-400",   prompt: "Brief me on my day" },
    { label: "Research competitors", icon: Globe,    color: "text-emerald-400", prompt: "Research my top 3 competitors and draft a brief" },
    { label: "Draft an email",       icon: Mail,     color: "text-rose-400",    prompt: "Summarize my unread email and draft replies" },
    { label: "Schedule a meeting",   icon: Calendar, color: "text-cyan-400",    prompt: "Find the best slot for a meeting this week" },
  ];
  return (
    <div className="text-center pt-12">
      <div className="relative w-20 h-20 mx-auto mb-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-primary shadow-[var(--shadow-glow)]" style={{ background: 'var(--gradient-orb)' }}>
          <SageLogo size={44} className="text-primary" />
        </div>
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
      </div>
      <h2 className="text-2xl font-semibold">How can I help?</h2>
      <p className="text-sm text-muted-foreground mt-2 px-8">Ask, delegate, or kick off a workflow. Sub-agents work in the background while you keep moving.</p>
      <div className="grid grid-cols-2 gap-2 mt-8 px-2">
        {suggestions.map(s => (
          <button
            key={s.label}
            onClick={() => onChip(s.prompt)}
            className="glass rounded-2xl p-3.5 text-left active:scale-95 transition-transform"
          >
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} aria-hidden="true" />
            <p className="text-[12px] text-foreground/80 leading-snug">{s.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThinkingOrchestrator() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Cpu,    text: "Analysing intent and routing…",    color: "text-primary"     },
    { icon: Zap,    text: "Delegating to sub-agents…",        color: "text-amber-400"   },
    { icon: Brain,  text: "Retrieving relevant memory…",      color: "text-violet-400"  },
    { icon: Shield, text: "Privacy routing check…",           color: "text-emerald-400" },
    { icon: Wifi,   text: "Synthesising multi-model output…", color: "text-cyan-400"    },
  ];
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const S = steps[step];
  const Icon = S.icon;
  return (
    <div className="flex items-center gap-3 max-w-[90%] animate-in fade-in slide-in-from-bottom-2" role="status" aria-live="polite">
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-primary" style={{ background: 'var(--gradient-orb)' }}>
        <SageLogo size={16} className="text-primary" />
      </div>
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
        <Icon className={`w-4 h-4 ${S.color} animate-spin`} aria-hidden="true" />
        <span className="text-sm text-muted-foreground">{S.text}</span>
        <div className="flex gap-0.5 ml-1" aria-hidden="true">
          {[0,1,2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
