import { useState, useRef, useCallback, useEffect } from "react";

type VoiceState = "idle" | "listening" | "processing" | "error";

type SRConstructor = new () => SRInstance;
type SRInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((e: SRResultEvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SRResultEvent = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> };
type SRErrorEvent = { error: string };

function getSR(): SRConstructor | undefined {
  const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

type UseVoiceInputOptions = {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  lang?: string;
};

export function useVoiceInput({ onTranscript, onInterim, lang = "en-US" }: UseVoiceInputOptions) {
  const [state, setState] = useState<VoiceState>("idle");
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SRInstance | null>(null);
  const stoppedByUser = useRef(false);

  useEffect(() => {
    setSupported(!!getSR());
  }, []);

  const start = useCallback(() => {
    const SR = getSR();
    if (!SR) { setError("Voice input not supported in this browser"); return; }

    stoppedByUser.current = false;
    setError(null);

    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => setState("listening");

    rec.onresult = (e: SRResultEvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim) onInterim?.(interim);
      if (final) {
        setState("processing");
        onTranscript(final.trim());
      }
    };

    rec.onerror = (e: SRErrorEvent) => {
      if (e.error === "aborted" || stoppedByUser.current) return;
      setError(e.error === "not-allowed" ? "Microphone access denied" : `Voice error: ${e.error}`);
      setState("error");
    };

    rec.onend = () => {
      setState("idle");
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    rec.start();
  }, [lang, onTranscript, onInterim]);

  const stop = useCallback(() => {
    stoppedByUser.current = true;
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  const toggle = useCallback(() => {
    if (state === "listening") stop();
    else start();
  }, [state, start, stop]);

  return { state, supported, error, start, stop, toggle, isListening: state === "listening" };
}

// ─── Text-to-speech ──────────────────────────────────────────────────────────
type UseTTSOptions = { rate?: number; pitch?: number; volume?: number; voice?: string };

export function useTTS({ rate = 1, pitch = 1, volume = 1 }: UseTTSOptions = {}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => "speechSynthesis" in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    // Strip markdown for clean TTS
    const clean = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      .replace(/#+\s/g, "")
      .replace(/>\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .trim();

    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = volume;

    // Pick a good voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith("en") && (v.name.includes("Samantha") || v.name.includes("Google UK") || v.name.includes("Daniel"))
    ) ?? voices.find(v => v.lang.startsWith("en")) ?? null;
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => { setSpeaking(false); utteranceRef.current = null; };
    utter.onerror = () => setSpeaking(false);

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [supported, rate, pitch, volume]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}
