-- Create contact_submissions for CyberCookie marketing site contact form persistence
-- Run in Supabase SQL editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NULL,
  reason text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contact_submissions_name_length CHECK (char_length(name) BETWEEN 1 AND 120),
  CONSTRAINT contact_submissions_email_length CHECK (char_length(email) BETWEEN 3 AND 254),
  CONSTRAINT contact_submissions_org_length CHECK (organization IS NULL OR char_length(organization) <= 160),
  CONSTRAINT contact_submissions_reason_length CHECK (char_length(reason) BETWEEN 1 AND 64),
  CONSTRAINT contact_submissions_message_length CHECK (char_length(message) BETWEEN 20 AND 4000)
);

CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
  ON public.contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS contact_submissions_status_idx
  ON public.contact_submissions (status);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Lock down direct client writes.
REVOKE ALL ON TABLE public.contact_submissions FROM anon;
REVOKE ALL ON TABLE public.contact_submissions FROM authenticated;
REVOKE ALL ON TABLE public.contact_submissions FROM PUBLIC;

-- Allow server-side service-role API writes/reads.
GRANT INSERT, SELECT ON TABLE public.contact_submissions TO service_role;

-- Keep explicit policy scope narrow even though service_role bypasses RLS by default.
DROP POLICY IF EXISTS "service role can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "service role can select contact submissions" ON public.contact_submissions;

CREATE POLICY "service role can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service role can select contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO service_role
  USING (true);
