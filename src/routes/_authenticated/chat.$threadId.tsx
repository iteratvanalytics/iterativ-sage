import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/lib/auth";
import { useDemoMode } from "@/lib/demo-mode";
import { useEffect, useRef, useState, useCallback } from "react";
import { SageLogo } from "@/components/SageLogo";
import { ChevronLeft, Copy, TriangleAlert as AlertTriangle } from "lucide-react";
import { makeThreadTitle } from "@/lib/mockAgent";
import { generateReply } from "@/lib/chat.functions";
import { useVoiceInput, useTTS } from "@/hooks/useVoiceInput";
import { MessageBubble, type Msg } from "@/components/chat/MessageBubble";
import { EmptyState, ThinkingOrchestrator } from "@/components/chat/ChatStates";
import { ChatInput } from "@/components/chat/ChatInput";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ seed: z.string().optional() });

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  validateSearch: (s) => searchSchema.parse(s),
  component: ChatPage,
});

function readTtsPref(): boolean {
  try {
    return localStorage.getItem("sage_tts") !== "off";
  } catch {
    return true;
  }
}

function ChatPage() {
  const { threadId } = Route.useParams();
  const { seed } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [showReasoning, setShowReasoning] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(readTtsPref);
  const [interimText, setInterimText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const seedConsumed = useRef(false);
  const { isDemoMode, activePersona } = useDemoMode();
  const isDemoThread = threadId.startsWith("demo-");
  const demoThreadIndex = isDemoThread ? parseInt(threadId.replace("demo-", ""), 10) : -1;
  const demoThread = isDemoMode && activePersona && demoThreadIndex >= 0 ? activePersona.threads[demoThreadIndex] : null;

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
      if (isDemoThread) {
        return { id: threadId, title: demoThread?.title ?? "Demo chat", user_id: "demo", created_at: new Date().toISOString() };
      }
      const { data, error } = await supabase.from("threads").select("*").eq("id", threadId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const {
    data: messages = [],
    isError: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      if (isDemoThread && demoThread) {
        return demoThread.messages.map((m, i) => ({
          id: `demo-msg-${i}`,
          thread_id: threadId,
          user_id: "demo",
          role: m.role,
          content: m.content,
          parts: [{ type: "text", text: m.content }],
          created_at: new Date().toISOString(),
        })) as unknown as Msg[];
      }
      const { data, error } = await supabase.from("messages").select("*").eq("thread_id", threadId).order("created_at");
      if (error) throw error;
      return data as unknown as Msg[];
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = useMutation({
    mutationFn: async (text: string) => {
      if (isDemoThread) {
        toast.info("This is a demo conversation — read only. Start a new chat to try Sage.");
        return;
      }
      const uid = await getCurrentUserId();
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

      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const reply = await generateReply({ data: { message: text, history } });

      const { error: e2 } = await supabase.from("messages").insert({
        thread_id: threadId, user_id: uid, role: "assistant", content: reply.text, parts: reply.parts,
      });
      if (e2) throw e2;
      setThinking(false);
      qc.invalidateQueries({ queryKey: ["messages", threadId] });
      qc.invalidateQueries({ queryKey: ["threads"] });

      if (ttsEnabled) {
        const textParts = reply.parts
          .filter((p) => p.type === "text")
          .map((p) => (p as { type: "text"; text: string }).text)
          .join(" ");
        if (textParts) speak(textParts);
      }
    },
    onError: (e: Error) => {
      setThinking(false);
      toast.error(e.message || "Couldn't send your message. Please try again.");
    },
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

  useEffect(() => { submitRef.current = submit; }, [submit]);

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }).catch(() => toast.error("Couldn't copy to clipboard"));
  };

  const handleChipClick = (chip: string) => submit(chip);

  const toggleTts = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    try { localStorage.setItem("sage_tts", next ? "on" : "off"); } catch { /* ignore */ }
    if (!next) stopTTS();
    toast.success(next ? "Voice readback on" : "Voice readback off");
  };

  return (
    <div className="flex flex-col h-screen">
      <a href="#chat-input" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to message input
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong px-4 pt-12 pb-3 flex items-center gap-3 border-b border-white/5">
        <Link
          to="/"
          aria-label="Back to home"
          className="w-9 h-9 rounded-full glass flex items-center justify-center -ml-1 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-primary" style={{ background: 'var(--gradient-orb)' }}>
              <SageLogo size={14} className="text-primary" />
            </div>
            <p className="font-semibold truncate text-sm">{thread?.title ?? "New chat"}</p>
            {isDemoThread && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium shrink-0">Demo</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <p className="text-[10px] text-muted-foreground">Multi-model orchestration active</p>
          </div>
        </div>
        <button
          onClick={() => copyMessage(messages.map(m => m.content).join("\n\n"), "all")}
          aria-label="Copy whole conversation"
          className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-95 transition-transform"
        >
          <Copy className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar pb-48"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messagesError && (
          <div className="glass rounded-2xl p-4 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" aria-hidden="true" />
            <span className="flex-1 text-muted-foreground">Couldn't load messages.</span>
            <button onClick={() => refetchMessages()} className="text-primary text-xs font-medium">Retry</button>
          </div>
        )}
        {messages.length === 0 && !thinking && !messagesError && <EmptyState onChip={handleChipClick} />}
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

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={submit}
        disabled={send.isPending}
        focusKey={threadId}
        voice={{ supported: voice.supported, isListening: voice.isListening, toggle: voice.toggle }}
        interimText={interimText}
        onVoiceUnsupported={() => toast.error("Voice input not supported in this browser")}
        ttsEnabled={ttsEnabled}
        onToggleTts={toggleTts}
        speaking={speaking}
        onStopTts={stopTTS}
      />
    </div>
  );
}
