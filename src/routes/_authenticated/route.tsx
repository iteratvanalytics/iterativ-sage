import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

function AuthLayout() {
  // Auth bypassed: render the app shell directly. The home/chat routes fall
  // back to DEMO_USER_ID via getCurrentUserId() when no session exists.
  return (
    <MobileShell>
      <Outlet />
    </MobileShell>
  );
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthLayout,
});
