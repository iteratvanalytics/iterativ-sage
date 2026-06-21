---
name: Supabase demo mode
description: How the app handles missing Supabase credentials without crashing
---

When VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are missing, `src/integrations/supabase/client.ts` returns a stub client (placeholder URL + key) instead of throwing. This lets the full UI render and all static/mock features work.

**Why:** The original code threw on missing env vars, crashing the root component. Stub client approach is safer.

**How to apply:** If Supabase errors reappear after updating the client file, check that the stub branch returns `createClient(...)` with the placeholder URL (not null/undefined).
