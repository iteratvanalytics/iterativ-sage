import { createFileRoute } from "@tanstack/react-router";
import { SKILLS, type Skill } from "@/lib/skills";
import { Check, Plus, Zap, Wifi, Circle, ChevronRight, Shield, Lock, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/skills")({
  component: SkillsPage,
});

const CATEGORIES = ["All", "Communication", "Productivity", "Research", "Creative", "Developer", "Data"] as const;

const PERMISSION_LABELS: Record<string, string[]> = {
  gmail:    ["Read email", "Draft replies", "No auto-send"],
  calendar: ["Read events", "Create events", "Update with consent"],
  notion:   ["Read pages", "Create/update pages"],
  web:      ["Live web search", "Non-personal queries only"],
  image:    ["Generate images", "No storage by default"],
  imessage: ["Send with consent", "No access to read messages"],
  whatsapp: ["Send with consent", "Cloud API"],
  telegram: ["Send with consent", "Bot API"],
  slack:    ["Post to channels", "Read with consent"],
  github:   ["Read PRs & issues", "Trigger with consent"],
  crm:      ["Read contacts", "Update with consent"],
  code:     ["Read & write code files", "No network access"],
  db:       ["Query datasets", "Read-only by default"],
  shop:     ["Browse products", "No payment data"],
  zoom:     ["Schedule meetings", "Read recordings"],
  figma:    ["Read designs", "Comment with consent"],
  linear:   ["Read issues", "Create/update with consent"],
  stripe:   ["Read revenue data", "No payment actions"],
  raft:     ["Agent mesh routing", "Encrypted transit"],
};

function SkillsPage() {
  const [skills, setSkills] = useState<Record<string, { installed: boolean; connected: boolean }>>(
    Object.fromEntries(SKILLS.map(s => [s.id, { installed: s.installed, connected: s.connected }]))
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null);

  const toggle = (id: string) => {
    setSkills(prev => {
      const next = { ...prev };
      const s = SKILLS.find(x => x.id === id)!;
      if (!next[id].installed) {
        next[id] = { installed: true, connected: false };
        toast.success(`${s.name} installed`);
      } else if (!next[id].connected) {
        next[id] = { installed: true, connected: true };
        toast.success(`${s.name} connected`);
      } else {
        next[id] = { installed: false, connected: false };
        toast.success(`${s.name} removed`);
      }
      return next;
    });
    setDetailSkill(null);
  };

  const installed = Object.values(skills).filter(s => s.installed).length;
  const connected = Object.values(skills).filter(s => s.connected).length;

  const filtered = SKILLS.filter(s =>
    categoryFilter === "All" || s.category === categoryFilter
  );

  return (
    <div className="px-5 pt-14 pb-8">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Integrations</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Skills Hub</h1>
      <p className="text-sm text-muted-foreground mt-2">Reusable workflows that extend Sage's reach across your stack.</p>

      {/* Stats */}
      <div className="flex gap-3 mt-5">
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold">{installed}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Installed</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{connected}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Connected</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{SKILLS.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Available</p>
        </div>
      </div>

      {/* Privacy note */}
      <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400/90 text-[11px]">
        <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>Every skill is scoped to the minimum permissions it needs. No skill sends data without your consent.</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 mt-5 overflow-x-auto hide-scrollbar pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${categoryFilter === c ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Skill grid */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {filtered.map(s => {
          const state = skills[s.id];
          const on = state.installed;
          const conn = state.connected;
          return (
            <button
              key={s.id}
              onClick={() => setDetailSkill(s)}
              className="text-left glass rounded-2xl p-4 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${on ? (conn ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary") : "glass"}`}>
                    {on ? (conn ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />) : <Plus className="w-4 h-4" />}
                  </div>
                </div>
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <Circle className={`w-1.5 h-1.5 rounded-full ${conn ? "fill-emerald-400 stroke-emerald-400" : on ? "fill-amber-400 stroke-amber-400" : "fill-muted-foreground/30 stroke-muted-foreground/30"}`} />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.model}</p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Custom skill builder card */}
        <button
          onClick={() => toast.info("Custom skill builder coming soon")}
          className="text-left glass rounded-2xl p-4 active:scale-[0.98] transition-all duration-200 relative overflow-hidden border border-dashed border-white/20"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="font-semibold text-sm">Build custom skill</p>
          <p className="text-[11px] text-muted-foreground mt-1">Describe any workflow, Sage scopes the permissions and saves it privately.</p>
        </button>
      </div>

      {/* Skill detail sheet */}
      {detailSkill && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailSkill(null)} />
          <div className="relative w-full max-w-[480px] glass-strong rounded-t-3xl p-5 pb-10 animate-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                  <detailSkill.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{detailSkill.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{detailSkill.category} · {detailSkill.model}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailSkill(null)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{detailSkill.description}</p>

            <div className="mb-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Permissions this skill needs</p>
              <div className="space-y-1.5">
                {(PERMISSION_LABELS[detailSkill.id] ?? ["Read with consent"]).map((perm, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-foreground/80">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    {perm}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400/80 text-[11px] mb-5">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>No data leaves your device without explicit consent for each action.</span>
            </div>

            <button
              onClick={() => toggle(detailSkill.id)}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.99]"
              style={{ background: "var(--gradient-hero)" }}
            >
              {!skills[detailSkill.id]?.installed
                ? `Install ${detailSkill.name}`
                : !skills[detailSkill.id]?.connected
                  ? `Connect ${detailSkill.name}`
                  : `Remove ${detailSkill.name}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
