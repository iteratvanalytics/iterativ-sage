import { useNavigate } from "@tanstack/react-router";
import { useDemoMode } from "@/lib/demo-mode";
import { X, CircleCheck as CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
}

export function DemoProfileSwitcher({ onClose }: Props) {
  const { activePersona, setPersona } = useDemoMode();
  const navigate = useNavigate();

  const select = (id: string) => {
    setPersona(id);
    toast.success("Demo profile activated");
    onClose();
    navigate({ to: "/" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] glass-strong rounded-t-3xl p-5 pb-10 animate-in slide-in-from-bottom-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">Try a Persona</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Switch between realistic profiles to explore every feature
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full glass flex items-center justify-center active:scale-90 transition-transform hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {[
            {
              id: "zara-mthembu",
              name: "Zara Mthembu",
              role: "Creative Director, The Brave Collective",
              location: "Johannesburg",
              tag: "Creative workflows",
              color: "from-rose-500/20 to-amber-500/20",
              icon: "🎨",
            },
            {
              id: "thabo-nkosi",
              name: "Thabo Nkosi",
              role: "Senior Engineer, Yoco",
              location: "Cape Town",
              tag: "Code & research",
              color: "from-cyan-500/20 to-emerald-500/20",
              icon: "💻",
            },
            {
              id: "priya-naidoo",
              name: "Dr. Priya Naidoo",
              role: "GP, Life Vincent Pallotti Hospital",
              location: "Durban",
              tag: "Medical & admin",
              color: "from-teal-500/20 to-cyan-500/20",
              icon: "🏥",
            },
            {
              id: "naledi-kgosi",
              name: "Naledi Kgosi",
              role: "Founder, Kgosi Ventures",
              location: "Pretoria",
              tag: "Entrepreneurship",
              color: "from-amber-500/20 to-orange-500/20",
              icon: "🚀",
            },
            {
              id: "simon-vanderberg",
              name: "Simon van der Berg",
              role: "Senior Lecturer, Stellenbosch University",
              location: "Stellenbosch",
              tag: "Teaching & research",
              color: "from-violet-500/20 to-primary/20",
              icon: "📚",
            },
          ].map((p) => {
            const isActive = activePersona?.profile.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => select(p.id)}
                className={`w-full text-left rounded-2xl p-4 transition-all duration-200 active:scale-[0.98] ${
                  isActive ? "bg-primary/10 ring-1 ring-primary/30" : "glass hover:bg-white/[3%]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl shrink-0`}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{p.name}</p>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{p.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground/60">{p.location}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                        {p.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground/50 text-center mt-4">
          Demo data is local only — no real accounts are created or modified
        </p>
      </div>
    </div>
  );
}
