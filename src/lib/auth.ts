import { supabase } from "@/integrations/supabase/client";

/**
 * Fallback user id used when the app runs in demo mode (no Supabase project
 * connected). Matches the `user_id` default created by the dev-bypass migration.
 */
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * True when real Supabase credentials are present. When false the app runs in
 * demo mode: the in-memory client stub backs all queries and auth is skipped.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );
}

/**
 * Resolve the current user id. Uses the authenticated Supabase session when one
 * exists, and falls back to the demo user id otherwise so the UI keeps working
 * without a backend. This replaces the hardcoded id that was scattered across
 * the route files.
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? DEMO_USER_ID;
  } catch {
    return DEMO_USER_ID;
  }
}
