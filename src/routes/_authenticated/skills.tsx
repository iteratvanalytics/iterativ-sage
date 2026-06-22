import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Zap, Globe, Shield, Bot, ChevronRight, CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle } from "lucide-react";
import { SkillsSkeleton } from "@/components/SkeletonScreen";
import { useDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/_authenticated/skills")({
  component: SkillsPage,
});

const SKILLS = [
  { id: "meeting", name: "Meeting Capture", desc: "Auto-transcribe meetings & extract action items", icon: Zap, status: "installed" as const, color: "bg-emerald-500/20 text-emerald-400" },
  { id: "research", name: "Deep Research", desc: "Multi-source research with citations", icon: Globe, status: "connected" as const, color: "bg-primary/20 text-primary" },
  { id: "email", name: "Email Triage", desc: "Auto-classify, draft replies, schedule sends", icon: Sparkles, status: "installed" as const, color: "bg-rose-500/20 text-rose-400" },
  { id: "agent", name: "Agent Orchestrator", desc: "Spawn & monitor background sub-agents", icon: Bot, status: "pending" as const, color: "bg-amber-500/20 text-amber-400" },
  { id: "privacy", name: "Privacy Audit", desc: "Scan & prune data access, audit logs", icon: Shield, status: "installed" as const, color: "bg-cyan-500/20 text-cyan-400" },
  { id: "custom", name: "Custom Skill", desc: "Build your own with natural language", icon: Sparkles, status: "available" as const, color: "bg-muted text-muted-foreground" },
];

function SkillsPage() {
  const { isDemoMode, activePersona } = useDemoMode();
  const personaSkills = activePersona?.skills ?? [];
  const [skills, setSkills] = useState(SKILLS);
  const [isLoading] = useState(false); // Replace with real query later

  const displaySkills = isDemoMode ? personaSkills : skills;

  const toggle = (id: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (s.status === "available") return { ...s, status: "installed" as const };
      if (s.status === "installed") return { ...s, status: "available" as const };
      return s;
    }));
    toast.success("Skill updated");
  };

  if (isLoading) return <SkillsSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">4 active</p>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Skills Hub</h1>
      <p className="text-sm text-muted-foreground mt-2">Reusable workflows that program Sage's behavior across your software stack.</p>

      <div className="grid grid-cols-2 gap-2 mt-6">
        {displaySkills.map(s => {
          const Icon = s.icon;
          const installed = s.status === "installed" || s.status === "connected";
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="glass rounded-2xl p-4 text-left active:scale-[0.98] transition-transform duration-150 hover:bg-white/[3%]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                {installed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {s.status === "pending" && <Clock className="w-4 h-4 text-amber-400" />}
                {s.status === "available" && <AlertTriangle className="w-4 h-4 text-muted-foreground/40" />}
              </div>
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              <div className="flex items-center gap-1 mt-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${installed ? "bg-emerald-400/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {s.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
