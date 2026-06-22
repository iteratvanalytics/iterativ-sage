import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/lib/auth";

function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const guard = async () => {
      // Onboarding gate (runs in every mode).
      if (!localStorage.getItem("sage_onboarded")) {
        navigate({ to: "/onboarding" });
        return;
      }
      // Auth gate only applies when a real Supabase project is connected.
      // In demo mode there is no session, so we skip it to keep the app usable.
      if (isSupabaseConfigured()) {
        const { data } = await supabase.auth.getSession();
        if (!cancelled && !data.session) {
          navigate({ to: "/auth", replace: true });
        }
      }
    };

    guard();
    return () => { cancelled = true; };
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
