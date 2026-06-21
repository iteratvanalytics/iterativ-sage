import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ArrowUp, Mic, Sparkles, Wrench, Globe, Mail, Calendar, Image as ImageIcon, Brain, Bot } from "lucide-react";
import { mockReply, makeThreadTitle, type MessagePart } from "@/lib/mockAgent";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seedConsumed = useRef(false);

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
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
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

  const submit = (text: string) => {
    const v = text.trim();
    if (!v || send.isPending) return;
    setInput("");
    send.mutate(v);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-30 glass-strong px-4 pt-12 pb-3 flex items-center gap-3">
        <Link to="/" className="w-9 h-9 rounded-full glass flex items-center justify-center -ml-1">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full siri-orb" />
            <p className="font-semibold truncate">{thread?.title ?? "New chat"}</p>
          </div>
          <p className="text-[11px] text-muted-foreground">Aria · routing to best model</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar pb-40">
        {messages.length === 0 && !thinking && <EmptyState />}
        {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
        {thinking && <ThinkingBubble />}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); submit(input); }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 px-3 z-30 w-full max-w-[480px]"
      >
        <div className="glass-strong rounded-[24px] p-2 flex items-end gap-2 shadow-[var(--shadow-elevated)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
            rows={1}
            placeholder="Ask Aria anything…"
            className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-[15px] placeholder:text-muted-foreground max-h-32"
          />
          {input.trim() ? (
            <button type="submit" disabled={send.isPending} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--gradient-hero)" }}>
              <ArrowUp className="w-5 h-5 text-primary-foreground" />
            </button>
          ) : (
            <button type="button" className="w-10 h-10 rounded-full glass flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center pt-16">
      <div className="w-20 h-20 rounded-full mx-auto mb-5 siri-orb" />
      <h2 className="text-2xl font-semibold">How can I help?</h2>
      <p className="text-sm text-muted-foreground mt-2 px-8">Ask, delegate, or kick off a workflow. I'll keep working in the background.</p>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex items-center gap-2 max-w-[85%]">
      <div className="w-6 h-6 rounded-full siri-orb shrink-0" />
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-foreground thinking-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-foreground thinking-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-foreground thinking-dot" />
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="rounded-[20px] rounded-br-md px-4 py-2.5 max-w-[80%] text-[15px] leading-snug" style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}>
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 max-w-[92%]">
      <div className="w-6 h-6 rounded-full siri-orb shrink-0 mt-1" />
      <div className="flex-1 space-y-2">
        {msg.parts.map((p, i) => <PartView key={i} part={p} />)}
      </div>
    </div>
  );
}

const toolIcons: Record<string, typeof Globe> = {
  web: Globe, gmail: Mail, calendar: Calendar, image: ImageIcon, memory: Brain, reason: Sparkles,
};

function PartView({ part }: { part: MessagePart }) {
  if (part.type === "text") {
    return <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{renderMd(part.text)}</div>;
  }
  if (part.type === "tool") {
    const Icon = toolIcons[part.tool] ?? Wrench;
    return (
      <div className="glass rounded-2xl px-3 py-2.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl glass flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium">{part.label}</p>
          {part.result && <p className="text-xs text-muted-foreground truncate mt-0.5">{part.result}</p>}
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{part.status}</span>
      </div>
    );
  }
  return (
    <div className="rounded-2xl p-3 border border-primary/30" style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 280 / 0.12), oklch(0.78 0.16 200 / 0.08))" }}>
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4 text-primary" />
        <p className="text-[13px] font-semibold">{part.name}</p>
        <span className="text-[10px] text-muted-foreground ml-auto uppercase tracking-wider">sub-agent · {part.status}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{part.goal}</p>
    </div>
  );
}

function renderMd(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-primary/60 pl-3 my-1 text-foreground/90 italic">{line.slice(2)}</blockquote>;
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => p.startsWith("**") && p.endsWith("**") ? <strong key={j}>{p.slice(2, -2)}</strong> : <span key={j}>{p}</span>);
    return <div key={i}>{parts.length ? parts : <>&nbsp;</>}</div>;
  });
}