import {
  Globe, Mail, Calendar, Image as ImageIcon, Brain, Bot, Loader as Loader2,
  Wifi, Terminal, CircleCheck as CheckCircle2, Shield, TriangleAlert as AlertTriangle,
  ChevronDown, ChevronUp, Lock, Cloud, Smartphone, Sparkles, Wrench, Volume2,
} from "lucide-react";
import type { MessagePart } from "@/lib/mockAgent";
import { renderMd, renderInlineMd } from "./markdown";

const toolIcons: Record<string, typeof Globe> = {
  web: Globe, gmail: Mail, calendar: Calendar, image: ImageIcon,
  memory: Brain, reason: Sparkles, imessage: Wifi, slack: Wrench,
  code: Terminal, volume: Volume2,
};
const toolColors: Record<string, string> = {
  web: "text-emerald-400", gmail: "text-rose-400", calendar: "text-cyan-400",
  image: "text-fuchsia-400", memory: "text-amber-400", reason: "text-primary",
  imessage: "text-green-400", slack: "text-purple-400", code: "text-sky-400",
};

const statusLabel: Record<string, string> = {
  done: "completed", running: "in progress", error: "failed",
};

export function PartView({
  part, msgId, showReasoning, setShowReasoning, onChip,
}: {
  part: MessagePart;
  msgId: string;
  showReasoning: string | null;
  setShowReasoning: (id: string | null) => void;
  onChip: (s: string) => void;
}) {
  if (part.type === "text") {
    return <div className="text-[15px] leading-relaxed">{renderMd(part.text)}</div>;
  }

  if (part.type === "reasoning") {
    const key = `${msgId}-reasoning`;
    const isOpen = showReasoning === key;
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowReasoning(isOpen ? null : key)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Hide" : "Show"} reasoning chain, ${part.steps.length} steps`}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
        >
          <Brain className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="text-[11px] text-muted-foreground flex-1">Reasoning chain · {part.steps.length} steps</span>
          {isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground" aria-hidden="true" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" aria-hidden="true" />}
        </button>
        {isOpen && (
          <div className="px-3 pb-3 space-y-1.5 border-t border-white/5 pt-2">
            {part.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] text-primary font-medium">{i + 1}</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (part.type === "tool") {
    const Icon = toolIcons[part.tool] ?? Wrench;
    return (
      <div className="glass rounded-2xl px-3 py-2.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl glass flex items-center justify-center shrink-0">
          <Icon className={`w-4 h-4 ${toolColors[part.tool] ?? "text-accent"}`} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium">{part.label}</p>
            {part.status === "done"    && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />}
            {part.status === "running" && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" aria-hidden="true" />}
            {part.status === "error"   && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" aria-hidden="true" />}
            <span className="sr-only">Tool {statusLabel[part.status] ?? part.status}</span>
          </div>
          {part.result && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{part.result}</p>}
        </div>
        {part.duration && <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{part.duration}</span>}
      </div>
    );
  }

  if (part.type === "subagent") {
    return (
      <div className="rounded-2xl p-3 border border-primary/20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 280 / 0.08), oklch(0.78 0.16 200 / 0.04))" }}>
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 bg-gradient-to-br from-primary to-accent" />
        <div className="relative flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          <p className="text-[13px] font-semibold">{part.name}</p>
          <div className="flex items-center gap-1 ml-auto">
            {part.status === "done"
              ? <CheckCircle2 className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              : <Loader2 className="w-3 h-3 text-primary animate-spin" aria-hidden="true" />}
            <span className="sr-only">Sub-agent {statusLabel[part.status] ?? part.status}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{part.model}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{part.goal}</p>
        {part.duration && <p className="text-[10px] text-muted-foreground/60 mt-1">Completed in {part.duration}</p>}
      </div>
    );
  }

  if (part.type === "image") {
    return (
      <div className="space-y-2">
        <div className="rounded-2xl overflow-hidden border border-primary/20">
          <img src={part.url} alt={part.caption} className="w-full h-52 object-cover" loading="lazy" />
        </div>
        <p className="text-[11px] text-muted-foreground">{part.caption}</p>
      </div>
    );
  }

  if (part.type === "code") {
    return (
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span className="text-[11px] font-mono text-muted-foreground">{part.filename ?? part.lang}</span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(part.code)}
            aria-label="Copy code"
            className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="p-3 overflow-x-auto">
          <pre className="text-[12px] font-mono text-emerald-300/90 leading-relaxed whitespace-pre">{part.code}</pre>
        </div>
      </div>
    );
  }

  if (part.type === "table") {
    return (
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {part.headers.map((h, i) => (
                  <th key={i} scope="col" className="px-3 py-2 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {part.rows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-muted-foreground leading-relaxed">{renderInlineMd(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (part.type === "privacy") {
    const isDevice = part.routing === "on-device";
    return (
      <div className={`flex items-start gap-2 px-3 py-2 rounded-xl text-[11px] ${isDevice ? "bg-emerald-500/10 text-emerald-400/80" : "bg-amber-500/10 text-amber-400/80"}`}>
        {isDevice ? <Smartphone className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" /> : <Cloud className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />}
        <span><span className="sr-only">{isDevice ? "On-device routing: " : "Cloud routing: "}</span>{part.note}</span>
      </div>
    );
  }

  if (part.type === "consent") {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="text-[12px] font-semibold text-amber-400">Consent required before this action</span>
        </div>
        <p className="text-[13px] font-medium">{part.action}</p>
        {part.detail && <p className="text-[11px] text-muted-foreground mt-0.5">{part.detail}</p>}
        {part.to && <p className="text-[11px] text-muted-foreground">To: {part.to}</p>}
        {part.channel && <p className="text-[11px] text-muted-foreground">Via: {part.channel}</p>}
        {part.reversible === false && <p className="text-[10px] text-amber-400/70 mt-1">⚠ Not reversible once sent</p>}
      </div>
    );
  }

  if (part.type === "actions") {
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {part.chips.map((chip, i) => (
          <button
            key={i}
            onClick={() => onChip(chip.label)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95 ${
              chip.primary
                ? "text-primary-foreground"
                : "glass text-foreground/80 hover:text-foreground"
            }`}
            style={chip.primary ? { background: "var(--gradient-hero)" } : {}}
          >
            {chip.label}
          </button>
        ))}
      </div>
    );
  }

  return null;
}
