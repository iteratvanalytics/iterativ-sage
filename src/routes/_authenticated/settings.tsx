import { createFileRoute } from "@tanstack/react-router";
import {
  User, Bell, ChevronRight, Wifi, Phone, Send, Mail, Shield, Palette,
  Volume2, HardDrive, Brain, Lock, Eye, Zap, Globe, Cpu, Bot,
  CheckCircle2 as CheckCircle, AlertTriangle, ToggleLeft, ToggleRight
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const MODELS = [
  { id: "auto",    label: "Auto-route",         sub: "Sage picks the best model per task",             recommended: true  },
  { id: "claude",  label: "Claude Sonnet 4",    sub: "Best for drafting, email, complex reasoning",    recommended: false },
  { id: "gemini",  label: "Gemini 2.5 Pro",     sub: "Best for code, long context, vision",            recommended: false },
  { id: "o3",      label: "o3",                 sub: "Best for logic, math, structured analysis",      recommended: false },
  { id: "pplx",    label: "Perplexity Sonar",   sub: "Best for live web research",                     recommended: false },
];

const CONSENT_LOG = [
  { action: "Email sent to Maya Chen",           channel: "Gmail",    time: "2m ago",  allowed: true  },
  { action: "Calendar event created",            channel: "Calendar", time: "18m ago", allowed: true  },
  { action: "Competitor Watch — web search",     channel: "Web",      time: "1h ago",  allowed: true  },
  { action: "PR comment attempted",              channel: "GitHub",   time: "3h ago",  allowed: false },
  { action: "Inbox triage — email classified",  channel: "On-device", time: "3h ago", allowed: true  },
];

const PRIVACY_TOGGLES = [
  { id: "ondevice",    label: "Prefer on-device processing", sub: "Route personal data through local models first", defaultOn: true  },
  { id: "consent",     label: "Always confirm before send",  sub: "Every outbound action requires your tap",         defaultOn: true  },
  { id: "analytics",   label: "Send anonymous telemetry",    sub: "Help improve Sage — no personal data included",  defaultOn: false },
  { id: "memorylearn", label: "Learn from conversations",    sub: "Auto-update memory from context",                 defaultOn: true  },
];

function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState("auto");
  const [privacyToggles, setPrivacyToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(PRIVACY_TOGGLES.map(t => [t.id, t.defaultOn]))
  );
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const togglePrivacy = (id: string) => {
    setPrivacyToggles(p => {
      const next = { ...p, [id]: !p[id] };
      toast.success(`${PRIVACY_TOGGLES.find(t => t.id === id)?.label} ${next[id] ? "enabled" : "disabled"}`);
      return next;
    });
  };

  return (
    <div className="px-5 pt-14 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">You</h1>

      {/* Profile card */}
      <div className="glass-strong rounded-3xl p-5 mt-6 flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full siri-orb shadow-[var(--shadow-glow)]" />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">Dev User</p>
          <p className="text-xs text-muted-foreground">Sage Pro · Unlimited · Multi-model</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Model preference */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Default Model</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedModel(m.id); toast.success(`Switched to ${m.label}`); }}
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
                <span className="text-[11px] text-muted-foreground/70 truncate block">{m.sub}</span>
              </div>
              {selectedModel === m.id && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy controls */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Privacy & Trust</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {PRIVACY_TOGGLES.map(t => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{t.sub}</p>
              </div>
              <button
                onClick={() => togglePrivacy(t.id)}
                className="shrink-0 transition-colors"
              >
                {privacyToggles[t.id]
                  ? <ToggleRight className="w-7 h-7 text-emerald-400" />
                  : <ToggleLeft className="w-7 h-7 text-muted-foreground/40" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Integrations</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: Wifi,  label: "Raft Agent Network",        status: "Connected",     color: "text-emerald-400" },
            { icon: Phone, label: "WhatsApp Cloud API",         status: "Not connected", color: "text-muted-foreground" },
            { icon: Send,  label: "Telegram Bot API",           status: "Not connected", color: "text-muted-foreground" },
            { icon: Mail,  label: "Gmail & iMessage Bridge",    status: "Connected",     color: "text-emerald-400" },
          ].map(r => (
            <button key={r.label} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5 transition-colors">
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
          onClick={() => setActiveSection(s => s === "consent" ? null : "consent")}
          className="w-full flex items-center justify-between mb-3"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Consent & Audit Log</p>
          <ChevronRight className={`w-4 h-4 text-muted-foreground/40 transition-transform ${activeSection === "consent" ? "rotate-90" : ""}`} />
        </button>

        {activeSection === "consent" && (
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2">
            {CONSENT_LOG.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                {entry.allowed
                  ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
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

      {/* Preferences */}
      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Preferences</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: User,      label: "Account & profile"        },
            { icon: Bell,      label: "Notifications & alerts"   },
            { icon: Volume2,   label: "Voice — pitch, bass, pace"},
            { icon: Palette,   label: "Appearance & theme"       },
            { icon: Brain,     label: "Memory settings"          },
            { icon: HardDrive, label: "Data & export"            },
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

      {/* Version */}
      <div className="mt-8 text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full siri-orb" />
          <span className="font-semibold text-sm">Sage</span>
        </div>
        <p className="text-[11px] text-muted-foreground">v0.17.0 · The Reach Release</p>
        <p className="text-[10px] text-muted-foreground/50">Multi-model orchestration · Raft network · Background agents</p>
        <p className="text-[10px] text-muted-foreground/50">On-device privacy routing · Consent ledger · POPIA/GDPR</p>
      </div>
    </div>
  );
}
