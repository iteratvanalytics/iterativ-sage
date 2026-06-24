import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId, DEMO_USER_ID } from "@/lib/auth";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoProfileSwitcher } from "@/components/DemoProfileSwitcher";
import { VoiceWaveAnimation } from "@/components/VoiceWaveAnimation";
import { useContextualHints, HintBanner } from "@/components/ContextualHints";
import { SageLogo } from "@/components/SageLogo";
import {
  Plus,
  Search,
  Sparkles,
  MessageSquare,
  Zap,
  Bot,
  Brain,
  ArrowRight,
  Mic,
  Video,
  TriangleAlert as AlertTriangle,
  CircleUser as UserCircle,
  Bell,
  Image,
  Wand as Wand2,
  Pen,
  Image as ImageIcon,
  X,
  ArrowUpRight,
  Compass,
  Lightbulb,
  Volume2,
  Headphones,
  Send,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { NotificationCenter } from "@/components/NotificationCenter";
import { MeetingAgentSheet } from "@/components/MeetingAgentSheet";
import { HomeSkeleton } from "@/components/SkeletonScreen";
import { relativeTime } from "@/lib/time";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

const QUICK_STARTS = [
  {
    id: "brief",
    label: "Daily Brief",
    icon: Compass,
    prompt: "Brief me on my day",
    color: "#f59e0b",
    desc: "Get a morning summary",
  },
  {
    id: "image",
    label: "Create Image",
    icon: Image,
    prompt: "Generate a stunning image",
    color: "#3b82f6",
    desc: "AI image generation",
  },
  {
    id: "voice",
    label: "Voice Chat",
    icon: Mic,
    prompt: "Let's talk by voice",
    color: "#10b981",
    desc: "Hands-free conversation",
  },
  {
    id: "write",
    label: "Write Something",
    icon: Pen,
    prompt: "Help me write something",
    color: "#06b6d4",
    desc: "Drafts, stories, more",
  },
];

const SUGGESTION_CHIPS = [
  { label: "Generate Voice", icon: Mic },
  { label: "Generate Image", icon: Image },
  { label: "AI Chat", icon: Sparkles },
];

const RECENT_TEMPLATES = [
  {
    id: 1,
    title: "Generate AI Images",
    subtitle: "Create stunning visuals instantly.",
    icon: Wand2,
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Generate AI Videos",
    subtitle: "Transform ideas into videos.",
    icon: Video,
    color: "#06b6d4",
  },
  {
    id: 3,
    title: "Create Voice Magic",
    subtitle: "Generate unique AI voices.",
    icon: Mic,
    color: "#10b981",
  },
  {
    id: 4,
    title: "Write a Story",
    subtitle: "AI-powered creative writing.",
    icon: Pen,
    color: "#a78bfa",
  },
  {
    id: 5,
    title: "Design a Logo",
    subtitle: "Create brand logos with AI.",
    icon: ImageIcon,
    color: "#3b82f6",
  },
];

function getGreeting(name?: string) {
  const h = new Date().getHours();
  const base = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return name ? `${base}, ${name.split(" ")[0]}` : base;
}

function HomePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [showMeetingAgent, setShowMeetingAgent] = useState(false);
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const { isDemoMode, activePersona } = useDemoMode();
  const { dismissed, dismiss } = useContextualHints();
  const PAGE_SIZE = 20;
  const [visible, setVisible] = useState(PAGE_SIZE);

  const {
    data: threads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      const uid = await getCurrentUserId();
      const { data, error } = await supabase
        .from("threads")
        .select("*")
        .eq("user_id", uid)
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  const newThread = useMutation({
    mutationFn: async (seed?: string) => {
      const uid = await getCurrentUserId();
      const { data, error } = await supabase
        .from("threads")
        .insert({
          user_id: uid ?? DEMO_USER_ID,
          title: seed ? seed.slice(0, 40) : "New conversation",
        })
        .select()
        .single();
      if (error) throw error;
      return { id: data.id, seed };
    },
    onSuccess: ({ id, seed }) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: id }, search: seed ? { seed } : {} });
    },
    onError: (e: Error) => toast.error(e.message || "Couldn't start a new conversation."),
  });

  const personaThreads = activePersona?.threads ?? [];
  const displayThreads = isDemoMode
    ? personaThreads.map((t, i) => ({
        id: `demo-${i}`,
        title: t.title,
        preview: t.preview,
        updated_at: t.updated_at,
      }))
    : threads;

  const filtered = useMemo(
    () =>
      displayThreads.filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q.toLowerCase()) ||
          (t.preview ?? "").toLowerCase().includes(q.toLowerCase()),
      ),
    [displayThreads, q],
  );

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q]);

  const visibleThreads = filtered.slice(0, visible);
  const hasConversations = displayThreads.length > 0;

  // Build contextual hints
  const hints: { id: string; text: string; action?: { label: string; onClick: () => void } }[] = [];
  if (!hasConversations && !dismissed.includes("first-chat")) {
    hints.push({
      id: "first-chat",
      text: "Welcome! Tap any card below to start your first AI conversation.",
      action: { label: "Try a quick start", onClick: () => newThread.mutate("Brief me on my day") },
    });
  }

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full overflow-hidden"
              style={{
                background: "var(--gradient-sunset)",
                boxShadow: "0 4px 16px -4px rgba(245, 158, 11, 0.4)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                {activePersona?.profile.name?.charAt(0) ?? "S"}
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0e17]" />
          </div>
          <div>
            <p className="text-[11px] text-white/50">{getGreeting(activePersona?.profile.name)}</p>
            <p className="text-sm font-semibold text-white/90">
              {activePersona?.profile.name ?? "Sage User"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/60"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Bell className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setShowDemoSwitcher(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/60"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <UserCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Contextual hints */}
      <HintBanner hints={hints.filter((h) => !dismissed.includes(h.id))} onDismiss={dismiss} />

      {/* Main headline — different for new vs returning users */}
      {hasConversations ? (
        <h1 className="text-[26px] font-bold tracking-tight leading-tight mb-5">
          <span className="text-white">What would you like</span>
          <br />
          <span className="text-white/60">to create today?</span>
        </h1>
      ) : (
        <div className="mb-6">
          <h1 className="text-[26px] font-bold tracking-tight leading-tight mb-2">
            <span className="text-white">Your AI Creative</span>
            <br />
            <span className="text-white/60">Journey Starts Here</span>
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            Choose a quick start below or type anything to begin creating with AI.
          </p>
        </div>
      )}

      {/* Quick Start Cards — prominent grid for new users */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {QUICK_STARTS.map((item) => (
          <button
            key={item.id}
            onClick={() => newThread.mutate(item.prompt)}
            className="relative rounded-2xl p-4 text-left active:scale-[0.98] transition-all duration-200 group"
            style={{
              background: "rgba(17, 22, 35, 0.5)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ background: `${item.color}20` }}
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <p className="text-sm font-semibold text-white/90 mb-0.5">{item.label}</p>
            <p className="text-[11px] text-white/40">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Action chips for returning users */}
      {hasConversations && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar pb-1">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => newThread.mutate(chip.label)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white/80 shrink-0 transition-all duration-200 hover:text-white"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <chip.icon className="w-4 h-4" />
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Start Creating */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Start Creating</h2>
      </div>

      {/* Studio Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {/* Voice Studio — large card */}
        <div
          className="col-span-2 relative rounded-3xl overflow-hidden p-5 cursor-pointer"
          onClick={() => newThread.mutate("Let's use voice chat")}
          style={{
            background: "var(--gradient-voice)",
            boxShadow: "0 8px 32px -8px rgba(217, 70, 239, 0.4)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <button className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="relative mb-3">
            <h3 className="text-lg font-semibold text-white mb-1">Voice Studio</h3>
            <p className="text-sm text-white/60">Create Stunning Voice</p>
          </div>
          <div className="flex items-end gap-1 h-10 mt-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = Math.sin(i * 0.5) * 0.5 + 0.5;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${20 + height * 80}%`,
                    background: "rgba(255, 255, 255, 0.3)",
                    minWidth: "2px",
                    maxWidth: "4px",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Image Studio */}
        <div
          onClick={() => newThread.mutate("Generate an image")}
          className="relative rounded-3xl overflow-hidden p-4 cursor-pointer"
          style={{
            background: "rgba(45, 27, 78, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 16px -4px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Image className="w-4 h-4 text-white/70" />
            </div>
            <button className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
          <h3 className="text-sm font-semibold text-white mb-0.5">Image Studio</h3>
          <p className="text-[11px] text-white/40">Create Stunning Visuals</p>
        </div>

        {/* Video Studio */}
        <div
          onClick={() => newThread.mutate("Create a video")}
          className="relative rounded-3xl overflow-hidden p-4 cursor-pointer"
          style={{
            background: "rgba(45, 27, 78, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 16px -4px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Video className="w-4 h-4 text-white/70" />
            </div>
            <button className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
          <h3 className="text-sm font-semibold text-white mb-0.5">Video Studio</h3>
          <p className="text-[11px] text-white/40">Create Stunning Videos</p>
        </div>
      </div>

      {/* Recent Templates */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Popular Templates</h2>
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          {showRecent ? "Show Less" : "See All"}
        </button>
      </div>

      <div className="space-y-2 mb-8">
        {RECENT_TEMPLATES.slice(0, showRecent ? RECENT_TEMPLATES.length : 3).map((file) => (
          <div
            key={file.id}
            onClick={() => newThread.mutate(file.title)}
            className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer active:scale-[0.99] transition-transform"
            style={{
              background: "rgba(17, 22, 35, 0.5)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${file.color}20` }}
            >
              <file.icon className="w-4 h-4" style={{ color: file.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{file.title}</p>
              <p className="text-[11px] text-white/40 truncate">{file.subtitle}</p>
            </div>
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(255, 255, 255, 0.06)" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>
        ))}
      </div>

      {/* Conversations Section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>
        <span className="text-[11px] text-white/40">{threads.length} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          aria-hidden="true"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search your conversations..."
          aria-label="Search conversations"
          className="h-11 rounded-2xl border-0 pl-9 pr-9 text-white placeholder:text-white/30"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(16px)",
          }}
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isError && (
        <div
          className="rounded-2xl p-4 flex items-center gap-3 text-sm mb-3"
          style={{
            background: "rgba(45, 27, 78, 0.6)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-white/60">Couldn't load conversations.</span>
          <button
            onClick={() => refetch()}
            className="text-sm font-medium"
            style={{ color: "#3b82f6" }}
          >
            Retry
          </button>
        </div>
      )}

      <ul className="space-y-2 pb-6">
        {/* Empty state — much more helpful */}
        {filtered.length === 0 && !isError && (
          <li className="text-center py-10">
            {q ? (
              <div>
                <Search className="w-8 h-8 mx-auto mb-3 text-white/20" />
                <p className="text-sm text-white/50">No conversations match "{q}"</p>
                <button
                  onClick={() => setQ("")}
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#3b82f6" }}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-white/15" />
                <p className="text-sm text-white/50 mb-1">No conversations yet</p>
                <p className="text-[11px] text-white/30 mb-4">
                  Tap any card above to start chatting
                </p>
                <button
                  onClick={() => newThread.mutate("Hello, let's chat!")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white glow-button"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  Start First Chat
                </button>
              </div>
            )}
          </li>
        )}

        {visibleThreads.map((t) => (
          <li key={t.id}>
            <Link
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className="block rounded-2xl p-4 active:scale-[0.99] transition-transform"
              style={{
                background: "rgba(17, 22, 35, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#3b82f6" }}
                    aria-hidden="true"
                  />
                  <p className="font-medium text-sm text-white/90 truncate">{t.title}</p>
                </div>
                <span
                  className="text-[10px] text-white/40 shrink-0"
                  title={new Date(t.updated_at).toISOString()}
                >
                  {relativeTime(t.updated_at)}
                </span>
              </div>
              {t.preview && <p className="text-sm text-white/50 truncate mt-1 pl-4">{t.preview}</p>}
            </Link>
          </li>
        ))}
        {filtered.length > visible && (
          <li>
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="w-full rounded-2xl py-3 text-sm font-medium active:scale-[0.99] transition-transform"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                color: "#3b82f6",
              }}
            >
              Load more ({filtered.length - visible} more)
            </button>
          </li>
        )}
      </ul>

      {showMeetingAgent && <MeetingAgentSheet onClose={() => setShowMeetingAgent(false)} />}
      {showDemoSwitcher && <DemoProfileSwitcher onClose={() => setShowDemoSwitcher(false)} />}
    </div>
  );
}
