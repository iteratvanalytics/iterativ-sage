import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot,
  CircleCheck as CheckCircle2,
  Loader as Loader2,
  Clock,
  Pause,
  Play,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Zap,
  Cpu,
  Globe,
  Mail,
  Brain,
  Terminal,
  Shield,
  X,
  Video,
  Check,
  TriangleAlert as AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { MeetingAgentSheet } from "@/components/MeetingAgentSheet";
import { AgentsSkeleton } from "@/components/SkeletonScreen";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/_authenticated/agents")({
  component: AgentsPage,
});

type RunStatus = "running" | "scheduled" | "done" | "paused";

interface AgentRun {
  id: string;
  name: string;
  desc: string;
  status: RunStatus;
  progress: number;
  nextRun?: string;
  subAgents?: {
    id: string;
    name: string;
    status: RunStatus;
    progress: number;
  }[];
  privacyMode?: "private" | "auto";
  outputs?: string;
  history?: string[];
  icon?: typeof Zap;
}

const INITIAL_RUNS: AgentRun[] = [
  {
    id: "morning",
    name: "Morning Brief",
    desc: "Summarise overnight inbox, calendar & news into a brief.",
    status: "done",
    progress: 100,
    nextRun: "Tomorrow 07:00",
    subAgents: [
      { id: "sa1", name: "Inbox Triage", status: "done", progress: 100 },
      { id: "sa2", name: "Calendar Read", status: "done", progress: 100 },
      { id: "sa3", name: "News Digest", status: "done", progress: 100 },
    ],
    privacyMode: "private",
    outputs: "Sent email brief. 4 action items flagged.",
    history: [
      "07:00 — started",
      "07:02 — inbox triage done",
      "07:04 — calendar read done",
      "07:05 — brief sent",
    ],
  },
  {
    id: "research",
    name: "Weekly Research",
    desc: "Deep-dive on industry trends, summarize to Notion.",
    status: "running",
    progress: 65,
    nextRun: "Fri 18:00",
    subAgents: [
      { id: "sb1", name: "Source Scan", status: "done", progress: 100 },
      { id: "sb2", name: "Trend Analysis", status: "running", progress: 60 },
      { id: "sb3", name: "Notion Write", status: "scheduled", progress: 0 },
    ],
    privacyMode: "auto",
    outputs: "12 articles indexed. Trend analysis in progress.",
  },
  {
    id: "calendar",
    name: "Meeting Prep",
    desc: "Pull context, agendas, and briefs 15 min before each meeting.",
    status: "scheduled",
    progress: 0,
    nextRun: "Today 14:00",
    privacyMode: "private",
  },
  {
    id: "expense",
    name: "Expense Report",
    desc: "Auto-categorize transactions and draft monthly report.",
    status: "paused",
    progress: 0,
    nextRun: "Paused",
    privacyMode: "auto",
  },
];

const STATUS_CONFIG: Record<
  RunStatus,
  { icon: typeof Loader2; label: string; color: string; bg: string }
> = {
  running: { icon: Loader2, label: "running", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  scheduled: { icon: Clock, label: "scheduled", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  done: { icon: CheckCircle2, label: "done", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" },
  paused: { icon: Pause, label: "paused", color: "#6b7280", bg: "rgba(255, 255, 255, 0.08)" },
};

function AgentsPage() {
  const { isDemoMode, activePersona } = useDemoMode();
  const personaAgents = activePersona?.agents ?? [];
  const [runs, setRuns] = useState<AgentRun[]>(INITIAL_RUNS);
  const [filter, setFilter] = useState<RunStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showMeetingAgent, setShowMeetingAgent] = useState(false);
  const [isLoading] = useState(false);

  const displayRuns = isDemoMode ? personaAgents : runs;

  const filtered = filter === "all" ? displayRuns : displayRuns.filter((r) => r.status === filter);
  const running = displayRuns.filter((r) => r.status === "running").length;
  const scheduled = displayRuns.filter((r) => r.status === "scheduled").length;
  const done = displayRuns.filter((r) => r.status === "done").length;

  const toggle = (id: string) => {
    setRuns((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status === "running") return { ...r, status: "paused" as const, progress: 0 };
        if (r.status === "paused") return { ...r, status: "running" as const, progress: 30 };
        return r;
      }),
    );
    toast.success("Agent updated");
  };
  const remove = (id: string) => {
    setRuns((prev) => prev.filter((r) => r.id !== id));
    toast.success("Agent deleted");
  };

  const active = runs.filter((r) => r.status === "running" || r.status === "scheduled").length;

  if (isLoading) return <AgentsSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      <p className="text-[10px] text-white/50 uppercase tracking-widest">
        {active} background {active === 1 ? "agent" : "agents"} active
      </p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1 text-white">Agent Control</h1>
      <p className="text-sm text-white/50 mt-2">
        Background agents run on your schedule and operate on your data with explicit consent.
      </p>

      {/* Stats row */}
      <div className="flex gap-3 mt-5">
        {(
          [
            ["all", "All", displayRuns.length] as const,
            ["running", "Running", running] as const,
            ["scheduled", "Scheduled", scheduled] as const,
            ["done", "Done", done] as const,
          ] as [RunStatus | "all", string, number][]
        ).map(([key, label, count]) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex-1 rounded-2xl p-3 text-center text-[10px] font-medium transition-all"
              style={{
                background: isActive ? "rgba(217, 70, 239, 0.2)" : "rgba(45, 27, 78, 0.5)",
                backdropFilter: "blur(16px)",
                border: isActive
                  ? "1px solid rgba(217, 70, 239, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.05)",
                color: isActive ? "#d946ef" : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <p className="text-lg font-bold" style={{ color: isActive ? "#d946ef" : "white" }}>
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
        {filtered.map((r) => {
          const cfg = STATUS_CONFIG[r.status];
          const isExpanded = expanded === r.id;
          const Icon = r.icon ?? Bot;
          return (
            <li
              key={r.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(45, 27, 78, 0.5)",
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
