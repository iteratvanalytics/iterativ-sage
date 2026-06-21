import { createFileRoute } from "@tanstack/react-router";
import { Bot, CheckCircle2, Loader2, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/agents")({
  component: AgentsPage,
});

const RUNS = [
  { name: "Inbox Triage", goal: "Sort & label every email since 7am", status: "running" as const, eta: "2m", subagents: 2 },
  { name: "Competitor Watch", goal: "Daily summary of 8 product sites", status: "scheduled" as const, eta: "tomorrow 8am", subagents: 3 },
  { name: "Slide Deck — Q3 Review", goal: "Draft 12 slides from your notes + last quarter's data", status: "running" as const, eta: "5m", subagents: 4 },
  { name: "Resume Calls", goal: "Find unmet contacts in CRM and draft outreach", status: "done" as const, eta: "done · 14 min ago", subagents: 2 },
  { name: "Travel Planner", goal: "Compare flights LHR → SFO for Oct 14-22", status: "done" as const, eta: "done · 1h ago", subagents: 3 },
];

const STATUS = {
  running: { icon: Loader2, label: "running", className: "text-primary animate-spin" },
  scheduled: { icon: Clock, label: "scheduled", className: "text-accent" },
  done: { icon: CheckCircle2, label: "done", className: "text-emerald-400" },
};

function AgentsPage() {
  return (
    <div className="px-5 pt-14">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Background</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Agents</h1>
      <p className="text-sm text-muted-foreground mt-2">Long-running and scheduled work, even while you're offline.</p>

      <div className="mt-6 space-y-3">
        {RUNS.map(r => {
          const S = STATUS[r.status];
          return (
            <div key={r.name} className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold truncate">{r.name}</p>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                      <S.icon className={`w-3.5 h-3.5 ${S.className}`} />
                      {r.eta}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.goal}</p>
                  <p className="text-[11px] text-muted-foreground mt-2">{r.subagents} sub-agents · {S.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}