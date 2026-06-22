import { useState, useEffect, useRef } from "react";
import {
  Video, X, Shield, CheckCircle2, AlertTriangle, Mic, MicOff,
  Camera, CameraOff, Eye, Clock, Users, FileText, Send,
  ChevronRight, Loader2, Wifi, Bot, Zap, Download, Brain
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
type Platform = "zoom" | "meet" | "teams" | "webex" | "unknown";
type Stage = "idle" | "authorizing" | "connecting" | "live" | "done";

type TranscriptLine = {
  id: number;
  speaker: string;
  text: string;
  ts: string;
  isAction?: boolean;
};

// ─── Mock transcript ─────────────────────────────────────────────────────────
const MOCK_TRANSCRIPT: Omit<TranscriptLine, "id">[] = [
  { speaker: "Host", text: "Alright, let's get started. Quick agenda check — we have 30 minutes.", ts: "0:12" },
  { speaker: "Maya Chen", text: "Perfect. I'll share my screen once Alex joins.", ts: "0:24" },
  { speaker: "Alex", text: "Sorry, two seconds — just joining from mobile.", ts: "0:38" },
  { speaker: "Host", text: "No worries. Let's do a quick intro round. Maya, kick us off?", ts: "0:52" },
  { speaker: "Maya Chen", text: "Sure! I'm the product lead on the AI features side. We're focused on the context layer this quarter.", ts: "1:05" },
  { speaker: "Alex", text: "Engineering. I own the privacy routing stack and the on-device inference pipeline.", ts: "1:18" },
  { speaker: "Host", text: "Great. So — main topic today: should we ship the sub-agent feature in Q3 or wait for the memory layer to stabilise?", ts: "1:34" },
  { speaker: "Maya Chen", text: "I think we ship. Users are asking for it. We can gate it behind a feature flag.", ts: "1:50" },
  { speaker: "Alex", text: "I agree in principle. But the memory layer needs at least 2 more weeks. We've had 3 cold-start failures this week.", ts: "2:10" },
  { speaker: "Host", text: "So: sub-agents ship with memory gated off until stable. Does that work for everyone?", ts: "2:32" },
  { speaker: "Maya Chen", text: "Works for me. Alex, can you own the memory readiness sign-off?", ts: "2:45" },
  { speaker: "Alex", text: "Yes — I'll have a report by Thursday.", ts: "2:58" },
  { speaker: "Host", text: "Noted. Second item: the privacy audit. Where are we on POPIA compliance?", ts: "3:14" },
  { speaker: "Alex", text: "On-device routing is fully compliant. Cloud routing needs one more consent gate — I'm building it this sprint.", ts: "3:28" },
  { speaker: "Host", text: "Good. Any blockers?", ts: "3:40" },
  { speaker: "Alex", text: "Legal is still reviewing the consent copy. Should have it back by Wednesday.", ts: "3:52" },
  { speaker: "Maya Chen", text: "I'll follow up with Legal directly — they sometimes need a nudge.", ts: "4:06" },
  { speaker: "Host", text: "Perfect. Last item: launch positioning. We're aiming for the Reach Release announcement next week.", ts: "4:22" },
  { speaker: "Maya Chen", text: "The blog post draft is done. I need someone to review the technical accuracy section.", ts: "4:38" },
  { speaker: "Alex", text: "Send it to me — I'll review by Tuesday.", ts: "4:50" },
  { speaker: "Host", text: "Great. Let's wrap. Quick summary: sub-agents ship with memory gated, Alex owns readiness report by Thursday, Maya follows up with Legal, Alex reviews blog post by Tuesday.", ts: "5:04" },
  { speaker: "Maya Chen", text: "Thanks everyone — productive as always.", ts: "5:18" },
  { speaker: "Alex", text: "Catch you all Thursday.", ts: "5:22" },
];

const SUMMARY_DECISIONS = [
  "Ship sub-agents in Q3 with memory layer gated behind feature flag",
  "Memory layer needs 2 more weeks — Alex owns the readiness sign-off",
  "One additional consent gate required for cloud routing before POPIA compliance",
];

const SUMMARY_ACTIONS = [
  { owner: "Alex",      task: "Memory layer readiness report",     due: "Thursday"  },
  { owner: "Maya",      task: "Follow up with Legal on consent copy", due: "Today"  },
  { owner: "Alex",      task: "Review blog post technical section", due: "Tuesday"  },
  { owner: "Alex",      task: "Build consent gate for cloud routing", due: "This sprint" },
  { owner: "Host",      task: "Confirm launch date with comms team", due: "Wednesday" },
];

// ─── Platform detection ───────────────────────────────────────────────────────
function detectPlatform(url: string): Platform {
  if (/zoom\.us/i.test(url)) return "zoom";
  if (/meet\.google/i.test(url)) return "meet";
  if (/teams\.microsoft/i.test(url)) return "teams";
  if (/webex\.com/i.test(url)) return "webex";
  return "unknown";
}

const PLATFORM_META: Record<Platform, { label: string; color: string; icon: string }> = {
  zoom:    { label: "Zoom",           color: "text-blue-400 bg-blue-400/15",     icon: "Z" },
  meet:    { label: "Google Meet",    color: "text-emerald-400 bg-emerald-400/15", icon: "M" },
  teams:   { label: "Microsoft Teams",color: "text-indigo-400 bg-indigo-400/15", icon: "T" },
  webex:   { label: "Webex",          color: "text-teal-400 bg-teal-400/15",     icon: "W" },
  unknown: { label: "Video meeting",  color: "text-muted-foreground bg-muted/40",icon: "?" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function MeetingAgentSheet({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [connecting, setConnecting] = useState(0);
  const [sendFollowUp, setSendFollowUp] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-detect platform from URL
  useEffect(() => { if (url) setPlatform(detectPlatform(url)); }, [url]);

  // Timer during live
  useEffect(() => {
    if (stage !== "live") return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  // Simulate connecting steps
  useEffect(() => {
    if (stage !== "connecting") return;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setConnecting(step);
      if (step >= 4) {
        clearInterval(id);
        setTimeout(() => setStage("live"), 600);
      }
    }, 700);
    return () => clearInterval(id);
  }, [stage]);

  // Stream transcript lines
  useEffect(() => {
    if (stage !== "live") return;
    if (lineIdx >= MOCK_TRANSCRIPT.length) {
      setTimeout(() => setStage("done"), 1200);
      return;
    }
    const delay = lineIdx === 0 ? 800 : 2400 + Math.random() * 1200;
    const id = setTimeout(() => {
      setTranscript(prev => [...prev, { id: lineIdx, ...MOCK_TRANSCRIPT[lineIdx] }]);
      setLineIdx(i => i + 1);
    }, delay);
    return () => clearTimeout(id);
  }, [stage, lineIdx]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript]);

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const CONNECT_STEPS = ["Connecting to meeting", "Authenticating observer", "Audio capture ready", "Transcription active"];

  const pm = PLATFORM_META[platform];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={stage === "idle" ? onClose : undefined} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] glass-strong rounded-t-3xl shadow-[var(--shadow-elevated)] flex flex-col" style={{ maxHeight: "92vh" }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight">Meeting Agent</h2>
              <p className="text-[11px] text-muted-foreground">Attend on your behalf · silent observer</p>
            </div>
          </div>
          {stage !== "live" && (
            <button onClick={onClose} className="w-8 h-8 rounded-full glass flex items-center justify-center active:scale-90 transition-transform">
              <X className="w-4 h-4" />
            </button>
          )}
          {stage === "live" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-[11px] text-rose-400 font-semibold">LIVE {fmtTime(elapsed)}</span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-10 hide-scrollbar">

          {/* ── IDLE: URL entry ───────────────────────────────────── */}
          {stage === "idle" && (
            <div className="space-y-4">
              {/* What Sage does */}
              <div className="glass rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Sage will</p>
                {[
                  { icon: Eye,       text: "Join as a silent observer — no video, no mic" },
                  { icon: FileText,  text: "Transcribe the meeting in real time, on-device" },
                  { icon: Brain,     text: "Extract decisions, action items, and owners" },
                  { icon: Bot,       text: "Send you a structured summary when it ends" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[13px]">{text}</p>
                  </div>
                ))}
              </div>
              <div className="glass rounded-2xl p-4 space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Sage won't</p>
                {[
                  { icon: Mic,    text: "Speak or unmute in the meeting" },
                  { icon: Camera, text: "Turn on video or share your camera" },
                  { icon: Send,   text: "Send any message without your approval" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-400/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <p className="text-[13px] text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              {/* URL field */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Meeting link</p>
                <div className="flex items-center gap-2 glass rounded-2xl px-4 py-3">
                  {url && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${pm.color}`}>
                      {pm.icon}
                    </div>
                  )}
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Paste Zoom, Meet, or Teams link…"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50"
                  />
                </div>
                {url && platform !== "unknown" && (
                  <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">Detected: <span className={pm.color.split(" ")[0]}>{pm.label}</span></p>
                )}
              </div>

              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-[11px] text-emerald-400/90">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Audio is transcribed on-device — never uploaded. Sage joins as a named observer so participants know it's present.</span>
              </div>

              <button
                disabled={!url.trim()}
                onClick={() => setStage("authorizing")}
                className="w-full py-4 rounded-2xl text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] transition-all"
                style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}
              >
                Continue to authorisation
              </button>
            </div>
          )}

          {/* ── AUTHORIZING: consent gate ─────────────────────────── */}
          {stage === "authorizing" && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-3 ${pm.color}`}>
                  {pm.icon}
                </div>
                <p className="font-semibold">{pm.label} meeting</p>
                <p className="text-[12px] text-muted-foreground mt-1 break-all opacity-60">{url}</p>
              </div>

              {/* Explicit permission list */}
              <div className="glass rounded-2xl divide-y divide-white/5">
                <p className="px-4 pt-4 pb-2 text-[10px] text-muted-foreground uppercase tracking-wider">You are authorising Sage to</p>
                {[
                  { label: "Join the meeting as 'Sage (Observer)'",               allowed: true  },
                  { label: "Capture and transcribe audio locally",                 allowed: true  },
                  { label: "Extract decisions and action items from transcript",   allowed: true  },
                  { label: "Store the transcript on-device only",                 allowed: true  },
                  { label: "Draft a follow-up email (you approve before it sends)",allowed: true  },
                  { label: "Unmute, speak, or send messages",                     allowed: false },
                  { label: "Record or upload audio to any cloud service",         allowed: false },
                  { label: "Share any content from the meeting externally",       allowed: false },
                ].map(p => (
                  <div key={p.label} className="flex items-center gap-3 px-4 py-3">
                    {p.allowed
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <p className={`text-[13px] flex-1 ${p.allowed ? "" : "text-muted-foreground line-through"}`}>{p.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStage("idle")}
                  className="flex-1 glass rounded-2xl py-3.5 text-sm text-muted-foreground"
                >
                  Back
                </button>
                <button
                  onClick={() => setStage("connecting")}
                  className="flex-1 rounded-2xl py-3.5 text-sm font-semibold active:scale-[0.99] transition-transform"
                  style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}
                >
                  Authorise &amp; join
                </button>
              </div>
            </div>
          )}

          {/* ── CONNECTING ───────────────────────────────────────── */}
          {stage === "connecting" && (
            <div className="flex flex-col items-center py-8 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full siri-orb opacity-80" />
                <div className="absolute inset-2 rounded-full bg-background/60 flex items-center justify-center">
                  <Wifi className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="w-full space-y-2">
                {CONNECT_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3 px-4 py-3 rounded-xl glass">
                    {connecting > i
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      : connecting === i
                        ? <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                        : <div className="w-4 h-4 rounded-full border border-muted-foreground/30 shrink-0" />}
                    <span className={`text-sm ${connecting >= i ? "text-foreground" : "text-muted-foreground/50"}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LIVE ─────────────────────────────────────────────── */}
          {stage === "live" && (
            <div className="space-y-3">
              {/* Meeting info bar */}
              <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${pm.color}`}>{pm.icon}</div>
                  <div>
                    <p className="text-[12px] font-medium">{pm.label}</p>
                    <p className="text-[10px] text-muted-foreground">Silent observer · on-device</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{Math.min(3, Math.floor(lineIdx / 4) + 2)}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtTime(elapsed)}</div>
                </div>
              </div>

              {/* Status chips */}
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px]">
                  <MicOff className="w-3 h-3" /><span>Muted</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-400/10 text-rose-400 text-[10px]">
                  <CameraOff className="w-3 h-3" /><span>No video</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px]">
                  <Zap className="w-3 h-3" /><span>Transcribing</span>
                </div>
              </div>

              {/* Live transcript */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Live transcript</p>
                <div
                  ref={transcriptRef}
                  className="glass rounded-2xl p-3 space-y-2 overflow-y-auto hide-scrollbar"
                  style={{ maxHeight: "240px" }}
                >
                  {transcript.map(line => (
                    <div key={line.id} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0 mt-0.5">{line.ts}</span>
                      <div className="flex-1">
                        <span className="text-[10px] font-semibold text-primary">{line.speaker} </span>
                        <span className="text-[12px] text-foreground/80">{line.text}</span>
                      </div>
                    </div>
                  ))}
                  {lineIdx < MOCK_TRANSCRIPT.length && (
                    <div className="flex gap-1 pt-1 pl-10">
                      {[0,1,2].map(i => (
                        <div key={i} className="thinking-dot w-1 h-1 rounded-full bg-primary/60" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Leave button */}
              <button
                onClick={() => {
                  setStage("done");
                  setTranscript(MOCK_TRANSCRIPT.map((l, i) => ({ id: i, ...l })));
                }}
                className="w-full py-3 rounded-2xl text-sm text-rose-400 border border-rose-400/20 bg-rose-400/5 active:scale-[0.99] transition-transform"
              >
                Leave meeting early
              </button>
            </div>
          )}

          {/* ── DONE ─────────────────────────────────────────────── */}
          {stage === "done" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/15 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="font-semibold text-lg">Meeting complete</p>
                <div className="flex items-center justify-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                  <span><Clock className="w-3 h-3 inline mr-0.5" />{fmtTime(Math.max(elapsed, 325))}</span>
                  <span>·</span>
                  <span><Users className="w-3 h-3 inline mr-0.5" />3 speakers</span>
                  <span>·</span>
                  <span><FileText className="w-3 h-3 inline mr-0.5" />{MOCK_TRANSCRIPT.length} lines</span>
                </div>
              </div>

              {/* Decisions */}
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Key decisions</p>
                <ul className="space-y-2">
                  {SUMMARY_DECISIONS.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[13px] leading-snug">{d}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action items */}
              <div className="glass rounded-2xl overflow-hidden">
                <p className="px-4 pt-4 pb-2 text-[10px] text-muted-foreground uppercase tracking-wider">Action items</p>
                <div className="divide-y divide-white/5">
                  {SUMMARY_ACTIONS.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-primary">{a.owner[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] truncate">{a.task}</p>
                        <p className="text-[10px] text-muted-foreground">{a.owner}</p>
                      </div>
                      <span className="text-[10px] text-amber-400 shrink-0">{a.due}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up email consent */}
              {!sendFollowUp ? (
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-medium">Send follow-up to all attendees?</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Summary + action items with owners — requires your approval</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toast.info("Follow-up skipped")} className="flex-1 glass rounded-xl py-2.5 text-sm text-muted-foreground">
                      Skip
                    </button>
                    <button
                      onClick={() => { setSendFollowUp(true); toast.success("Follow-up sent to 3 attendees"); }}
                      className="flex-1 rounded-xl py-2.5 text-sm font-medium active:scale-[0.99]"
                      style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}
                    >
                      Send follow-up
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[12px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Follow-up sent to Host, Maya Chen, and Alex</span>
                </div>
              )}

              {/* Export + save */}
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success("Transcript saved to Memory")}
                  className="flex-1 glass rounded-xl py-3 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
                >
                  <Brain className="w-3.5 h-3.5" /> Save to Memory
                </button>
                <button
                  onClick={() => toast.success("Transcript exported")}
                  className="flex-1 glass rounded-xl py-3 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>

              <button onClick={onClose} className="w-full glass rounded-2xl py-3.5 text-sm font-medium">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
