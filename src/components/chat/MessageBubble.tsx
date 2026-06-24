import { useState } from "react";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { SageLogo } from "@/components/SageLogo";
import type { MessagePart } from "@/lib/mockAgent";
import { PartView } from "./PartView";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts: MessagePart[];
  created_at: string;
};

export function MessageBubble({
  msg,
  showReasoning,
  setShowReasoning,
  onCopy,
  copiedId,
  onChip,
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
      <div
        className="flex justify-end animate-in fade-in slide-in-from-bottom-1"
        role="article"
        aria-label="Your message"
      >
        <div
          className="rounded-[20px] rounded-br-md px-4 py-2.5 max-w-[80%] text-[15px] leading-snug"
          style={{ background: "var(--gradient-hero)", color: "#ffffff" }}
        >
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex gap-2 max-w-[96%] animate-in fade-in slide-in-from-bottom-1"
      role="article"
      aria-label="Message from Sage"
    >
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-1"
        style={{ background: "var(--gradient-hero)" }}
      >
        <SageLogo size={16} className="text-white" />
      </div>
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
            onClick={() => {
              onCopy(msg.content, msg.id);
            }}
            aria-label="Copy message"
            className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors"
          >
            <Copy className="w-3 h-3" aria-hidden="true" />
            {copiedId === msg.id ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => setLiked((v) => (v === true ? null : true))}
            aria-label="Good response"
            aria-pressed={liked === true}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${liked === true ? "text-emerald-400" : "text-white/30 hover:text-white/60"}`}
          >
            <ThumbsUp className="w-3 h-3" aria-hidden="true" />
          </button>
          <button
            onClick={() => setLiked((v) => (v === false ? null : false))}
            aria-label="Bad response"
            aria-pressed={liked === false}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${liked === false ? "text-rose-400" : "text-white/30 hover:text-white/60"}`}
          >
            <ThumbsDown className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
