import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, CircleCheck as CheckCircle2, Loader as Loader2, Clock, Zap, Pause, Play, Trash2, Plus, Sparkles, Cpu, Wifi, Layers } from "lucide-react";

export const Route = createFileRoute("/_authenticated/agents")({
  component: AgentsPage,
});

type RunStatus = "running" | "scheduled" | "done" | "paused";

type AgentRun = {
  id: string;
  name: string;
  goal: string;
  status: RunStatus;
  eta: string;
  subagents: number;
  model: string;
  progress: number;
  lastOutput?: string;
};

const INITIAL_RUNS: AgentRun[] = [
  { id: "1", name: "Inbox Triage", goal: "Sort & label every email since 7am, draft priority replies", status: "running", eta: "2m", subagents: 2, model: "Claude 3.5 Sonnet", progress: 67, lastOutput: "Processed 34 emails · 12 drafted" },
  { id: "2", name: "Competitor Watch", goal: "Daily summary of 8 product sites, pricing alerts", status: "scheduled", eta: "tomorrow 8am", subagents: 3, model: "Perplexity Sonar", progress: 0, lastOutput: "Scheduled for Oct 22, 08:00" },
  { id: "3", name: "Slide Deck — Q3 Review", goal: "Draft 12 slides from notes + last quarter's data", status: "running", eta: "5m", subagents: 4, model: "Gemini 2.5 Pro", progress: 45, lastOutput: "Slide 6 of 12 · Charts rendering" },
  { id: "4", name: "Resume Calls", goal: "Find unmet contacts in CRM and draft outreach sequences", status: "done", eta: "done · 14 min ago", subagents: 2, model: "o3-mini", progress: 100, lastOutput: "23 sequences drafted · 8 contacts prioritized" },
  { id: "5", name: "Travel Planner", goal: "Compare flights LHR → SFO for Oct 14-22, book hotels", status: "done", eta: "done · 1h ago", subagents: 3, model: "o3-mini", progress: 100, lastOutput: "3 flights shortlisted · 2 hotels reserved" },
  { id: "6", name: "Code Review Bot", goal: "Review all open PRs, flag regressions, suggest fixes", status: "paused", eta: "paused", subagents: 2, model: "Gemini 2.5 Pro", progress: 30, lastOutput: "Paused after 7 PRs · 2 regressions found" },
];

const STATUS_META: Record<RunStatus, { icon: typeof Loader2; label: string; className: string; bg: string }> = {
  running: { icon: Loader2, label: "running", className: "text-primary animate-spin", bg: "bg-primary/10" },
  scheduled: { icon: Clock, label: "scheduled", className: "text-amber-400", bg: "bg-amber-400/10" },
  done: { icon: CheckCircle2, label: "done", className: "text-emerald-400", bg: "bg-emerald-400/10" },
  paused: { icon: Pause, label: "paused", className: "text-muted-foreground", bg: "bg-muted/20" },
};

function AgentsPage() {
  const [runs, setRuns] = useState<AgentRun[]>(INITIAL_RUNS);
  const [filter, setFilter] = useState<RunStatus | "all">("all");

  const toggleStatus = (id: string) => {
    setRuns(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nextStatus = r.status === "paused" ? "running" : r.status === "running" ? "paused" : r.status;
      return { ...r, status: nextStatus };
    }));
  };

  const deleteRun = (id: string) => {
    setRuns(prev => prev.filter(r => r.id !== id));
  };

  const filtered = filter === "all" ? runs : runs.filter(r => r.status === filter);
  const running = runs.filter(r => r.status === "running").length;
  const scheduled = runs.filter(r => r.status === "scheduled").length;
  const done = runs.filter(r => r.status === "done").length;

  return (
    <div className="px-5 pt-14">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Autonomous Workflows</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Orchestrator</h1>
      <p className="text-sm text-muted-foreground mt-2">Long-running and scheduled agents, even while you're offline.</p>

      <div className="flex gap-3 mt-5">
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{running}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Running</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{scheduled}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Scheduled</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{done}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Completed</p>
        </div>
      </div>

      <div className="flex gap-1.5 mt-5 overflow-x-auto hide-scrollbar pb-1">
        {(["all", "running", "scheduled", "done", "paused"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium capitalize whitespace-nowrap transition-all ${filter === f ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map(r => {
          const S = STATUS_META[r.status];
          const Icon = S.icon;
          return (
            <div key={r.id} className="glass rounded-2xl p-4 relative overflow-hidden group">
              {r.status === "running" && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-primary" style={{ width: `${r.progress}%` }} />
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm truncate">{r.name}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleStatus(r.id)}
                        className="w-6 h-6 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
                      >
                        {r.status === "paused" ? <Play className="w-3 h-3" /> : r.status === "running" ? <Pause className="w-3 h-3" /> : <Icon className={`w-3 h-3 ${S.className}`} />}
                      </button>
                      <button
                        onClick={() => deleteRun(r.id)}
                        className="w-6 h-6 rounded-full glass flex items-center justify-center text-destructive active:scale-90 transition-transform"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.goal}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md ${S.bg}`}>
                      <Icon className={`w-3 h-3 ${S.className}`} />
                      {S.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{r.subagents} sub-agents</span>
                    <span className="text-[10px] text-muted-foreground">{r.model}</span>
                  </div>
                  {r.lastOutput && (
                    <p className="text-[11px] text-muted-foreground mt-2 truncate">{r.lastOutput}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 glass rounded-2xl py-3.5 flex items-center justify-center gap-2 text-muted-foreground active:scale-[0.99] transition-transform">
        <Plus className="w-4 h-4" /> New workflow
      </button>
    </div>
  );
}
