import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Zap,
  Globe,
  Shield,
  Bot,
  ChevronRight,
  CircleCheck as CheckCircle2,
  Clock,
  TriangleAlert as AlertTriangle,
} from "lucide-react";
import { SkillsSkeleton } from "@/components/SkeletonScreen";
import { useDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/_authenticated/skills")({
  component: SkillsPage,
});

const SKILLS = [
  {
    id: "meeting",
    name: "Meeting Capture",
    desc: "Auto-transcribe meetings & extract action items",
    icon: Zap,
    status: "installed" as const,
    color: "#10b981",
  },
  {
    id: "research",
    name: "Deep Research",
    desc: "Multi-source research with citations",
    icon: Globe,
    status: "connected" as const,
    color: "#3b82f6",
  },
  {
    id: "email",
    name: "Email Triage",
    desc: "Auto-classify, draft replies, schedule sends",
    icon: Sparkles,
    status: "installed" as const,
    color: "#ec4899",
  },
  {
    id: "agent",
    name: "Agent Orchestrator",
    desc: "Spawn & monitor background sub-agents",
    icon: Bot,
    status: "pending" as const,
    color: "#f59e0b",
  },
  {
    id: "privacy",
    name: "Privacy Audit",
    desc: "Scan & prune data access, audit logs",
    icon: Shield,
    status: "installed" as const,
    color: "#06b6d4",
  },
  {
    id: "custom",
    name: "Custom Skill",
    desc: "Build your own with natural language",
    icon: Sparkles,
    status: "available" as const,
    color: "#8b5cf6",
  },
];

function SkillsPage() {
  const { isDemoMode, activePersona } = useDemoMode();
  const personaSkills = activePersona?.skills ?? [];
  const [skills, setSkills] = useState(SKILLS);
  const [isLoading] = useState(false); // Replace with real query later

  const displaySkills = isDemoMode ? personaSkills : skills;

  const toggle = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (s.status === "available") return { ...s, status: "installed" as const };
        if (s.status === "installed") return { ...s, status: "available" as const };
        return s;
      }),
    );
    toast.success("Skill updated");
  };

  if (isLoading) return <SkillsSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#3b82f6" }} />
        <p className="text-[10px] text-white/50 uppercase tracking-widest">4 active</p>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-1 text-white">Skills Hub</h1>
      <p className="text-sm text-white/50 mt-2">
        Reusable workflows that program Sage's behavior across your software stack.
      </p>

      <div className="grid grid-cols-2 gap-2 mt-6">
        {displaySkills.map((s) => {
          const Icon = "icon" in s && s.icon ? (s.icon as typeof Sparkles) : Sparkles;
          const installed = s.status === "installed" || s.status === "connected";
          const color = "color" in s ? s.color : "#3b82f6";
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="text-left active:scale-[0.98] transition-transform duration-150 rounded-2xl p-4"
              style={{
                background: "rgba(17, 22, 35, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                {installed && <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />}
                {s.status === "pending" && (
                  <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />
                )}
                {s.status === "available" && <AlertTriangle className="w-4 h-4 text-white/30" />}
              </div>
              <p className="text-sm font-medium text-white/90">{s.name}</p>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{s.desc}</p>
              <div className="flex items-center gap-1 mt-3">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: installed
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(255, 255, 255, 0.08)",
                    color: installed ? "#10b981" : "rgba(255, 255, 255, 0.4)",
                  }}
                >
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
