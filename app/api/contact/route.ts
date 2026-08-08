import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

// In-memory rate limiter: 5 submissions per IP per hour.
// Resets on serverless cold-start; use an external store for stricter enforcement.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

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
  turnstileToken?: unknown;
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
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // Parse body
  let body: ContactPayload;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Request payload is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot
  if (cleanString(body.website)) {
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

  // Cloudflare Turnstile verification (skipped if TURNSTILE_SECRET_KEY is not configured)
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const turnstileToken = cleanString(body.turnstileToken);
    if (!turnstileToken) {
      return NextResponse.json({ ok: false, error: "Verification required." }, { status: 400 });
    }
    try {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecretKey, response: turnstileToken, remoteip: ip }),
      });
      const verification = await verifyRes.json();
      return NextResponse.json({ verification });
    } catch (err) {
      console.error("turnstile verification error", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { ok: false, error: "Unable to send your message right now." },
        { status: 503 },
      );
    }
  }

  // Supabase insert
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { ok: false, error: "Unable to send your message right now." },
      { status: 503 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { error: insertError } = await supabase.from("contact_submissions").insert({
    name,
    email,
    organization: organization || null,
    reason,
    message,
    status: "new",
  });

  if (insertError) {
    console.error("contact_submissions insert failed", {
      message: insertError.message,
      code: insertError.code,
    });
    return NextResponse.json(
      { ok: false, error: "Unable to send your message right now." },
      { status: 500 },
    );
  }

  // Email notifications via Resend — failure does not affect the success response
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await Promise.all([
        resend.emails.send({
          from: "CyberCookie Contact <hello@cybercookie.org>",
          to: "hello@cybercookie.org",
          subject: "New Contact Form Submission",
          text: [
            `Name:\n${name}`,
            `Email:\n${email}`,
            `Organization:\n${organization || "—"}`,
            `Reason:\n${reason}`,
            `Message:\n${message}`,
          ].join("\n\n"),
        }),
        resend.emails.send({
          from: "CyberCookie <hello@cybercookie.org>",
          to: email,
          subject: "We've received your message",
          text: [
            `Hi ${name},`,
            `Thank you for contacting CyberCookie. We've received your message and will get back to you within 1–2 business days.`,
            `Best regards,\nThe CyberCookie Team`,
          ].join("\n\n"),
        }),
      ]);
    } catch (emailErr) {
      console.error("contact email send failed", emailErr instanceof Error ? emailErr.message : emailErr);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
