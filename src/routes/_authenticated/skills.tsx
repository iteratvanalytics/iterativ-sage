import { createFileRoute } from "@tanstack/react-router";
import { SKILLS } from "@/lib/skills";
import { Check, Plus, Zap, Wifi, Circle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/skills")({
  component: SkillsPage,
});

function SkillsPage() {
  const [skills, setSkills] = useState<Record<string, { installed: boolean; connected: boolean }>>(
    Object.fromEntries(SKILLS.map(s => [s.id, { installed: s.installed, connected: s.connected }]))
  );

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
  };

  const installed = Object.values(skills).filter(s => s.installed).length;
  const connected = Object.values(skills).filter(s => s.connected).length;

  return (
    <div className="px-5 pt-14">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Integrations</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Skills Hub</h1>
      <p className="text-sm text-muted-foreground mt-2">Reusable workflows that program Aria's behavior across your software stack.</p>

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

      <div className="grid grid-cols-2 gap-3 mt-6">
        {SKILLS.map(s => {
          const state = skills[s.id];
          const on = state.installed;
          const connected = state.connected;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="text-left glass rounded-2xl p-4 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${on ? (connected ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary") : "glass"}`}>
                    {on ? (connected ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />) : <Plus className="w-4 h-4" />}
                  </div>
                </div>
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <Circle className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400" : on ? "bg-amber-400" : "bg-muted-foreground/30"}`} />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.model}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
