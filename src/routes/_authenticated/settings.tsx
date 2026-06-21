import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogOut, User, Bell, Lock, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="px-5 pt-14">
      <h1 className="text-3xl font-semibold tracking-tight">You</h1>
      <div className="glass-strong rounded-3xl p-5 mt-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full siri-orb" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{email || "—"}</p>
          <p className="text-xs text-muted-foreground">Aria Pro · ∞ messages</p>
        </div>
      </div>
      <div className="mt-6 glass rounded-2xl overflow-hidden divide-y divide-white/5">
        {[
          { icon: User, label: "Account & profile" },
          { icon: Bell, label: "Notifications & alerts" },
          { icon: Sparkles, label: "Voice — pitch, bass, pace" },
          { icon: Lock, label: "Privacy & sandboxing" },
        ].map(r => (
          <button key={r.label} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5">
            <r.icon className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left text-sm">{r.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <button onClick={signOut} className="w-full mt-6 glass rounded-2xl py-3.5 flex items-center justify-center gap-2 text-destructive">
        <LogOut className="w-4 h-4" /> Sign out
      </button>
      <p className="text-center text-[11px] text-muted-foreground mt-8">Aria · v0.1 prototype</p>
    </div>
  );
}