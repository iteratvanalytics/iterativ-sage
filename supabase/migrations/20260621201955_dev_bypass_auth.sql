/*
# Dev Mode Auth Bypass

1. Purpose
- Opens all RLS policies to allow anonymous access for development.
- Removes user_id ownership constraints so the app works without authentication.

2. Changes
- Tables: threads, messages, memories
- Changes user_id to have a default value (no longer required from client)
- Updates RLS policies to allow both anon and authenticated roles
- Grants access to anon role for all tables
*/

ALTER TABLE public.threads ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.messages ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.memories ALTER COLUMN user_id DROP NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.threads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memories TO anon;

DROP POLICY IF EXISTS "own threads" ON public.threads;
DROP POLICY IF EXISTS "own messages" ON public.messages;
DROP POLICY IF EXISTS "own memories" ON public.memories;

CREATE POLICY "anon_threads" ON public.threads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_threads_insert" ON public.threads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_threads_update" ON public.threads FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_threads_delete" ON public.threads FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "anon_messages" ON public.messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_messages_insert" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_messages_update" ON public.messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_messages_delete" ON public.messages FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "anon_memories" ON public.memories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_memories_insert" ON public.memories FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_memories_update" ON public.memories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_memories_delete" ON public.memories FOR DELETE TO anon, authenticated USING (true);
