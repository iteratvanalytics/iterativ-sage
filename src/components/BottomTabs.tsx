import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Sparkles, Plus, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId, DEMO_USER_ID } from "@/lib/auth";
import { toast } from "sonner";

const tabs = [
  { to: "/" as const, icon: MessageCircle, label: "Chats" },
  { to: "/skills" as const, icon: Sparkles, label: "Create" },
];

export function BottomTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);

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
      setShowMenu(false);
    },
    onError: (e: Error) => toast.error(e.message || "Couldn't start a new conversation."),
  });

  const isChat = pathname === "/" || pathname.startsWith("/chat");

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
        <div className="max-w-[480px] mx-auto">
          <div
            className="relative flex items-center justify-between px-4 py-2 rounded-[32px]"
            style={{
              background: "rgba(17, 22, 35, 0.85)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "0 8px 32px -8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
            }}
          >
            {tabs.map(({ to, icon: Icon, label }) => {
              const active = to === "/" ? isChat : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-200",
                    active ? "text-white" : "text-white/40 hover:text-white/60",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      active && "scale-110",
                    )}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  <span
                    className={cn("text-[10px] font-medium tracking-wide", active && "text-white")}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}

            {/* Center gradient button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="relative -mt-6 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 active:scale-95"
              style={{
                background: "var(--gradient-sunset)",
                boxShadow:
                  "0 4px 24px -4px rgba(245, 158, 11, 0.5), 0 0 0 3px rgba(17, 22, 35, 0.8)",
              }}
              aria-label="New"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--gradient-sunset)",
                  filter: "blur(8px)",
                  opacity: 0.6,
                  zIndex: -1,
                  transform: "scale(1.2)",
                }}
              />
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Center menu popup */}
      {showMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-scale-in">
            <button
              onClick={() => newThread.mutate("Brief me on my day")}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-medium"
              style={{
                background: "rgba(17, 22, 35, 0.95)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span>Morning Brief</span>
            </button>
            <button
              onClick={() => newThread.mutate(undefined)}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-medium"
              style={{
                background: "rgba(17, 22, 35, 0.95)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-sunset)" }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span>New Chat</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
