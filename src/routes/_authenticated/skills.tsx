import { createFileRoute } from "@tanstack/react-router";
import { SKILLS } from "@/lib/skills";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/skills")({
  component: SkillsPage,
});

function SkillsPage() {
  const [installed, setInstalled] = useState<Record<string, boolean>>(
    Object.fromEntries(SKILLS.map(s => [s.id, s.installed]))
  );

  const toggle = (id: string) => {
    setInstalled(prev => {
      const next = { ...prev, [id]: !prev[id] };
      toast.success(next[id] ? "Skill installed" : "Skill removed");
      return next;
    });
  };

  return (
    <div className="px-5 pt-14">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Skills Hub</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Skills</h1>
      <p className="text-sm text-muted-foreground mt-2">Reusable workflows that program Aria's behavior. {Object.values(installed).filter(Boolean).length} installed.</p>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {SKILLS.map(s => {
          const on = installed[s.id];
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className="text-left glass rounded-2xl p-4 active:scale-[0.98] transition-transform relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-50 pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${on ? "bg-primary text-primary-foreground" : "glass"}`}>
                    {on ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>
                <p className="font-semibold mt-3">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">{s.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}