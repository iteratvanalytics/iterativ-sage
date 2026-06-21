import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Brain, Plus, Trash2, Search, Tag, Network, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/memory")({
  component: MemoryPage,
});

const CATEGORIES = ["general", "preferences", "people", "projects", "workflows", "knowledge"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  general: "text-primary",
  preferences: "text-amber-400",
  people: "text-rose-400",
  projects: "text-emerald-400",
  workflows: "text-cyan-400",
  knowledge: "text-fuchsia-400",
};

function MemoryPage() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("general");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data: memories = [] } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("memories").insert({ user_id: '00000000-0000-0000-0000-000000000000', content: content.trim(), category });
      if (error) throw error;
    },
    onSuccess: () => { setContent(""); qc.invalidateQueries({ queryKey: ["memories"] }); toast.success("Saved to memory"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("memories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
  });

  const filtered = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = !search || m.content.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === "all" || m.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [memories, search, activeFilter]);

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    memories.forEach(m => { byCategory[m.category] = (byCategory[m.category] || 0) + 1; });
    return byCategory;
  }, [memories]);

  return (
    <div className="px-5 pt-14">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Persistent Knowledge</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Memory</h1>
      <p className="text-sm text-muted-foreground mt-2">What Aria remembers about you across every conversation.</p>

      <div className="flex gap-3 mt-5">
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold">{memories.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Memories</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{Object.keys(stats).length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Categories</p>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); if (content.trim()) add.mutate(); }} className="glass-strong rounded-2xl p-3 mt-6 space-y-2">
        <Input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="e.g. I prefer email replies under 4 sentences"
          className="bg-transparent border-0 h-11"
        />
        <div className="flex gap-2">
          <select value={category} onChange={e => setCategory(e.target.value as never)} className="flex-1 h-10 rounded-xl glass bg-transparent px-3 text-sm outline-none">
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-popover">{c}</option>)}
          </select>
          <Button type="submit" disabled={!content.trim() || add.isPending} className="h-10 rounded-xl px-4" style={{ background: "var(--gradient-hero)", color: "var(--primary-foreground)" }}>
            <Plus className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </form>

      <div className="relative mt-5 mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search memory" className="h-10 rounded-2xl glass border-0 pl-9" />
      </div>

      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-[10px] font-medium capitalize whitespace-nowrap transition-all ${activeFilter === "all" ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium capitalize whitespace-nowrap transition-all flex items-center gap-1 ${activeFilter === c ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[c].replace("text-", "bg-")}`} />
            {c} {stats[c] ? `(${stats[c]})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-3 opacity-50" />
            {search ? "No memories match your search." : "Nothing remembered yet."}
          </div>
        )}
        {filtered.map(m => (
          <div key={m.id} className="glass rounded-2xl p-3 flex items-start gap-3 group">
            <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0 ${CATEGORY_COLORS[m.category]}`}>
              <Brain className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] uppercase tracking-wider font-medium ${CATEGORY_COLORS[m.category]}`}>{m.category}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(m.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
              </div>
              <p className="text-sm">{m.content}</p>
            </div>
            <button
              onClick={() => del.mutate(m.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive active:bg-destructive/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
