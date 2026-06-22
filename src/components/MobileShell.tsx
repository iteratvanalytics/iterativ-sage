import { type ReactNode } from "react";
import { BottomTabs } from "./BottomTabs";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full max-w-[480px] mx-auto bg-background overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.72 0.12 165), transparent)" }} />
      </div>
      <main className="relative min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">{children}</main>
      <BottomTabs />
    </div>
  );
}