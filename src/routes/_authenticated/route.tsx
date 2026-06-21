import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => (
    <MobileShell>
      <Outlet />
    </MobileShell>
  ),
});
