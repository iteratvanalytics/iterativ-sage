import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
});

const SUGGESTIONS = [
  { label: "Research competitors and draft a brief", icon: "🔎" },
  { label: "Summarize my unread email", icon: "✉️" },
  { label: "Plan my week from my calendar", icon: "🗓️" },
  { label: "Generate a hero image for my deck", icon: "🎨" },
];

function HomePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: threads = [] } = useQuery({
    queryKey: ["threads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("threads").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const newThread = useMutation({
    mutationFn: async (seed?: string) => {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("threads").insert({
        user_id: u.user!.id,
        title: seed ? seed.slice(0, 40) : "New conversation",
      }).select().single();
      if (error) throw error;
      return { id: data.id, seed };
    },
    onSuccess: ({ id, seed }) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: id }, search: seed ? { seed } : {} });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = threads.filter(t => !q || t.title.toLowerCase().includes(q.toLowerCase()) || (t.preview ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Good to see you</p>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">Aria</h1>
        </div>
        <button
          onClick={() => newThread.mutate(undefined)}
          className="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center shadow-[var(--shadow-elevated)]"
          aria-label="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => newThread.mutate(undefined)}
        className="w-full text-left rounded-3xl p-5 mb-6 relative overflow-hidden shadow-[var(--shadow-elevated)]"
        style={{ background: "var(--gradient-card)" }}
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-60 siri-orb" />
        <div className="relative">
          <Sparkles className="w-5 h-5 text-primary mb-3" />
          <h2 className="text-xl font-semibold leading-tight">Ask anything.<br/>Aria will route it to the right model.</h2>
          <p className="text-sm text-muted-foreground mt-2">Sub-agents work in the background while you keep moving.</p>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-2 mb-7">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            onClick={() => newThread.mutate(s.label)}
            className="glass rounded-2xl p-3 text-left active:scale-95 transition-transform"
          >
            <span className="text-lg">{s.icon}</span>
            <p className="text-xs mt-2 leading-snug text-foreground/90">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent</h3>
        <span className="text-xs text-muted-foreground">{threads.length}</span>
      </div>
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search conversations" className="h-10 rounded-2xl glass border-0 pl-9" />
      </div>

      <ul className="space-y-2">
        {filtered.length === 0 && (
          <li className="text-sm text-muted-foreground text-center py-10">No conversations yet. Start one above.</li>
        )}
        {filtered.map(t => (
          <li key={t.id}>
            <Link to="/chat/$threadId" params={{ threadId: t.id }} className="block glass rounded-2xl p-4 active:scale-[0.99] transition-transform">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium truncate">{t.title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(t.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
              </div>
              {t.preview && <p className="text-sm text-muted-foreground truncate mt-1">{t.preview}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}