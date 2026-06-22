import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect } from "react";

function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("sage_onboarded")) {
      navigate({ to: "/onboarding" });
    }
  }, [navigate]);

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
