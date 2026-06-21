import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, ChevronRight, Wifi, Phone, Send, Mail, Shield, Palette, Volume2, HardDrive } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="px-5 pt-14">
      <h1 className="text-3xl font-semibold tracking-tight">You</h1>

      <div className="glass-strong rounded-3xl p-5 mt-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full siri-orb shadow-[var(--shadow-glow)]" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">Dev User</p>
          <p className="text-xs text-muted-foreground">Sage Pro · Unlimited · Multi-model</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Integrations</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: Wifi, label: "Raft Agent Network", status: "Connected", color: "text-emerald-400" },
            { icon: Phone, label: "WhatsApp Cloud API", status: "Not connected", color: "text-muted-foreground" },
            { icon: Send, label: "Telegram Bot API", status: "Not connected", color: "text-muted-foreground" },
            { icon: Mail, label: "Gmail & iMessage Bridge", status: "Connected", color: "text-emerald-400" },
          ].map(r => (
            <button key={r.label} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5">
              <r.icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm">{r.label}</span>
              <span className={`text-[11px] ${r.color}`}>{r.status}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Preferences</p>
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: User, label: "Account & profile" },
            { icon: Bell, label: "Notifications & alerts" },
            { icon: Volume2, label: "Voice — pitch, bass, pace" },
            { icon: Shield, label: "Privacy & sandboxing" },
            { icon: Palette, label: "Appearance & theme" },
            { icon: HardDrive, label: "Data & export" },
          ].map(r => (
            <button key={r.label} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5">
              <r.icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm">{r.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center space-y-1">
        <p className="text-[11px] text-muted-foreground">Sage v0.17.0 — The Reach Release</p>
        <p className="text-[10px] text-muted-foreground/60">Multi-model orchestration · Raft network · Background agents</p>
      </div>
    </div>
  );
}
