import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Bell, ChevronRight, Wifi, Phone, Send, Mail, Shield, Palette, Volume2, HardDrive, Brain, Cpu, Bot, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, ToggleLeft, ToggleRight, LogOut, ChevronDown, ChevronUp, Keyboard, Zap, MessageSquare, Eye, FlaskConical, Globe, Star, Circle as HelpCircle, FileText, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SageLogo } from "@/components/SageLogo";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const MODELS = [
  { id: "auto",    label: "Auto-route",       sub: "Sage picks the best model per task",           recommended: true  },
  { id: "claude",  label: "Claude Sonnet 4",  sub: "Best for drafting, email, complex reasoning",  recommended: false },
  { id: "gemini25",label: "Gemini 2.5 Pro",   sub: "Best for code, long context, vision",          recommended: false },
  { id: "gemini3", label: "Gemini 3 Flash",   sub: "Fastest for simple, quick responses",          recommended: false },
  { id: "o3",      label: "o3",               sub: "Best for logic, math, structured analysis",    recommended: false },
  { id: "pplx",   label: "Perplexity Sonar",  sub: "Best for live web research",                   recommended: false },
];

type ToggleDef = { id: string; label: string; sub: string; default: boolean };

const TOGGLE_GROUPS: { label: string; toggles: ToggleDef[] }[] = [
  {
    label: "Chat",
    toggles: [
      { id: "voice",     label: "Voice input",           sub: "Tap mic to dictate messages",                         default: true  },
      { id: "streaming", label: "Streaming responses",   sub: "Words appear as Sage types them",                     default: true  },
      { id: "autosuggest",label: "Auto-suggest chips",   sub: "Show action chips after each response",                default: true  },
      { id: "citations", label: "Research citations",    sub: "Show source links in research responses",              default: true  },
      { id: "reasoning", label: "Reasoning chain",       sub: "Expand Sage's step-by-step thinking",                 default: false },
    ],
  },
  {
    label: "Agents & Automation",
    toggles: [
      { id: "memory",    label: "Memory learning",       sub: "Auto-update memory from conversations",                default: true  },
      { id: "autoagent", label: "Background agents",     sub: "Run scheduled workflows even when app is closed",      default: true  },
      { id: "notifs",    label: "Agent notifications",   sub: "Notify when background tasks complete",                default: true  },
    ],
  },
  {
    label: "Privacy",
    toggles: [
      { id: "safebrowse",label: "Safe browsing",         sub: "Filter unsafe URLs in research results",               default: true  },
      { id: "experimental",label: "Experimental features",sub: "Early access to features in development",             default: false },
    ],
  },
];

const CONSENT_LOG = [
  { action: "Email sent to Maya Chen",          channel: "Gmail",     time: "2m ago",  allowed: true  },
  { action: "Calendar event created",           channel: "Calendar",  time: "18m ago", allowed: true  },
  { action: "Competitor Watch — web search",    channel: "Web",       time: "1h ago",  allowed: true  },
  { action: "PR comment attempted",             channel: "GitHub",    time: "3h ago",  allowed: false },
  { action: "Inbox triage — on-device classify",channel: "On-device", time: "3h ago",  allowed: true  },
];

const SHORTCUTS = [
  { keys: ["⌘", "K"],   label: "Open command bar"     },
  { keys: ["⌘", "/"],   label: "New conversation"      },
  { keys: ["⌘", "↑"],   label: "Voice input"           },
  { keys: ["⌘", "M"],   label: "Open Memory"           },
  { keys: ["⌘", "A"],   label: "Open Orchestrator"     },
  { keys: ["⌘", "⇧","S"],label: "Open Skills Hub"      },
  { keys: ["Esc"],       label: "Dismiss panel"         },
  { keys: ["⌘", "⇧","P"],label: "Toggle privacy mode" },
];

const MORE_ROWS = [
  { icon: Star,       label: "Rate Sage",            action: () => toast.success("Thank you! ⭐") },
  { icon: HelpCircle, label: "Help & support",        action: () => toast.info("Support centre — coming soon") },
  { icon: FileText,   label: "Privacy policy",        action: () => toast.info("sage.app/privacy") },
  { icon: ExternalLink,label: "Terms of service",     action: () => toast.info("sage.app/terms") },
  { icon: Globe,      label: "Open in browser",       action: () => toast.info("sage.app/app") },
  { icon: Trash2,     label: "Delete account",        action: () => toast.error("Contact support to delete your account") },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="shrink-0 transition-colors active:scale-90">
      {on
        ? <ToggleRight className="w-7 h-7 text-emerald-400" />
        : <ToggleLeft className="w-7 h-7 text-muted-foreground/40" />}
    </button>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState("auto");
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLE_GROUPS.flatMap(g => g.toggles).map(t => [t.id, t.default]))
  );
  const [showConsent, setShowConsent] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      toast.info("Demo mode — connect Supabase to enable accounts.");
      return;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't sign out.");
    }
  };

  const flip = (id: string) => {
    setToggles(p => {
      const next = { ...p, [id]: !p[id] };
      const label = TOGGLE_GROUPS.flatMap(g => g.toggles).find(t => t.id === id)?.label ?? id;
      toast.success(`${label} ${next[id] ? "enabled" : "disabled"}`);
      return next;
    });
  };

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">You</h1>

      {/* Profile card */}
      <div className="glass-strong rounded-3xl p-5 mt-6 flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-primary shadow-[var(--shadow-glow)]" style={{ background: 'var(--gradient-orb)' }}>
            <SageLogo size={32} className="text-primary" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold truncate">Dev User</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>PRO</span>
          </div>
          <p className="text-xs text-muted-foreground">Unlimited · Multi-model · Background agents</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">All systems operational</span>
          </div>
        </div>
        <button
          onClick={signOut}
          aria-label="Sign out"
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-all shrink-0"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Default model */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Default Model</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedModel(m.id); toast.success(`Default model → ${m.label}`); }}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/5 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selectedModel === m.id ? "bg-primary/20" : "glass"}`}>
                <Cpu className={`w-4 h-4 ${selectedModel === m.id ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-medium ${selectedModel === m.id ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
                  {m.recommended && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">Recommended</span>}
                </div>
                <span className="text-[11px] text-muted-foreground/70 block truncate">{m.sub}</span>
              </div>
              {selectedModel === m.id && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle groups */}
      {TOGGLE_GROUPS.map(group => (
        <div key={group.label} className="mt-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">{group.label}</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            {group.toggles.map(t => {
              const IconMap: Record<string, typeof Brain> = {
                voice: Volume2, streaming: Zap, autosuggest: MessageSquare,
                citations: Globe, reasoning: Brain, memory: Brain,
                autoagent: Bot, notifs: Bell, safebrowse: Shield,
                experimental: FlaskConical,
              };
              const Icon = IconMap[t.id] ?? Eye;
              return (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${toggles[t.id] ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">{t.sub}</p>
                  </div>
                  <Toggle on={toggles[t.id]} onToggle={() => flip(t.id)} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Integrations */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Integrations</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: Wifi,  label: "Raft Agent Network",     status: "Connected",     color: "text-emerald-400" },
            { icon: Phone, label: "WhatsApp Cloud API",      status: "Not connected", color: "text-muted-foreground" },
            { icon: Send,  label: "Telegram Bot API",        status: "Not connected", color: "text-muted-foreground" },
            { icon: Mail,  label: "Gmail & iMessage Bridge", status: "Connected",     color: "text-emerald-400" },
          ].map(r => (
            <button key={r.label} onClick={() => toast.info(`${r.label} settings — coming soon`)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5 transition-colors">
              <r.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-left text-sm">{r.label}</span>
              <span className={`text-[11px] ${r.color}`}>{r.status}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </button>
          ))}
        </div>
      </div>

      {/* Consent audit log */}
      <div className="mt-6">
        <button
          onClick={() => setShowConsent(s => !s)}
          className="w-full flex items-center justify-between mb-3"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Consent & Audit Log</p>
          {showConsent ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
        </button>
        {showConsent && (
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
            {CONSENT_LOG.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                {entry.allowed
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] truncate">{entry.action}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.channel} · {entry.time}</p>
                </div>
                <span className={`text-[10px] shrink-0 ${entry.allowed ? "text-emerald-400" : "text-amber-400"}`}>
                  {entry.allowed ? "Allowed" : "Blocked"}
                </span>
              </div>
            ))}
            <div className="px-4 py-3 text-center">
              <p className="text-[10px] text-muted-foreground">Audit log kept locally · never uploaded</p>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts */}
      <div className="mt-6">
        <button
          onClick={() => setShowShortcuts(s => !s)}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-3.5 h-3.5 text-muted-foreground/60" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Keyboard Shortcuts</p>
          </div>
          {showShortcuts ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
        </button>
        {showShortcuts && (
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
            {SHORTCUTS.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className="flex items-center gap-1">
                  {s.keys.map((k, j) => (
                    <kbd key={j} className="px-1.5 py-0.5 rounded-md glass text-[11px] font-mono text-muted-foreground">{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Preferences</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: User,      label: "Account & profile" },
            { icon: Bell,      label: "Notifications & alerts" },
            { icon: Volume2,   label: "Voice — pitch, bass, pace" },
            { icon: Palette,   label: "Appearance & theme" },
            { icon: Brain,     label: "Memory settings" },
            { icon: HardDrive, label: "Data & export" },
          ].map(r => (
            <button
              key={r.label}
              onClick={() => toast.info(`${r.label} — coming soon`)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5 transition-colors"
            >
              <r.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-left text-sm">{r.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </button>
          ))}
        </div>
      </div>

      {/* More */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">More</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {MORE_ROWS.map(r => (
            <button
              key={r.label}
              onClick={r.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5 transition-colors ${r.label === "Delete account" ? "text-destructive/70 hover:text-destructive" : ""}`}
            >
              <r.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left text-sm">{r.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
            </button>
          ))}
        </div>
      </div>

      {/* Version footer */}
      <div className="mt-8 text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-primary" style={{ background: 'var(--gradient-orb)' }}>
            <SageLogo size={16} className="text-primary" />
          </div>
          <span className="font-semibold text-sm">Sage</span>
        </div>
        <p className="text-[11px] text-muted-foreground">v0.17.0 · The Reach Release</p>
        <p className="text-[10px] text-muted-foreground/50">Multi-model · Raft network · Background agents</p>
        <p className="text-[10px] text-muted-foreground/50">On-device privacy · Consent ledger · POPIA/GDPR</p>
      </div>
    </div>
  );
}
