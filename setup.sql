-- ============================================================
-- Fahad Portfolio — Supabase Setup
-- Ye file Supabase Dashboard → SQL Editor me run karein
-- ============================================================

-- 1. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- 2. Visitors table (for live stats)
CREATE TABLE IF NOT EXISTS public.visitors (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT,
  path TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security enable
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- 4. Policies — DROP pehle (re-run safe banane ke liye)
DROP POLICY IF EXISTS "Anyone can send a message" ON public.messages;
DROP POLICY IF EXISTS "Authenticated admins can read messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated admins can update messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated admins can delete messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can log a visit" ON public.visitors;
DROP POLICY IF EXISTS "Authenticated admins can read visits" ON public.visitors;

-- 5. Public INSERT — koi bhi visitor message bhej sakta hai
CREATE POLICY "Anyone can send a message"
  ON public.messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 6. Read/Update/Delete — sirf logged-in admin (aap)
CREATE POLICY "Authenticated admins can read messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can update messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (true);

-- 7. Visitors — public insert, admin read
CREATE POLICY "Anyone can log a visit"
  ON public.visitors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read visits"
  ON public.visitors FOR SELECT
  TO authenticated
  USING (true);

-- ✅ Done! Ab server.js start karein.
