import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId, DEMO_USER_ID } from "@/lib/auth";
import { useDemoMode } from "@/lib/demo-mode";
import { DemoProfileSwitcher } from "@/components/DemoProfileSwitcher";
import { VoiceWaveAnimation } from "@/components/VoiceWaveAnimation";
import { SageLogo } from "@/components/SageLogo";
import { Plus, Search, Sparkles, Globe, Mail, Calendar, MessageSquare, Zap, Bot, Brain, Shield, ArrowRight, ChevronRight, Mic, Video, TriangleAlert as AlertTriangle, CircleUser as UserCircle, Bell, Image, FileText, Headphones, Wand as Wand2, Music, Pen, Image as ImageIcon, X, ArrowUpRight, Clock } from "lucide-react";
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

const STUDIO_CARDS = [
  {
    id: "voice",
    title: "Voice Studio",
    subtitle: "Create Stunning Voice",
    icon: Mic,
    size: "large" as const,
    gradient: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #4a1d6b 100%)",
    waveBars: true,
  },
  {
    id: "image",
    title: "Image Studio",
    subtitle: "Create Stunning Visuals",
    icon: Image,
    size: "small" as const,
    gradient: "none",
  },
  {
    id: "video",
    title: "Video Studio",
    subtitle: "Create Stunning Videos",
    icon: Video,
    size: "small" as const,
    gradient: "none",
  },
];

const RECENT_FILES = [
  {
    id: 1,
    title: "Generate AI Images",
    subtitle: "Create stunning visuals instantly.",
    icon: Wand2,
    color: "#d946ef",
  },
  {
    id: 2,
    title: "Generate AI Videos",
    subtitle: "Transform ideas into videos.",
    icon: Video,
    color: "#8b5cf6",
  },
  {
    id: 3,
    title: "Create Voice Magic",
    subtitle: "Generate unique AI voices.",
    icon: Mic,
    color: "#ec4899",
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
    color: "#d946ef",
  },
];

const QUICK_CHIPS = [
  { label: "Generate Voice", icon: Mic },
  { label: "Generate Image", icon: Image },
  { label: "AI", icon: Sparkles },
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

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="px-5 pt-14 pb-8">
      {/* Header with avatar */}
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
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#1a0a2e]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/50">Welcome</span>
              <span className="text-[11px]">👋</span>
            </div>
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

      {/* Main headline */}
      <h1 className="text-[28px] font-bold tracking-tight leading-tight mb-5">
        <span className="text-white">Your AI Creative</span>
        <br />
        <span className="text-white/60">Journey Starts Up</span>
      </h1>

      {/* Action chips */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar pb-1">
        {QUICK_CHIPS.map((chip) => (
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
        <button
          onClick={() => newThread.mutate(undefined)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-white/80 shrink-0 transition-all duration-200 hover:text-white"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          AI
        </button>
      </div>

      {/* Start Creating */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Start Creating</h2>
      </div>

      {/* Studio Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {/* Voice Studio - Large card spanning full width */}
        <div
          className="col-span-2 relative rounded-3xl overflow-hidden p-5"
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
          {/* Waveform visualization */}
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

      {/* Recent Files */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Files</h2>
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          See All
        </button>
      </div>

      <div className="space-y-2 mb-8">
        {RECENT_FILES.slice(0, showRecent ? RECENT_FILES.length : 3).map((file) => (
          <div
            key={file.id}
            onClick={() => newThread.mutate(file.title)}
            className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
            style={{
              background: "rgba(45, 27, 78, 0.5)",
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
        <span className="text-[11px] text-white/40">{threads.length}</span>
      </div>

      <div className="relative mb-3">
        <Search
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          aria-hidden="true"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search conversations"
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
            style={{ color: "#d946ef" }}
          >
            Retry
          </button>
        </div>
      )}

      <ul className="space-y-2 pb-6">
        {filtered.length === 0 && !isError && (
          <li className="text-sm text-white/40 text-center py-10">
            {q ? "No conversations match your search." : "No conversations yet — start one above."}
          </li>
        )}
        {visibleThreads.map((t) => (
          <li key={t.id}>
            <Link
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              className="block rounded-2xl p-4 active:scale-[0.99] transition-transform"
              style={{
                background: "rgba(45, 27, 78, 0.5)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#d946ef" }}
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
                color: "#d946ef",
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
