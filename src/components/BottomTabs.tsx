import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Workflow, Sparkles, Brain, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const tabs = [
  { to: "/" as const, icon: MessageCircle, label: "Chats", match: (p: string) => p === "/" || p.startsWith("/chat") },
  { to: "/agents" as const, icon: Workflow, label: "Agents", match: (p: string) => p.startsWith("/agents") },
  { to: "/skills" as const, icon: Sparkles, label: "Skills", match: (p: string) => p.startsWith("/skills") },
  { to: "/memory" as const, icon: Brain, label: "Memory", match: (p: string) => p.startsWith("/memory") },
  { to: "/settings" as const, icon: Settings, label: "You", match: (p: string) => p.startsWith("/settings") },
];

export function BottomTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [activeIndex, setActiveIndex] = useState(0);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const idx = tabs.findIndex(t => t.match(pathname));
    const i = idx === -1 ? 0 : idx;
    setActiveIndex(i);
    const el = itemsRef.current[i];
    if (el && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setPillStyle({
        left: rect.left - container.left + 4,
        width: rect.width - 8,
      });
    }
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 w-full max-w-[480px]">
      <div ref={containerRef} className="relative glass-strong rounded-[28px] px-2 py-2 shadow-[var(--shadow-elevated)] flex items-center justify-between">
        {/* Sliding active pill */}
        <div
          className="absolute top-2 bottom-2 rounded-2xl bg-primary/10 transition-all duration-300 ease-out"
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
          }}
        />
        {tabs.map(({ to, icon: Icon, label, match }, i) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              ref={el => { itemsRef.current[i] = el; }}
              to={to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-all duration-200 z-10",
                active ? "text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"
              )}
            >
              <Icon
                className={cn("w-5 h-5 transition-transform duration-200", active && "scale-110")}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className={cn("text-[10px] font-medium tracking-wide transition-all duration-200", active && "text-foreground")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
