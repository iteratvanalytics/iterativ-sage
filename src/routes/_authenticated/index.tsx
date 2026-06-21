import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus, Search, Sparkles, Globe, Mail, Calendar, Image, MessageSquare,
  Zap, Bot, Clock, ChevronRight, Mic, Brain, Shield, ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

const QUICK_ACTIONS = [
  { label: "Deep Research",  icon: Globe,         color: "bg-emerald-500/20 text-emerald-400",  prompt: "Research my top 3 competitors and draft a one-page brief" },
  { label: "Email Draft",    icon: Mail,           color: "bg-rose-500/20 text-rose-400",        prompt: "Summarize my unread email and draft replies" },
  { label: "Schedule",       icon: Calendar,       color: "bg-cyan-500/20 text-cyan-400",        prompt: "Find the best meeting slot this week" },
  { label: "Image Studio",   icon: Image,          color: "bg-fuchsia-500/20 text-fuchsia-400",  prompt: "Generate a hero image for my deck" },
  { label: "Message",        icon: MessageSquare,  color: "bg-green-500/20 text-green-400",      prompt: "Send a message via iMessage or WhatsApp" },
  { label: "Workflow",       icon: Zap,            color: "bg-amber-500/20 text-amber-400",      prompt: "Build me a custom skill: summarise my week every Friday" },
];

const LIVE_AGENTS = [
  { name: "Inbox Triage",     status: "running",   model: "Claude Sonnet 4",    progress: 67, time: "2m left",     subagents: 2 },
  { name: "Competitor Watch", status: "scheduled", model: "Perplexity Sonar",   progress: 0,  time: "Tomorrow 8am", subagents: 3 },
];

const RECENT_ACTIVITY = [
  { type: "tool",   label: "Drafted email to Maya Chen",        time: "2m ago",  icon: Mail,    color: "text-rose-400"    },
  { type: "tool",   label: "Scheduled standup for tomorrow",    time: "15m ago", icon: Calendar, color: "text-cyan-400"   },
  { type: "agent",  label: "Competitor Watch completed",        time: "1h ago",  icon: Bot,     color: "text-primary"     },
  { type: "memory", label: "Saved tone preference",             time: "3h ago",  icon: Brain,   color: "text-amber-400"   },
  { type: "tool",   label: "Privacy-routed 3 emails on-device", time: "3h ago", icon: Shield,  color: "text-emerald-400"  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: threads = [] } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("threads").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const newThread = useMutation({
    mutationFn: async (seed?: string) => {
      const { data, error } = await supabase.from("threads").insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        title: seed ? seed.slice(0, 40) : "New conversation",
      }).select().single();
      if (error) throw error;
      return { id: data.id, seed };
    },
    onSuccess: ({ id, seed }) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: id }, search: seed ? { seed } : {} });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => threads.filter(t =>
    !q || t.title.toLowerCase().includes(q.toLowerCase()) || (t.preview ?? "").toLowerCase().includes(q.toLowerCase())
  ), [threads, q]);

  return (
    <div className="px-5 pt-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Multi-model active</p>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-0.5">{getGreeting()}</h1>
        </div>
        <button
          onClick={() => newThread.mutate(undefined)}
          className="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center shadow-[var(--shadow-elevated)] active:scale-95 transition-transform"
          aria-label="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Hero CTA */}
      <button
        onClick={() => newThread.mutate(undefined)}
        className="w-full text-left rounded-3xl p-5 mb-6 relative overflow-hidden shadow-[var(--shadow-elevated)] active:scale-[0.99] transition-transform"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-60 siri-orb" />
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 siri-orb" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sage v0.17 · The Reach Release</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold leading-tight">Ask anything.<br/>Sage routes to the right model.</h2>
          <p className="text-sm text-muted-foreground mt-2">Sub-agents work in the background while you keep moving.</p>
          <div className="flex items-center gap-1 mt-4">
            <span className="text-sm font-medium text-primary">Start a conversation</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </button>

      {/* Voice shortcut */}
      <button
        onClick={() => newThread.mutate("Brief me on my day")}
        className="w-full glass rounded-2xl p-3.5 mb-6 flex items-center gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
          <Mic className="w-5 h-5 text-rose-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">Morning brief</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Tap to hear your day — calendar, email, news</p>
        </div>
        <div className="flex gap-0.5 items-end h-5">
          {[3,5,7,4,6,3,5].map((h, i) => (
            <div key={i} className="w-0.5 bg-rose-400/50 rounded-full" style={{ height: `${h * 2.5}px` }} />
          ))}
        </div>
      </button>

      {/* Quick actions */}
      <div className="mb-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map(s => (
            <button
              key={s.label}
              onClick={() => newThread.mutate(s.prompt)}
              className="glass rounded-2xl p-3 text-center active:scale-95 transition-transform"
            >
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live agents */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Live Agents</p>
          <Link to="/agents" className="flex items-center gap-1 text-[10px] text-primary">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {LIVE_AGENTS.map(a => (
            <Link key={a.name} to="/agents" className="block glass rounded-2xl p-3 flex items-center gap-3 active:scale-[0.99] transition-transform">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center shrink-0">
                <Bot className={`w-4 h-4 ${a.status === "running" ? "text-primary" : "text-amber-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.status === "running" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{a.model}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{a.subagents} sub-agents</span>
                  {a.status === "running" && (
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden ml-1">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${a.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="mb-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className={`w-7 h-7 rounded-lg glass flex items-center justify-center shrink-0 ${a.color}`}>
                <a.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] truncate">{a.label}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] text-muted-foreground uppercase tracking-wider">Conversations</h3>
        <span className="text-[10px] text-muted-foreground">{threads.length}</span>
      </div>
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search conversations"
          className="h-10 rounded-2xl glass border-0 pl-9"
        />
      </div>

      <ul className="space-y-2 pb-6">
        {filtered.length === 0 && (
          <li className="text-sm text-muted-foreground text-center py-10">
            {q ? "No conversations match your search." : "No conversations yet. Start one above."}
          </li>
        )}
        {filtered.map(t => (
          <li key={t.id}>
            <Link
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className="block glass rounded-2xl p-4 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-primary/50 shrink-0" />
                  <p className="font-medium text-sm truncate">{t.title}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {new Date(t.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
              {t.preview && <p className="text-sm text-muted-foreground truncate mt-1 pl-4">{t.preview}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
