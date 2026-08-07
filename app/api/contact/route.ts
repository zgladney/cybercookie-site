import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const reasons = new Set([
  "General inquiry",
  "Aestrea Academy",
  "Astraea Enterprise",
  "Partnership",
  "Support",
]);

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  reason?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MAX_BODY_BYTES = 24 * 1024;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_ORG_LENGTH = 160;
const MAX_REASON_LENGTH = 64;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(request: NextRequest) {
  let body: ContactPayload;
  let rawBody = "";
  try {
    rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Request payload is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const honeypot = cleanString(body.website);
  if (honeypot) {
    // Silently accept honeypot submissions.
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = cleanString(body.name);
  const email = cleanString(body.email).toLowerCase();
  const organization = cleanString(body.organization);
  const reason = cleanString(body.reason);
  const message = cleanString(body.message);

  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  if (name.length > MAX_NAME_LENGTH) return NextResponse.json({ ok: false, error: "Name is too long." }, { status: 400 });
  if (!email || !isValidEmail(email)) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  if (email.length > MAX_EMAIL_LENGTH) return NextResponse.json({ ok: false, error: "Email is too long." }, { status: 400 });
  if (organization.length > MAX_ORG_LENGTH) return NextResponse.json({ ok: false, error: "Organization is too long." }, { status: 400 });
  if (!reasons.has(reason)) return NextResponse.json({ ok: false, error: "Select a valid reason for contact." }, { status: 400 });
  if (reason.length > MAX_REASON_LENGTH) return NextResponse.json({ ok: false, error: "Reason is too long." }, { status: 400 });
  if (message.length < 20) return NextResponse.json({ ok: false, error: "Message must be at least 20 characters." }, { status: 400 });
  if (message.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  console.log({
    hasSupabaseUrl: !!supabaseUrl,
    hasServiceRoleKey: !!serviceRoleKey,
  });
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Contact submission is not fully configured.",
        debug: {
          hasSupabaseUrl: !!supabaseUrl,
          hasServiceRoleKey: !!serviceRoleKey,
        },
      },
      { status: 503 },
    );
  }

  let parsedSupabaseUrl: URL;
  try {
    parsedSupabaseUrl = new URL(supabaseUrl);
  } catch (err) {
    console.error("CONTACT CONFIG ERROR", {
      name: err instanceof Error ? err.name : null,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : null,
      cause: err instanceof Error ? err.cause : null,
    });
    return NextResponse.json(
      { ok: false, error: "NEXT_PUBLIC_SUPABASE_URL is invalid. Expected https://<project>.supabase.co" },
      { status: 503 },
    );
  }

  const normalizedPath = parsedSupabaseUrl.pathname.replace(/\/+$/, "");
  if (normalizedPath === "/rest/v1") {
    console.error("CONTACT CONFIG ERROR", {
      error: "NEXT_PUBLIC_SUPABASE_URL must not include /rest/v1",
      supabaseUrl,
    });
    return NextResponse.json(
      { ok: false, error: "NEXT_PUBLIC_SUPABASE_URL must be https://<project>.supabase.co (no /rest/v1)." },
      { status: 503 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  try {
    const { data, error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      organization: organization || null,
      reason,
      message,
      status: "new",
    });

    if (error) {
      console.error("SUPABASE ERROR", error);
      console.error("SUPABASE DATA", data);
      return NextResponse.json(
        {
          ok: false,
          supabaseError: error,
          data,
        },
        { status: 500 },
      );
    }
  } catch (err) {
    const diagnostic =
      err && typeof err === "object"
        ? {
            ...(err as Record<string, unknown>),
            code: (err as Record<string, unknown>).code ?? null,
            message: (err as Record<string, unknown>).message ?? null,
            details: (err as Record<string, unknown>).details ?? null,
            hint: (err as Record<string, unknown>).hint ?? null,
            status: (err as Record<string, unknown>).status ?? null,
            statusText: (err as Record<string, unknown>).statusText ?? null,
          }
        : err;
    console.error("CONTACT RAW ERROR:", err);
    console.error("CONTACT RAW ERROR JSON:", JSON.stringify(diagnostic, null, 2));

    return NextResponse.json(
      {
        ok: false,
        diagnostic,
        diagnosticType: typeof err,
        isErrorInstance: err instanceof Error,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
