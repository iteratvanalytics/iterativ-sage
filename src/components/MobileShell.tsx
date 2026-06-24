import { type ReactNode } from "react";
import { BottomTabs } from "./BottomTabs";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full max-w-[480px] mx-auto bg-background overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, #10b981, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #f59e0b, #ec4899, transparent)" }}
        />
      </div>
      <main
        id="main-content"
        className="relative min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]"
      >
        {children}
      </main>
      <BottomTabs />
    </div>
  );
}
