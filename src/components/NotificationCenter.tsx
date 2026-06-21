import { useState, useEffect, useRef } from "react";
import {
  Bell, X, Bot, Brain, Sparkles, AlertTriangle,
  CheckCircle2, ChevronRight, Trash2
} from "lucide-react";

type NotifCategory = "agent" | "skill" | "memory" | "alert";

type Notification = {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFS: Notification[] = [
  { id: "1", category: "agent",  title: "Inbox Triage complete",         body: "34 emails processed · 12 drafted · 3 flagged", time: "2m ago",  read: false },
  { id: "2", category: "agent",  title: "Competitor Watch ready",         body: "8 sites monitored · 2 pricing changes detected", time: "18m ago", read: false },
  { id: "3", category: "memory", title: "Memory updated",                 body: "Tone preference saved from your last conversation", time: "34m ago", read: false },
  { id: "4", category: "skill",  title: "Gmail skill connected",          body: "Read, draft, and triage permissions granted", time: "1h ago",  read: true  },
  { id: "5", category: "agent",  title: "Slide Deck agent: 6/12 slides",  body: "Q3 Review deck is halfway — ETA 5 minutes", time: "1h ago",  read: true  },
  { id: "6", category: "memory", title: "Context recalled",               body: "Recalled Maya Chen's contact preference in chat", time: "2h ago",  read: true  },
  { id: "7", category: "alert",  title: "Consent required",               body: "Travel Planner wants to book a flight — tap to review", time: "3h ago",  read: false },
  { id: "8", category: "skill",  title: "Weekly Digest skill built",      body: "Runs every Friday at 5pm · read Notes only", time: "5h ago",  read: true  },
];

const CATEGORY_META: Record<NotifCategory, { icon: typeof Bell; color: string; label: string }> = {
  agent:  { icon: Bot,          color: "text-primary bg-primary/15",     label: "Agent"  },
  skill:  { icon: Sparkles,     color: "text-fuchsia-400 bg-fuchsia-400/15", label: "Skill"  },
  memory: { icon: Brain,        color: "text-amber-400 bg-amber-400/15",  label: "Memory" },
  alert:  { icon: AlertTriangle,color: "text-rose-400 bg-rose-400/15",    label: "Alert"  },
};

export function NotificationCenter() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotifCategory | "all">("all");
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());
  const drawerRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const dismiss = (id: string) => {
    setDismissing(s => new Set(s).add(id));
    setTimeout(() => {
      setNotifs(n => n.filter(x => x.id !== id));
      setDismissing(s => { const next = new Set(s); next.delete(id); return next; });
    }, 280);
  };

  const clearAll = () => {
    const ids = filtered.map(n => n.id);
    ids.forEach(id => setDismissing(s => new Set(s).add(id)));
    setTimeout(() => {
      setNotifs(n => n.filter(x => !ids.includes(x.id)));
      setDismissing(new Set());
      if (ids.length === notifs.length) setOpen(false);
    }, 300);
  };

  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const filtered = notifs.filter(n => filter === "all" || n.category === filter);

  // Close on backdrop click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false);
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(true); markAllRead(); }}
        className="relative w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
            style={{ background: "var(--gradient-hero)" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] glass-strong rounded-t-3xl shadow-[var(--shadow-elevated)] transition-transform duration-300 ease-out`}
        style={{ transform: `translateX(-50%) translateY(${open ? "0%" : "100%"})` }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3">
          <div>
            <h2 className="font-semibold text-lg">Notifications</h2>
            <p className="text-[11px] text-muted-foreground">{notifs.length} total · {unread} unread</p>
          </div>
          <div className="flex items-center gap-2">
            {filtered.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-[11px] text-destructive/70 hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-1.5 px-5 pb-3 overflow-x-auto hide-scrollbar">
          {(["all", "agent", "memory", "skill", "alert"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium capitalize whitespace-nowrap transition-all ${filter === f ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
            >
              {f === "all" ? `All (${notifs.length})` : `${CATEGORY_META[f].label} (${notifs.filter(n => n.category === f).length})`}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto max-h-[60vh] px-4 pb-10 space-y-2 hide-scrollbar">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-emerald-400 opacity-50" />
              <p className="text-sm text-muted-foreground">All clear — nothing here.</p>
            </div>
          )}
          {filtered.map(n => {
            const meta = CATEGORY_META[n.category];
            const Icon = meta.icon;
            const isDismissing = dismissing.has(n.id);

            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`relative flex items-start gap-3 p-3 rounded-2xl transition-all duration-280 cursor-pointer active:scale-[0.99] ${
                  n.read ? "glass" : "border border-primary/20"
                } ${isDismissing ? "opacity-0 translate-x-8 scale-95 pointer-events-none" : "opacity-100 translate-x-0 scale-100"}`}
                style={!n.read ? { background: "linear-gradient(135deg, oklch(0.72 0.18 280 / 0.06), oklch(0.78 0.16 200 / 0.03))" } : {}}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-[13px] font-medium truncate ${n.read ? "text-foreground/80" : "text-foreground"}`}>{n.title}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{n.body}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground hover:bg-white/10 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
