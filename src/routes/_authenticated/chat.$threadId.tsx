import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft, ArrowUp, Mic, Sparkles, Wrench, Globe, Mail, Calendar,
  Image as ImageIcon, Brain, Bot, Loader as Loader2, Cpu, Zap, Wifi,
  Terminal, CircleCheck as CheckCircle2, Shield, AlertTriangle, Copy,
  RotateCcw, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Lock,
  Cloud, Smartphone, MicOff, Volume2
} from "lucide-react";
import { mockReply, makeThreadTitle, type MessagePart } from "@/lib/mockAgent";
import { useVoiceInput, useTTS } from "@/hooks/useVoiceInput";
import { toast } from "sonner";
import { z } from "zod";
import type React from "react";

const searchSchema = z.object({ seed: z.string().optional() });

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  validateSearch: (s) => searchSchema.parse(s),
  component: ChatPage,
});

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts: MessagePart[];
  created_at: string;
};

function ChatPage() {
  const { threadId } = Route.useParams();
  const { seed } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [showReasoning, setShowReasoning] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem("sage_tts") !== "off");
  const [interimText, setInterimText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seedConsumed = useRef(false);

  const { speak, stop: stopTTS, speaking } = useTTS({ rate: 1.05, pitch: 1 });

  const submitRef = useRef<(text: string) => void>(() => {});

  const voice = useVoiceInput({
    onTranscript: (text) => {
      setInterimText("");
      setInput("");
      submitRef.current(text);
    },
    onInterim: (text) => setInterimText(text),
  });

  const { data: thread } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const { data, error } = await supabase.from("threads").select("*").eq("id", threadId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").eq("thread_id", threadId).order("created_at");
      if (error) throw error;
      return data as unknown as Msg[];
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => { inputRef.current?.focus(); }, [threadId]);

  const send = useMutation({
    mutationFn: async (text: string) => {
      const uid = '00000000-0000-0000-0000-000000000000';
      const { error: e1 } = await supabase.from("messages").insert({
        thread_id: threadId, user_id: uid, role: "user", content: text, parts: [{ type: "text", text }],
      });
      if (e1) throw e1;
      if (messages.length === 0) {
        await supabase.from("threads").update({ title: makeThreadTitle(text) }).eq("id", threadId);
      }
      qc.invalidateQueries({ queryKey: ["messages", threadId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
      setThinking(true);
      await new Promise(r => setTimeout(r, 900 + Math.random() * 800));
      const reply = mockReply(text);
      const { error: e2 } = await supabase.from("messages").insert({
        thread_id: threadId, user_id: uid, role: "assistant", content: reply.text, parts: reply.parts,
      });
      if (e2) throw e2;
      setThinking(false);
      qc.invalidateQueries({ queryKey: ["messages", threadId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
      // TTS readback if enabled
      if (ttsEnabled) {
        const textParts = reply.parts.filter(p => p.type === "text").map(p => (p as { type: "text"; text: string }).text).join(" ");
        if (textParts) speak(textParts);
      }
    },
    onError: (e: Error) => { setThinking(false); toast.error(e.message); },
  });

  useEffect(() => {
    if (seed && !seedConsumed.current && messages.length === 0 && !send.isPending) {
      seedConsumed.current = true;
      send.mutate(seed);
      navigate({ to: "/chat/$threadId", params: { threadId }, search: {}, replace: true });
    }
  }, [seed, messages.length, send, navigate, threadId]);

  const submit = useCallback((text: string) => {
    const v = text.trim();
    if (!v || send.isPending) return;
    setInput("");
    setInterimText("");
    send.mutate(v);
  }, [send]);

  // Keep submitRef in sync so voice callback can call the latest version
  useEffect(() => { submitRef.current = submit; }, [submit]);

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleChipClick = (chip: string) => {
    submit(chip);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong px-4 pt-12 pb-3 flex items-center gap-3 border-b border-white/5">
        <Link
          to="/"
          className="w-9 h-9 rounded-full glass flex items-center justify-center -ml-1 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full siri-orb shrink-0" />
            <p className="font-semibold truncate text-sm">{thread?.title ?? "New chat"}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] text-muted-foreground">Multi-model orchestration active</p>
          </div>
        </div>
        <button
          onClick={() => copyMessage(messages.map(m => m.content).join("\n\n"), "all")}
          className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition-transform"
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar pb-48">
        {messages.length === 0 && !thinking && <EmptyState onChip={handleChipClick} />}
        {messages.map(m => (
          <MessageBubble
            key={m.id}
            msg={m}
            showReasoning={showReasoning}
            setShowReasoning={setShowReasoning}
            onCopy={copyMessage}
            copiedId={copiedId}
            onChip={handleChipClick}
          />
        ))}
        {thinking && <ThinkingOrchestrator />}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(input); }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 px-3 z-30 w-full max-w-[480px]"
      >
        <div className="glass-strong rounded-[24px] p-2 flex items-end gap-2 shadow-[var(--shadow-elevated)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
            rows={1}
            placeholder="Ask, delegate, or kick off a workflow…"
            className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-[15px] placeholder:text-muted-foreground max-h-32 leading-snug"
          />
          {/* TTS stop button when speaking */}
          {speaking && (
            <button
              type="button"
              onClick={stopTTS}
              className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 active:scale-90 transition-transform"
              title="Stop speaking"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          {input.trim() ? (
            <button
              type="submit"
              disabled={send.isPending}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform disabled:opacity-50"
              style={{ background: "var(--gradient-hero)" }}
            >
              <ArrowUp className="w-5 h-5 text-primary-foreground" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!voice.supported) { toast.error("Voice input not supported in this browser"); return; }
                voice.toggle();
              }}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all ${voice.isListening ? "bg-rose-500/30 text-rose-400" : "glass"}`}
            >
              {voice.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {voice.isListening && (
                <span className="absolute inset-0 rounded-full border border-rose-400/50 animate-ping pointer-events-none" />
              )}
            </button>
          )}
        </div>
        {/* Live voice feedback */}
        {voice.isListening && (
          <div className="mt-2 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-0.5 items-end h-4">
              {[3,5,7,4,6,3,8,5,4].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-rose-400 rounded-full"
                  style={{ height: `${h * 2}px`, animation: `thinking-bounce 1.2s infinite ease-in-out`, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground flex-1 truncate">
              {interimText || "Listening… tap mic to stop"}
            </span>
          </div>
        )}
        {/* TTS toggle pill */}
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => {
              const next = !ttsEnabled;
              setTtsEnabled(next);
              localStorage.setItem("sage_tts", next ? "on" : "off");
              if (!next) stopTTS();
              toast.success(next ? "Voice readback on" : "Voice readback off");
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] transition-all ${ttsEnabled ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground/40 bg-transparent"}`}
          >
            <Volume2 className="w-2.5 h-2.5" />
            {ttsEnabled ? "Readback on" : "Readback off"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ onChip }: { onChip: (s: string) => void }) {
  const suggestions = [
    { label: "Brief me on my day",       icon: Sparkles, color: "text-amber-400",   prompt: "Brief me on my day" },
    { label: "Research competitors",      icon: Globe,    color: "text-emerald-400", prompt: "Research my top 3 competitors and draft a brief" },
    { label: "Draft an email",            icon: Mail,     color: "text-rose-400",    prompt: "Summarize my unread email and draft replies" },
    { label: "Schedule a meeting",        icon: Calendar, color: "text-cyan-400",    prompt: "Find the best slot for a meeting this week" },
  ];
  return (
    <div className="text-center pt-12">
      <div className="relative w-20 h-20 mx-auto mb-5">
        <div className="w-20 h-20 rounded-full siri-orb shadow-[var(--shadow-glow)]" />
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
      </div>
      <h2 className="text-2xl font-semibold">How can I help?</h2>
      <p className="text-sm text-muted-foreground mt-2 px-8">Ask, delegate, or kick off a workflow. Sub-agents work in the background while you keep moving.</p>
      <div className="grid grid-cols-2 gap-2 mt-8 px-2">
        {suggestions.map(s => (
          <button
            key={s.label}
            onClick={() => onChip(s.prompt)}
            className="glass rounded-2xl p-3.5 text-left active:scale-95 transition-transform"
          >
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
            <p className="text-[12px] text-foreground/80 leading-snug">{s.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Thinking orchestrator ────────────────────────────────────────────────────
function ThinkingOrchestrator() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Cpu,      text: "Analysing intent and routing…",    color: "text-primary"      },
    { icon: Zap,      text: "Delegating to sub-agents…",        color: "text-amber-400"    },
    { icon: Brain,    text: "Retrieving relevant memory…",       color: "text-violet-400"   },
    { icon: Shield,   text: "Privacy routing check…",           color: "text-emerald-400"  },
    { icon: Wifi,     text: "Synthesising multi-model output…", color: "text-cyan-400"     },
  ];
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % steps.length), 1100);
    return () => clearInterval(id);
  }, []);
  const S = steps[step];
  const Icon = S.icon;
  return (
    <div className="flex items-center gap-3 max-w-[90%] animate-in fade-in slide-in-from-bottom-2">
      <div className="w-7 h-7 rounded-full siri-orb shrink-0" />
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
        <Icon className={`w-4 h-4 ${S.color} animate-spin`} />
        <span className="text-sm text-muted-foreground">{S.text}</span>
        <div className="flex gap-0.5 ml-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  msg, showReasoning, setShowReasoning, onCopy, copiedId, onChip
}: {
  msg: Msg;
  showReasoning: string | null;
  setShowReasoning: (id: string | null) => void;
  onCopy: (content: string, id: string) => void;
  copiedId: string | null;
  onChip: (s: string) => void;
}) {
  const [liked, setLiked] = useState<boolean | null>(null);

  if (msg.role === "user") {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-1">
        <div
          className="rounded-[20px] rounded-br-md px-4 py-2.5 max-w-[80%] text-[15px] leading-snug"
          style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}
        >
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 max-w-[96%] animate-in fade-in slide-in-from-bottom-1">
      <div className="w-7 h-7 rounded-full siri-orb shrink-0 mt-1" />
      <div className="flex-1 space-y-2 min-w-0">
        {msg.parts.map((p, i) => (
          <PartView
            key={i}
            part={p}
            msgId={msg.id}
            showReasoning={showReasoning}
            setShowReasoning={setShowReasoning}
            onChip={onChip}
          />
        ))}
        {/* Feedback row */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => { onCopy(msg.content, msg.id); }}
            className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <Copy className="w-3 h-3" />
            {copiedId === msg.id ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => setLiked(v => v === true ? null : true)}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${liked === true ? "text-emerald-400" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => setLiked(v => v === false ? null : false)}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${liked === false ? "text-rose-400" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

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

// ─── Part renderer ─────────────────────────────────────────────────────────────
function PartView({
  part, msgId, showReasoning, setShowReasoning, onChip
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
          className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
        >
          <Brain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] text-muted-foreground flex-1">Reasoning chain · {part.steps.length} steps</span>
          {isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
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
          <Icon className={`w-4 h-4 ${toolColors[part.tool] ?? "text-accent"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium">{part.label}</p>
            {part.status === "done"    && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            {part.status === "running" && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />}
            {part.status === "error"   && <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />}
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
          <Bot className="w-4 h-4 text-primary shrink-0" />
          <p className="text-[13px] font-semibold">{part.name}</p>
          <div className="flex items-center gap-1 ml-auto">
            {part.status === "done"
              ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              : <Loader2 className="w-3 h-3 text-primary animate-spin" />}
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
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-mono text-muted-foreground">{part.filename ?? part.lang}</span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(part.code)}
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
                  <th key={i} className="px-3 py-2 text-left text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
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
        {isDevice ? <Smartphone className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <Cloud className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
        <span>{part.note}</span>
      </div>
    );
  }

  if (part.type === "consent") {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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

// ─── Markdown renderer ─────────────────────────────────────────────────────────
function renderMd(text: string): React.ReactNode {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let codeLines: string[] = [];
  let inCode = false;
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        result.push(
          <div key={i} className="rounded-xl overflow-hidden border border-white/10 my-2">
            <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-sky-400" />
              <span className="text-[10px] font-mono text-muted-foreground">{codeLang || "code"}</span>
            </div>
            <pre className="p-3 text-[12px] font-mono text-emerald-300/90 leading-relaxed overflow-x-auto whitespace-pre">{codeLines.join("\n")}</pre>
          </div>
        );
        inCode = false;
        codeLines = [];
      }
      continue;
    }

    if (inCode) { codeLines.push(line); continue; }

    if (!line.trim()) { result.push(<div key={i} className="h-2" />); continue; }
    if (line.startsWith("### ")) { result.push(<h3 key={i} className="text-[15px] font-bold mt-3 mb-1">{line.slice(4)}</h3>); continue; }
    if (line.startsWith("## "))  { result.push(<h2 key={i} className="text-base font-bold mt-3 mb-1">{line.slice(3)}</h2>); continue; }
    if (line.startsWith("# "))   { result.push(<h1 key={i} className="text-lg font-bold mt-3 mb-1">{line.slice(2)}</h1>); continue; }
    if (line.startsWith("> "))   { result.push(<blockquote key={i} className="border-l-2 border-primary/50 pl-3 my-1 text-foreground/80 italic text-[14px]">{renderInlineMd(line.slice(2))}</blockquote>); continue; }
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      result.push(<div key={i} className="flex gap-2 text-[14px] leading-relaxed"><span className="text-primary/60 mt-0.5 shrink-0">•</span><span>{renderInlineMd(line.slice(2))}</span></div>);
      continue;
    }
    const numberedMatch = line.match(/^(\d+)\. (.+)/);
    if (numberedMatch) {
      result.push(<div key={i} className="flex gap-2 text-[14px] leading-relaxed"><span className="text-primary/60 w-4 shrink-0 text-right">{numberedMatch[1]}.</span><span>{renderInlineMd(numberedMatch[2])}</span></div>);
      continue;
    }
    if (line.startsWith("---")) { result.push(<div key={i} className="border-t border-white/10 my-3" />); continue; }

    result.push(<div key={i} className="text-[15px] leading-relaxed">{renderInlineMd(line)}</div>);
  }
  return <div className="space-y-0.5">{result}</div>;
}

function renderInlineMd(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))   return <code key={i} className="font-mono text-[13px] bg-white/10 px-1 rounded text-emerald-300/90">{p.slice(1, -1)}</code>;
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) return <span key={i} className="text-primary underline">{linkMatch[1]}</span>;
    return <span key={i}>{p}</span>;
  });
}
