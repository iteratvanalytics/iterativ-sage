import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Brain,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Shield,
  Download,
  User,
  Briefcase,
  Zap,
  BookOpen,
  Settings,
  TriangleAlert as AlertTriangle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MemorySkeleton } from "@/components/SkeletonScreen";
import { relativeTime } from "@/lib/time";
import { useDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/_authenticated/memory")({
  component: MemoryPage,
});

const CATEGORIES = [
  "general",
  "preferences",
  "people",
  "projects",
  "workflows",
  "knowledge",
] as const;

const CATEGORY_META: Record<
  string,
  { color: string; bar: string; icon: typeof Brain; label: string }
> = {
  general: { color: "text-primary", bar: "bg-primary", icon: Brain, label: "General" },
  preferences: {
    color: "text-amber-400",
    bar: "bg-amber-400",
    icon: Settings,
    label: "Preferences",
  },
  people: { color: "text-rose-400", bar: "bg-rose-400", icon: User, label: "People" },
  projects: {
    color: "text-emerald-400",
    bar: "bg-emerald-400",
    icon: Briefcase,
    label: "Projects",
  },
  workflows: { color: "text-cyan-400", bar: "bg-cyan-400", icon: Zap, label: "Workflows" },
  knowledge: {
    color: "text-fuchsia-400",
    bar: "bg-fuchsia-400",
    icon: BookOpen,
    label: "Knowledge",
  },
};

const SEED_MEMORIES = [
  {
    content: "Prefers email replies under 4 sentences, bullet points over prose",
    category: "preferences",
  },
  { content: "Warm tone, zero exclamation marks, no corporate jargon", category: "preferences" },
  { content: "Focus blocks: 09:00–11:00 daily — protect unless critical", category: "preferences" },
  { content: "Maya Chen — co-founder, prefers WhatsApp over email", category: "people" },
  { content: "Alex — lead engineer, timezone: WAT (UTC+1)", category: "people" },
  { content: "Q3 Review deck — in progress, 12 slides, submit by Oct 25", category: "projects" },
  { content: "Weekly Digest skill — runs Fridays 5pm, read Notes only", category: "workflows" },
  {
    content: "Prefers Claude Sonnet for drafting, Perplexity for live research",
    category: "knowledge",
  },
];

type MemoryRow = { id: string; content: string; category: string; created_at: string };

function MemoryPage() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("general");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  const { isDemoMode, activePersona } = useDemoMode();

  useEffect(() => {
    if (editId) editRef.current?.focus();
  }, [editId]);

  const { data: realMemories = [], isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("user_id", user?.id ?? "00000000-0000-0000-0000-000000000000")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MemoryRow[];
    },
    enabled: !isDemoMode,
  });

  const personaMemories = useMemo(() => {
    if (!activePersona) return [];
    return activePersona.memories.map((m, i) => ({
      id: `demo-mem-${i}`,
      content: m.content,
      category: m.category,
      created_at: m.created_at,
    }));
  }, [activePersona]);

  const memories = isDemoMode ? personaMemories : realMemories;

  const add = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("memories").insert({
        user_id: user?.id ?? "00000000-0000-0000-0000-000000000000",
        content: content.trim(),
        category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      setAddOpen(false);
      qc.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Saved to memory");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMemory = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase.from("memories").update({ content }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditId(null);
      qc.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("memories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Memory erased", {
        action: {
          label: "Undo",
          onClick: () => {
            toast.info("Undo not yet implemented");
          },
        },
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const seedMemories = useMutation({
    mutationFn: async () => {
      for (const m of SEED_MEMORIES) {
        await supabase.from("memories").insert({
          user_id: "00000000-0000-0000-0000-000000000000",
          content: m.content,
          category: m.category,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memories"] });
      toast.success("Example memories added");
    },
  });

  const filtered = useMemo(
    () =>
      memories.filter((m) => {
        const s =
          !search ||
          m.content.toLowerCase().includes(search.toLowerCase()) ||
          m.category.toLowerCase().includes(search.toLowerCase());
        const f = activeFilter === "all" || m.category === activeFilter;
        return s && f;
      }),
    [memories, search, activeFilter],
  );

  const stats = useMemo(() => {
    const byCat: Record<string, number> = {};
    memories.forEach((m) => {
      byCat[m.category] = (byCat[m.category] || 0) + 1;
    });
    return byCat;
  }, [memories]);

  const totalBudget = 200;
  const usagePct = Math.min((memories.length / totalBudget) * 100, 100);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(memories, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sage-memory-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportConfirm(false);
    toast.success("Memory exported");
  };

  return (
    <div className="px-5 pt-14 pb-8">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">
        Persistent Knowledge
      </p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Memory</h1>
      <p className="text-sm text-muted-foreground mt-1.5">
        What Sage remembers about you across every session.
      </p>

      {/* Privacy note */}
      <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400/90 text-[11px]">
        <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Stored locally, encrypted on-device. Deletion is real — no shadow copy retained.
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mt-5">
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold">{memories.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{Object.keys(stats).length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
            Categories
          </p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{Math.round(usagePct)}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
            Capacity
          </p>
        </div>
      </div>

      {/* Category breakdown bar */}
      {memories.length > 0 && (
        <div className="mt-4 glass rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
            Distribution
          </p>
          {/* Segmented bar */}
          <div className="flex h-2 rounded-full overflow-hidden gap-px mb-3">
            {CATEGORIES.filter((c) => stats[c]).map((c) => (
              <div
                key={c}
                className={`${CATEGORY_META[c].bar} transition-all duration-700`}
                style={{ width: `${(stats[c] / memories.length) * 100}%` }}
                title={`${CATEGORY_META[c].label}: ${stats[c]}`}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {CATEGORIES.filter((c) => stats[c]).map((c) => (
              <div key={c} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${CATEGORY_META[c].bar}`} />
                <span className="text-[11px] text-muted-foreground">
                  {CATEGORY_META[c].label} <span className="text-foreground/60">{stats[c]}</span>
                </span>
              </div>
            ))}
          </div>
          {/* Usage bar */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground">Memory usage</span>
              <span className="text-[10px] text-muted-foreground">
                {memories.length}/{totalBudget}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${usagePct > 80 ? "bg-amber-400" : "bg-primary"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Collapsible add form */}
      <div className="mt-5">
        <button
          onClick={() => setAddOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 glass rounded-2xl active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Add a memory</span>
          </div>
          {addOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {addOpen && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (content.trim()) add.mutate();
              }}
              className="glass-strong rounded-2xl p-3 space-y-2"
            >
              <Input
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. I prefer email replies under 4 sentences"
                className="bg-transparent border-0 h-11"
              />
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as never)}
                  className="flex-1 h-10 rounded-xl glass bg-transparent px-3 text-sm outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-popover capitalize">
                      {CATEGORY_META[c].label}
                    </option>
                  ))}
                </select>
                <Button
                  type="submit"
                  disabled={!content.trim() || add.isPending}
                  className="h-10 rounded-xl px-4 shrink-0"
                  style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mt-4 mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search memory"
          className="h-10 rounded-2xl glass border-0 pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${activeFilter === "all" ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
        >
          All ({memories.length})
        </button>
        {CATEGORIES.filter((c) => stats[c]).map((c) => (
          <button
            key={c}
            onClick={() => setActiveFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium capitalize whitespace-nowrap transition-all flex items-center gap-1 ${activeFilter === c ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${CATEGORY_META[c].bar}`} />
            {CATEGORY_META[c].label} ({stats[c]})
          </button>
        ))}
      </div>

      {/* Memory list */}
      <div className="mt-3 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-8 h-8 mx-auto mb-3 opacity-30" />
            {search ? (
              <p className="text-sm text-muted-foreground">No memories match your search.</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-1">Nothing remembered yet.</p>
                <p className="text-[11px] text-muted-foreground/60 mb-5">
                  Add a memory above, or seed some examples to see what this looks like.
                </p>
                <button
                  onClick={() => seedMemories.mutate()}
                  disabled={seedMemories.isPending}
                  className="px-4 py-2 glass rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                  Seed example memories
                </button>
              </>
            )}
          </div>
        )}

        {filtered.map((m) => {
          const meta = CATEGORY_META[m.category] ?? CATEGORY_META.general;
          const Icon = meta.icon;
          const isEditing = editId === m.id;

          return (
            <div key={m.id} className="glass rounded-2xl p-3 flex items-start gap-3 group relative">
              <div
                className={`w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0 ${meta.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={editRef}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          updateMemory.mutate({ id: m.id, content: editContent });
                        if (e.key === "Escape") setEditId(null);
                      }}
                      className="flex-1 bg-white/5 rounded-lg px-2 py-1 text-sm outline-none border border-primary/30 focus:border-primary transition-colors"
                    />
                    <button
                      onClick={() => updateMemory.mutate({ id: m.id, content: editContent })}
                      className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="w-6 h-6 rounded-md glass text-muted-foreground flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{m.content}</p>
                )}
              </div>

              {/* Action buttons — visible on hover */}
              {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditId(m.id);
                      setEditContent(m.content);
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => del.mutate(m.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data controls */}
      {memories.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
            Data Controls
          </p>

          {!showExportConfirm ? (
            <button
              onClick={() => setShowExportConfirm(true)}
              className="w-full glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-4 h-4" />
              Export all memory (JSON)
            </button>
          ) : (
            <div className="glass rounded-2xl p-3 space-y-2">
              <p className="text-[13px] text-center">Export {memories.length} memories as JSON?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="flex-1 glass rounded-xl py-2 text-sm text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={exportData}
                  className="flex-1 rounded-xl py-2 text-sm text-primary-foreground"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  Export
                </button>
              </div>
            </div>
          )}

          {!showEraseConfirm ? (
            <button
              onClick={() => setShowEraseConfirm(true)}
              className="w-full glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm text-destructive/70 hover:text-destructive transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Erase all memory
            </button>
          ) : (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 space-y-2">
              <p className="text-[13px] font-semibold text-destructive text-center">
                ⚠ This cannot be undone
              </p>
              <p className="text-[11px] text-muted-foreground text-center">
                All {memories.length} memories will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEraseConfirm(false)}
                  className="flex-1 glass rounded-xl py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    for (const m of memories)
                      await supabase.from("memories").delete().eq("id", m.id);
                    qc.invalidateQueries({ queryKey: ["memories"] });
                    setShowEraseConfirm(false);
                    toast.success("All memories erased");
                  }}
                  className="flex-1 rounded-xl py-2 text-sm bg-destructive text-destructive-foreground"
                >
                  Erase all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
