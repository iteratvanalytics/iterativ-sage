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
} from "lucide-react";
import { MeetingAgentSheet } from "@/components/MeetingAgentSheet";
import { AgentsSkeleton } from "@/components/SkeletonScreen";
import { toast } from "sonner";
import { useDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/_authenticated/agents")({
  component: AgentsPage,
});

type RunStatus = "running" | "scheduled" | "done" | "paused";

type SubAgent = {
  name: string;
  model: string;
  goal: string;
  status: "done" | "running";
  duration?: string;
};

type AgentRun = {
  id: string;
  name: string;
  goal: string;
  status: RunStatus;
  eta: string;
  subagents: SubAgent[];
  model: string;
  progress: number;
  lastOutput?: string;
  privacy?: "on-device" | "cloud-with-consent";
};

const INITIAL_RUNS: AgentRun[] = [
  {
    id: "1",
    name: "Inbox Triage",
    goal: "Sort & label every email since 7am, draft priority replies",
    status: "running",
    eta: "2m",
    model: "Claude Sonnet 4",
    progress: 67,
    lastOutput: "Processed 34 emails · 12 drafted · 3 flagged for review",
    privacy: "on-device",
    subagents: [
      {
        name: "Classifier",
        model: "On-device",
        goal: "Classify by urgency & sender",
        status: "done",
        duration: "1.2s",
      },
      {
        name: "Drafter",
        model: "Claude Sonnet 4",
        goal: "Draft priority replies",
        status: "running",
      },
    ],
  },
  {
    id: "2",
    name: "Competitor Watch",
    goal: "Daily summary of 8 product sites, pricing alerts",
    status: "scheduled",
    eta: "tomorrow 8am",
    model: "Perplexity Sonar",
    progress: 0,
    lastOutput: "Scheduled · will run tomorrow at 08:00",
    privacy: "cloud-with-consent",
    subagents: [
      {
        name: "Scout A",
        model: "Perplexity Sonar",
        goal: "Scrape 4 product sites",
        status: "done",
      },
      {
        name: "Scout B",
        model: "Perplexity Sonar",
        goal: "Scrape 4 pricing pages",
        status: "done",
      },
      { name: "Analyst", model: "o3", goal: "Synthesise deltas + alerts", status: "done" },
    ],
  },
  {
    id: "3",
    name: "Slide Deck — Q3 Review",
    goal: "Draft 12 slides from notes + last quarter's data",
    status: "running",
    eta: "5m",
    model: "Gemini 2.5 Pro",
    progress: 45,
    lastOutput: "Slide 6 of 12 · Charts rendering",
    privacy: "cloud-with-consent",
    subagents: [
      {
        name: "Researcher",
        model: "Perplexity Sonar",
        goal: "Pull Q3 metrics",
        status: "done",
        duration: "2.1s",
      },
      { name: "Designer", model: "Gemini 2.5 Pro", goal: "Draft slide layouts", status: "running" },
      {
        name: "Chart Maker",
        model: "Gemini 2.5 Pro",
        goal: "Render data visualisations",
        status: "running",
      },
      { name: "Writer", model: "Claude Sonnet 4", goal: "Write speaker notes", status: "running" },
    ],
  },
  {
    id: "4",
    name: "Resume Calls",
    goal: "Find unmet contacts in CRM and draft outreach sequences",
    status: "done",
    eta: "done · 14 min ago",
    model: "o3",
    progress: 100,
    lastOutput: "23 sequences drafted · 8 contacts prioritised",
    privacy: "cloud-with-consent",
    subagents: [
      {
        name: "CRM Scout",
        model: "o3-mini",
        goal: "Find lapsed contacts",
        status: "done",
        duration: "3.4s",
      },
      {
        name: "Writer",
        model: "Claude Sonnet 4",
        goal: "Draft outreach sequences",
        status: "done",
        duration: "8.2s",
      },
    ],
  },
  {
    id: "5",
    name: "Travel Planner",
    goal: "2-day Nairobi trip around Thursday meeting",
    status: "done",
    eta: "done · 1h ago",
    model: "o3",
    progress: 100,
    lastOutput: "3 flights shortlisted · Itinerary ready · 2 hotels compared",
    privacy: "cloud-with-consent",
    subagents: [
      {
        name: "Flight Scout",
        model: "Perplexity Sonar",
        goal: "Find NBO flights",
        status: "done",
        duration: "4.2s",
      },
      {
        name: "Hotel Scout",
        model: "Perplexity Sonar",
        goal: "Compare hotels near CBD",
        status: "done",
        duration: "3.8s",
      },
      {
        name: "Writer",
        model: "Claude Sonnet 4",
        goal: "Assemble itinerary",
        status: "done",
        duration: "2.1s",
      },
    ],
  },
  {
    id: "6",
    name: "Code Review Bot",
    goal: "Review all open PRs, flag regressions, suggest fixes",
    status: "paused",
    eta: "paused",
    model: "Gemini 2.5 Pro",
    progress: 30,
    lastOutput: "Paused after 7 PRs · 2 regressions found",
    privacy: "on-device",
    subagents: [
      {
        name: "PR Reader",
        model: "Gemini 2.5 Pro",
        goal: "Read PR diffs",
        status: "done",
        duration: "5.7s",
      },
      {
        name: "Reviewer",
        model: "Gemini 2.5 Pro",
        goal: "Flag issues & suggest",
        status: "running",
      },
    ],
  },
];

const WORKFLOW_TEMPLATES = [
  {
    icon: Video,
    label: "Attend Meeting",
    prompt: "Join a virtual meeting on my behalf and send me a summary",
  },
  { icon: Mail, label: "Inbox Triage", prompt: "Sort & draft replies for all email since 7am" },
  {
    icon: Globe,
    label: "Competitor Watch",
    prompt: "Monitor my top 5 competitor sites and alert on changes",
  },
  {
    icon: Brain,
    label: "Weekly Digest",
    prompt: "Summarise my week's notes into a status update every Friday",
  },
  { icon: Terminal, label: "Code Review", prompt: "Review all open PRs and flag regressions" },
  { icon: Cpu, label: "Research Brief", prompt: "Research competitors and draft a one-page brief" },
  {
    icon: Shield,
    label: "Privacy Audit",
    prompt: "Audit all skills for their current data access permissions",
  },
];

const STATUS_META: Record<RunStatus, { icon: typeof Loader2; label: string; dotClass: string }> = {
  running: { icon: Loader2, label: "running", dotClass: "bg-emerald-400 animate-pulse" },
  scheduled: { icon: Clock, label: "scheduled", dotClass: "bg-amber-400" },
  done: { icon: CheckCircle2, label: "done", dotClass: "bg-muted-foreground/30" },
  paused: { icon: Pause, label: "paused", dotClass: "bg-muted-foreground/30" },
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

  const toggleStatus = (id: string) => {
    setRuns((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status === "paused") return { ...r, status: "running" as RunStatus };
        if (r.status === "running") return { ...r, status: "paused" as RunStatus };
        return r;
      }),
    );
  };

  const deleteRun = (id: string) => {
    setRuns((prev) => prev.filter((r) => r.id !== id));
    toast.success("Workflow deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          const restored = INITIAL_RUNS.find((r) => r.id === id);
          if (restored) setRuns((p) => [restored, ...p]);
        },
      },
    });
  };

  const addRun = (template: (typeof WORKFLOW_TEMPLATES)[0]) => {
    const newRun: AgentRun = {
      id: String(Date.now()),
      name: template.label,
      goal: template.prompt,
      status: "running",
      eta: "starting…",
      model: "Gemini 2.5 Flash",
      progress: 0,
      subagents: [
        {
          name: "Planner",
          model: "o3-mini",
          goal: "Decompose task into sub-steps",
          status: "running",
        },
      ],
      privacy: "cloud-with-consent",
    };
    setRuns((prev) => [newRun, ...prev]);
    setShowNewModal(false);
    toast.success("Workflow started");
  };

  const filtered = filter === "all" ? displayRuns : displayRuns.filter((r) => r.status === filter);
  const running = displayRuns.filter((r) => r.status === "running").length;
  const scheduled = displayRuns.filter((r) => r.status === "scheduled").length;
  const done = displayRuns.filter((r) => r.status === "done").length;

  if (isLoading) return <AgentsSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">
        Autonomous Workflows
      </p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Orchestrator</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Long-running and scheduled agents — even while you're offline.
      </p>

      {/* Attend Meeting CTA */}
      <button
        onClick={() => setShowMeetingAgent(true)}
        className="w-full mt-5 rounded-3xl p-4 text-left relative overflow-hidden active:scale-[0.99] transition-transform shadow-[var(--shadow-elevated)] hover:brightness-105"
        style={{ background: "var(--gradient-card)" }}
      >
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-50"
          style={{ background: "var(--gradient-orb)" }}
        />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 backdrop-blur flex items-center justify-center shrink-0">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold">Attend a meeting for me</p>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 font-semibold">
                NEW
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-snug">
              Sage joins as a silent observer — transcribes, extracts decisions & action items, then
              briefs you.
            </p>
          </div>
          <div className="w-8 h-8 rounded-full glass flex items-center justify-center shrink-0">
            <ChevronUp className="w-4 h-4 rotate-90" />
          </div>
        </div>
        <div className="relative flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
          {["Zoom", "Google Meet", "Teams", "Webex"].map((p) => (
            <span key={p} className="text-[10px] text-muted-foreground/60">
              {p}
            </span>
          ))}
        </div>
      </button>

      {/* Stats */}
      <div className="flex gap-3 mt-5">
        <div className="flex-1 glass rounded-2xl p-3 text-center active:scale-[0.98] transition-transform hover:bg-white/[3%]">
          <p className="text-2xl font-bold text-primary">{running}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Running</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center active:scale-[0.98] transition-transform hover:bg-white/[3%]">
          <p className="text-2xl font-bold text-amber-400">{scheduled}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
            Scheduled
          </p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center active:scale-[0.98] transition-transform hover:bg-white/[3%]">
          <p className="text-2xl font-bold text-emerald-400">{done}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
            Completed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mt-5 overflow-x-auto hide-scrollbar pb-1">
        {(["all", "running", "scheduled", "done", "paused"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium capitalize whitespace-nowrap transition-all duration-200 ${filter === f ? "bg-primary text-primary-foreground shadow-sm" : "glass text-muted-foreground hover:text-foreground hover:bg-white/[3%]"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Agent cards */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No workflows found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Try a different filter or create a new one
            </p>
          </div>
        )}
        {filtered.map((r) => {
          const S = STATUS_META[r.status];
          const Icon = S.icon;
          const isExpanded = expanded === r.id;

          return (
            <div
              key={r.id}
              className="glass rounded-2xl overflow-hidden hover:bg-white/[3%] transition-colors"
            >
              {/* Progress bar */}
              {r.status === "running" && (
                <div
                  className="h-[2px] bg-muted overflow-hidden"
                  role="progressbar"
                  aria-valuenow={r.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${r.name} progress`}
                >
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${r.progress}%` }}
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{r.name}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        {(r.status === "running" || r.status === "paused") && (
                          <button
                            onClick={() => toggleStatus(r.id)}
                            aria-label={r.status === "paused" ? "Resume" : "Pause"}
                            className="w-6 h-6 rounded-full glass flex items-center justify-center active:scale-90 transition-transform hover:bg-white/10"
                          >
                            {r.status === "paused" ? (
                              <Play className="w-3 h-3" />
                            ) : (
                              <Pause className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => deleteRun(r.id)}
                          aria-label="Delete workflow"
                          className="w-6 h-6 rounded-full glass flex items-center justify-center text-destructive active:scale-90 transition-transform hover:bg-white/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.goal}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px]">
                        <div className={`w-1.5 h-1.5 rounded-full ${S.dotClass}`} />
                        <span className="text-muted-foreground capitalize">{S.label}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {r.subagents.length} sub-agents
                      </span>
                      <span className="text-[10px] text-muted-foreground">{r.model}</span>
                      {r.privacy && (
                        <span
                          className={`text-[10px] flex items-center gap-0.5 ${r.privacy === "on-device" ? "text-emerald-400" : "text-amber-400/80"}`}
                        >
                          <Shield className="w-2.5 h-2.5" />
                          {r.privacy === "on-device" ? "On-device" : "Cloud (consented)"}
                        </span>
                      )}
                    </div>
                    {r.lastOutput && (
                      <p className="text-[11px] text-muted-foreground mt-2 truncate">
                        {r.lastOutput}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-center gap-1 mt-3 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  )}
                  {isExpanded ? "Hide" : "Show"} sub-agents
                </button>

                {/* Sub-agents panel */}
                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-white/5 pt-3 animate-in fade-in slide-in-from-top-2">
                    {r.subagents.map((sa, i) => (
                      <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-xl glass">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium">{sa.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{sa.goal}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {sa.duration && (
                            <span className="text-[10px] text-muted-foreground">{sa.duration}</span>
                          )}
                          {sa.status === "done" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New workflow button */}
      <button
        onClick={() => setShowNewModal(true)}
        className="w-full mt-4 glass rounded-2xl py-3.5 flex items-center justify-center gap-2 text-muted-foreground active:scale-[0.99] transition-transform hover:text-foreground hover:bg-white/[3%]"
      >
        <Plus className="w-4 h-4" />
        New workflow
      </button>

      {/* Meeting Agent Sheet */}
      {showMeetingAgent && <MeetingAgentSheet onClose={() => setShowMeetingAgent(false)} />}

      {/* New workflow modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewModal(false)}
          />
          <div className="relative w-full max-w-[480px] glass-strong rounded-t-3xl p-5 pb-10 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-lg">New Workflow</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose a template or describe your own
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full glass flex items-center justify-center active:scale-90 transition-transform hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {WORKFLOW_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => addRun(t)}
                  className="glass rounded-2xl p-3.5 text-left active:scale-[0.98] transition-transform hover:bg-white/[3%]"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5">
                    <t.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-[13px] font-medium">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                    {t.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
