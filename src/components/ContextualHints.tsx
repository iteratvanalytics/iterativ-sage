import { useEffect, useState } from "react";
import { X, Lightbulb } from "lucide-react";

interface Hint {
  id: string;
  text: string;
  action?: { label: string; onClick: () => void };
}

export function useContextualHints() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sage_hints_dismissed");
      if (raw) setDismissed(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = (id: string) => {
    setDismissed((prev) => {
      const next = [...prev, id];
      localStorage.setItem("sage_hints_dismissed", JSON.stringify(next));
      return next;
    });
  };

  return { dismissed, dismiss };
}

export function HintBanner({
  hints,
  onDismiss,
}: {
  hints: Hint[];
  onDismiss: (id: string) => void;
}) {
  if (hints.length === 0) return null;
  return (
    <div className="space-y-2 mb-6">
      {hints.map((hint) => (
        <div
          key={hint.id}
          className="flex items-start gap-3 rounded-2xl px-4 py-3 animate-fade-in-up"
          style={{
            background: "rgba(217, 70, 239, 0.12)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(217, 70, 239, 0.2)",
          }}
        >
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#d946ef" }} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white/80 leading-snug">{hint.text}</p>
            {hint.action && (
              <button
                onClick={hint.action.onClick}
                className="mt-1 text-[12px] font-medium"
                style={{ color: "#d946ef" }}
              >
                {hint.action.label} →
              </button>
            )}
          </div>
          <button
            onClick={() => onDismiss(hint.id)}
            aria-label="Dismiss hint"
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 shrink-0"
            style={{ background: "rgba(255, 255, 255, 0.06)" }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
