-- ============================================================
-- FIX RLS — Fahad Portfolio
-- Ye SQL Supabase → SQL Editor me run karein (setup.sql ke baad)
-- ============================================================

-- 1. Roles ko public schema pe USAGE do
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.messages TO anon, authenticated;
GRANT ALL ON TABLE public.visitors TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 2. RLS on
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- 3. Purani policies hatao (safe re-run)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.messages';
  END LOOP;
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'visitors' AND schemaname = 'public') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.visitors';
  END LOOP;
END $$;

-- 4. INSERT — sabke liye (anon + authenticated)
CREATE POLICY "public_insert_messages"
  ON public.messages FOR INSERT
  TO public
  WITH CHECK (true);

-- 5. SELECT/UPDATE/DELETE — sirf authenticated (admin)
CREATE POLICY "admin_select_messages"
  ON public.messages FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "admin_update_messages"
  ON public.messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_messages"
  ON public.messages FOR DELETE
  TO authenticated USING (true);

-- 6. Visitors
CREATE POLICY "public_insert_visitors"
  ON public.visitors FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "admin_select_visitors"
  ON public.visitors FOR SELECT TO authenticated USING (true);

-- ✅ Done. Ab test karein.
