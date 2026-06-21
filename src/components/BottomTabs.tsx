import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Workflow, Sparkles, Brain, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/" as const, icon: MessageCircle, label: "Chats", match: (p: string) => p === "/" || p.startsWith("/chat") },
  { to: "/agents" as const, icon: Workflow, label: "Agents", match: (p: string) => p.startsWith("/agents") },
  { to: "/skills" as const, icon: Sparkles, label: "Skills", match: (p: string) => p.startsWith("/skills") },
  { to: "/memory" as const, icon: Brain, label: "Memory", match: (p: string) => p.startsWith("/memory") },
  { to: "/settings" as const, icon: Settings, label: "You", match: (p: string) => p.startsWith("/settings") },
];

export function BottomTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 px-3 pb-4 pt-2 w-full max-w-[480px]">
      <div className="glass-strong rounded-[28px] px-2 py-2 shadow-[var(--shadow-elevated)] flex items-center justify-between">
        {tabs.map(({ to, icon: Icon, label, match }) => {
          const active = match(pathname);
          return (
            <Link key={to} to={to} className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-all",
              active ? "text-foreground" : "text-muted-foreground"
            )}>
              <Icon className={cn("w-5 h-5 transition-transform", active && "scale-110")} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}