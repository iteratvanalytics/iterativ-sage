import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bot,
  Cpu,
  Zap,
  Play,
  Pause,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  MessageSquare,
  Pen,
  Calendar,
  Shield,
  Sparkles,
  Activity,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2,
  CircleUser as UserCircle,
  User,
  Briefcase,
  HardDrive,
  Star,
  Plus,
} from "lucide-react";
import { useDemoMode } from "@/lib/demo-mode";
import { AgentsSkeleton } from "@/components/SkeletonScreen";

export const Route = createFileRoute("/_authenticated/agents")({
  component: AgentsPage,
});

const DEMO_AGENTS = [
  {
    id: "a1",
    name: "Morning Brief",
    desc: "Auto-generates a daily briefing with tasks, email highlights, and meeting prep.",
    icon: Zap,
    status: "running" as const,
    progress: 78,
    subAgents: [
      { id: "a1.1", name: "Inbox Triage", status: "running" as const, progress: 60 },
      { id: "a1.2", name: "Calendar Sync", status: "done" as const, progress: 100 },
    ],
    outputs: "3 urgent emails, 2 meetings today",
    history: ["Started at 6:00 AM", "Triage complete", "Brief ready at 6:15 AM"],
    privacyMode: "private" as const,
    nextRun: "Tomorrow 6:00 AM",
  },
  {
    id: "a2",
    name: "Meeting Assistant",
    desc: "Auto-joins calendar calls, transcribes, and extracts action items.",
    icon: MessageSquare,
    status: "scheduled" as const,
    progress: 0,
    subAgents: [
      { id: "a2.1", name: "Transcription", status: "scheduled" as const, progress: 0 },
      { id: "a2.2", name: "Action Extraction", status: "scheduled" as const, progress: 0 },
    ],
    outputs: undefined,
    history: undefined,
    privacyMode: "multi" as const,
    nextRun: "10:00 AM",
  },
  {
    id: "a3",
    name: "Research Agent",
    desc: "Scans web, notes, and docs for relevant topics.",
    icon: Globe,
    status: "done" as const,
    progress: 100,
    subAgents: [
      { id: "a3.1", name: "Web Scan", status: "done" as const, progress: 100 },
      { id: "a3.2", name: "Note Analysis", status: "done" as const, progress: 100 },
    ],
    outputs: "12 sources, 3 relevant papers",
    history: ["Started at 9:00 AM", "Scan complete", "Analysis done"],
    privacyMode: "multi" as const,
    nextRun: "Next Monday 9:00 AM",
  },
  {
    id: "a4",
    name: "Email Composer",
    desc: "Drafts context-aware replies, matching your tone.",
    icon: Pen,
    status: "paused" as const,
    progress: 45,
    subAgents: [
      { id: "a4.1", name: "Tone Analysis", status: "done" as const, progress: 100 },
      { id: "a4.2", name: "Draft Builder", status: "paused" as const, progress: 45 },
    ],
    outputs: "Draft ready for review",
    history: ["Started at 8:00 AM", "Analysis complete", "Drafting paused"],
    privacyMode: "private" as const,
    nextRun: "Manual resume",
  },
  {
    id: "a5",
    name: "Calendar Sync",
    desc: "Syncs and auto-schedules across tools.",
    icon: Calendar,
    status: "scheduled" as const,
    progress: 0,
    subAgents: [],
    outputs: undefined,
    history: undefined,
    privacyMode: "private" as const,
    nextRun: "In 2 hours",
  },
  {
    id: "a6",
    name: "Privacy Monitor",
    desc: "Tracks on-device vs cloud data flow.",
    icon: Shield,
    status: "running" as const,
    progress: 92,
    subAgents: [{ id: "a6.1", name: "Audit Log", status: "running" as const, progress: 92 }],
    outputs: "1 request in audit queue",
    history: ["Started at launch", "Audit log created"],
    privacyMode: "private" as const,
    nextRun: "Continuous",
  },
  {
    id: "a7",
    name: "Skill Orchestrator",
    desc: "Routes tasks to the right skill.",
    icon: Sparkles,
    status: "scheduled" as const,
    progress: 0,
    subAgents: [],
    outputs: undefined,
    history: undefined,
    privacyMode: "multi" as const,
    nextRun: "On demand",
  },
  {
    id: "a8",
    name: "Slack Agent",
    desc: "Auto-responds to DMs, triages channels.",
    icon: Activity,
    status: "done" as const,
    progress: 100,
    subAgents: [{ id: "a8.1", name: "DM Auto-responder", status: "done" as const, progress: 100 }],
    outputs: "2 DMs responded",
    history: ["Started at 9:00 AM", "Completed"],
    privacyMode: "multi" as const,
    nextRun: "Next message",
  },
  {
    id: "a9",
    name: "User Profiler",
    desc: "Updates your memory/profile continuously.",
    icon: UserCircle,
    status: "running" as const,
    progress: 65,
    subAgents: [
      { id: "a9.1", name: "Preference Tracker", status: "running" as const, progress: 65 },
    ],
    outputs: "2 new preferences detected",
    history: ["Started at launch", "Profile updated"],
    privacyMode: "private" as const,
    nextRun: "Continuous",
  },
  {
    id: "a10",
    name: "Data Sync",
    desc: "Syncs local cache with cloud data.",
    icon: HardDrive,
    status: "paused" as const,
    progress: 30,
    subAgents: [{ id: "a10.1", name: "Cache Sync", status: "paused" as const, progress: 30 }],
    outputs: "Sync paused",
    history: ["Started at 10:00 AM", "Paused"],
    privacyMode: "private" as const,
    nextRun: "Manual resume",
  },
  {
    id: "a11",
    name: "UX Review",
    desc: "Analyzes your design uploads for feedback.",
    icon: Star,
    status: "scheduled" as const,
    progress: 0,
    subAgents: [],
    outputs: undefined,
    history: undefined,
    privacyMode: "multi" as const,
    nextRun: "Next upload",
  },
  {
    id: "a12",
    name: "Personal Brand",
    desc: "Builds your online profile.",
    icon: User,
    status: "done" as const,
    progress: 100,
    subAgents: [{ id: "a12.1", name: "Bio Builder", status: "done" as const, progress: 100 }],
    outputs: "Bio updated",
    history: ["Started at 9:00 AM", "Completed"],
    privacyMode: "multi" as const,
    nextRun: "Next week",
  },
  {
    id: "a13",
    name: "Work Navigator",
    desc: "Analyzes your career and suggests next steps.",
    icon: Briefcase,
    status: "running" as const,
    progress: 55,
    subAgents: [
      { id: "a13.1", name: "Skill Gap Analyzer", status: "running" as const, progress: 55 },
    ],
    outputs: "Analysis in progress",
    history: ["Started at 9:00 AM", "Analyzing"],
    privacyMode: "private" as const,
    nextRun: "Next month",
  },
  {
    id: "a14",
    name: "Technical Scribe",
    desc: "Writes technical docs for you.",
    icon: Pen,
    status: "scheduled" as const,
    progress: 0,
    subAgents: [],
    outputs: undefined,
    history: undefined,
    privacyMode: "multi" as const,
    nextRun: "On demand",
  },
  {
    id: "a15",
    name: "System Monitor",
    desc: "Keeps an eye on Sage health.",
    icon: Cpu,
    status: "running" as const,
    progress: 88,
    subAgents: [{ id: "a15.1", name: "Health Check", status: "running" as const, progress: 88 }],
    outputs: "All systems green",
    history: ["Started at launch", "Monitoring"],
    privacyMode: "private" as const,
    nextRun: "Continuous",
  },
];

const STATUS_CONFIG = {
  running: { label: "Running", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
  scheduled: { label: "Scheduled", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  done: { label: "Done", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  paused: { label: "Paused", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" },
  error: { label: "Error", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" },
};

function AgentsPage() {
  const { isDemoMode, activePersona } = useDemoMode();
  const personaAgents = activePersona?.agents ?? [];
  const [filter, setFilter] = useState<"all" | "running" | "scheduled" | "done" | "paused">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const displayAgents = isDemoMode ? personaAgents : DEMO_AGENTS;

  const filtered =
    filter === "all" ? displayAgents : displayAgents.filter((a) => a.status === filter);

  const counts: Record<string, number> = {
    all: displayAgents.length,
    running: displayAgents.filter((a) => a.status === "running").length,
    scheduled: displayAgents.filter((a) => a.status === "scheduled").length,
    done: displayAgents.filter((a) => a.status === "done").length,
    paused: displayAgents.filter((a) => a.status === "paused").length,
  };

  const toggle = (id: string) => {
    const a = displayAgents.find((x) => x.id === id);
    if (!a) return;
    const running = a.status === "running";
    toast.success(`${a.name} ${running ? "paused" : "resumed"}`);
  };
  const remove = (id: string) => {
    const a = displayAgents.find((x) => x.id === id);
    if (!a) return;
    toast.success(`${a.name} removed`);
  };

  if (isLoading) return <AgentsSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#3b82f6" }} />
        <p className="text-[10px] text-white/50 uppercase tracking-widest">
          {counts.running} active
        </p>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mt-1 text-white">Agents</h1>
      <p className="text-sm text-white/50 mt-2">
        Background workers running on your schedule. Each has its own model, memory, and
        orchestration loop.
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 mt-5 overflow-x-auto hide-scrollbar pb-2">
        {(
          [
            ["all", "All"],
            ["running", "Running"],
            ["scheduled", "Scheduled"],
            ["done", "Done"],
            ["paused", "Paused"],
          ] as [string, string][]
        ).map(([key, label]) => {
          const isActive = filter === key;
          const count = counts[key] ?? 0;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className="flex-1 rounded-2xl p-3 text-center text-[10px] font-medium transition-all"
              style={{
                background: isActive ? "rgba(59, 130, 246, 0.2)" : "rgba(17, 22, 35, 0.5)",
                backdropFilter: "blur(16px)",
                border: isActive
                  ? "1px solid rgba(59, 130, 246, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.05)",
                color: isActive ? "#3b82f6" : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <p className="text-lg font-bold" style={{ color: isActive ? "#3b82f6" : "white" }}>
                {count}
              </p>
              <p className="uppercase tracking-wider mt-1">{label}</p>
            </button>
          );
        })}
      </div>

      {/* Agent list */}
      <ul className="space-y-2 mt-5">
        {filtered.length === 0 && (
          <li className="text-sm text-white/40 text-center py-10">
            No {filter === "all" ? "" : filter} agents.
          </li>
        )}
        {filtered.map((r: any) => {
          const cfg = STATUS_CONFIG[r.status];
          const isExpanded = expanded === r.id;
          const Icon = r.icon ?? Bot;
          return (
            <li
              key={r.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(17, 22, 35, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Header */}
              <div className="p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white/90">{r.name}</p>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/50 leading-snug mt-0.5">{r.desc}</p>
                </div>
                <div className="flex items-center gap-1">
                  {r.status !== "done" && (
                    <button
                      onClick={() => toggle(r.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {r.status === "running" ? (
                        <Pause className="w-3.5 h-3.5 text-white/50" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-white/50" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : r.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-white/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                  {/* Progress bar */}
                  {r.status === "running" && (
                    <div className="pt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-white/40">Progress</span>
                        <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>
                          {r.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${r.progress}%`,
                            background: "var(--gradient-hero)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Sub-agents */}
                  {r.subAgents && r.subAgents.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                        Sub-agents
                      </p>
                      <div className="space-y-1.5">
                        {r.subAgents.map((sa) => {
                          const sCfg = STATUS_CONFIG[sa.status];
                          return (
                            <div
                              key={sa.id}
                              className="flex items-center gap-2 rounded-xl px-3 py-2"
                              style={{
                                background: "rgba(255, 255, 255, 0.03)",
                              }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: sCfg.color }}
                              />
                              <p className="text-[11px] text-white/70 flex-1">{sa.name}</p>
                              <span className="text-[9px]" style={{ color: sCfg.color }}>
                                {sCfg.label}
                              </span>
                              {sa.status === "running" && (
                                <div className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${sa.progress}%`,
                                      background: "var(--gradient-hero)",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Outputs & History */}
                  {(r.outputs || r.history) && (
                    <div className="pt-2 space-y-2">
                      {r.outputs && (
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                            Latest Output
                          </p>
                          <p className="text-[11px] text-white/60 leading-relaxed bg-white/[3%] rounded-xl px-3 py-2">
                            {r.outputs}
                          </p>
                        </div>
                      )}
                      {r.history && (
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                            History
                          </p>
                          <div className="space-y-1">
                            {r.history.map((h, i) => (
                              <p key={i} className="text-[10px] text-white/40">
                                {h}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-white/30">
                      {r.privacyMode === "private" ? "On-device processing" : "Multi-model (auto)"}
                    </span>
                    <span className="text-[10px] text-white/30">Next run: {r.nextRun || "—"}</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
