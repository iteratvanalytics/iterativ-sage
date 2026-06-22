import { useRef, useEffect } from "react";
import { ArrowUp, Mic, MicOff, Volume2 } from "lucide-react";

type VoiceLike = { supported: boolean; isListening: boolean; toggle: () => void };

export function ChatInput({
  value, onChange, onSubmit, disabled, focusKey,
  voice, interimText, onVoiceUnsupported,
  ttsEnabled, onToggleTts, speaking, onStopTts,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (text: string) => void;
  disabled: boolean;
  focusKey?: string;
  voice: VoiceLike;
  interimText: string;
  onVoiceUnsupported: () => void;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  speaking: boolean;
  onStopTts: () => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, [focusKey]);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 px-3 z-30 w-full max-w-[480px]"
      aria-label="Send a message"
    >
      <div className="glass-strong rounded-[24px] p-2 flex items-end gap-2 shadow-[var(--shadow-elevated)]">
        <label htmlFor="chat-input" className="sr-only">Message Sage</label>
        <textarea
          id="chat-input"
          ref={inputRef}
          value={value}
          onChange={e => {
            onChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
          }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(value); } }}
          rows={1}
          placeholder="Ask, delegate, or kick off a workflow…"
          className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-[15px] placeholder:text-muted-foreground max-h-32 leading-snug"
        />
        {speaking && (
          <button
            type="button"
            onClick={onStopTts}
            className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            aria-label="Stop voice readback"
            title="Stop speaking"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        {value.trim() ? (
          <button
            type="submit"
            disabled={disabled}
            aria-label="Send message"
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-transform disabled:opacity-50"
            style={{ background: "var(--gradient-hero)" }}
          >
            <ArrowUp className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!voice.supported) { onVoiceUnsupported(); return; }
              voice.toggle();
            }}
            aria-label={voice.isListening ? "Stop voice input" : "Start voice input"}
            aria-pressed={voice.isListening}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95 transition-all ${voice.isListening ? "bg-rose-500/30 text-rose-400" : "glass"}`}
          >
            {voice.isListening ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
            {voice.isListening && (
              <span className="absolute inset-0 rounded-full border border-rose-400/50 animate-ping pointer-events-none" />
            )}
          </button>
        )}
      </div>
      {voice.isListening && (
        <div className="mt-2 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2" role="status" aria-live="polite">
          <div className="flex gap-0.5 items-end h-4" aria-hidden="true">
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
      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={onToggleTts}
          aria-label="Toggle voice readback"
          aria-pressed={ttsEnabled}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] transition-all ${ttsEnabled ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground/40 bg-transparent"}`}
        >
          <Volume2 className="w-2.5 h-2.5" aria-hidden="true" />
          {ttsEnabled ? "Readback on" : "Readback off"}
        </button>
      </div>
    </form>
  );
}
