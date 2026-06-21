import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Brain, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/memory")({
  component: MemoryPage,
});

const CATEGORIES = ["general", "preferences", "people", "projects"] as const;

function MemoryPage() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("general");

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
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("memories").insert({ user_id: u.user!.id, content: content.trim(), category });
      if (error) throw error;
    },
    onSuccess: () => { setContent(""); qc.invalidateQueries({ queryKey: ["memories"] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("memories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memories"] }),
  });

  return (
    <div className="px-5 pt-14">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Persistent</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-1">Memory</h1>
      <p className="text-sm text-muted-foreground mt-2">What Aria remembers about you across every conversation.</p>

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

      <div className="mt-6 space-y-2">
        {memories.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-3 opacity-50" />
            Nothing remembered yet.
          </div>
        )}
        {memories.map(m => (
          <div key={m.id} className="glass rounded-2xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.category}</p>
              <p className="text-sm mt-0.5">{m.content}</p>
            </div>
            <button onClick={() => del.mutate(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground active:bg-destructive/20">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}