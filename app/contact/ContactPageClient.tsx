"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useRef, useState, useEffect } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const ACADEMY_URL = "https://cybercookie.org/academy";

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navItems = [
  ["Home", "/#home"],
  ["Academy", ACADEMY_URL],
  ["Enterprise", "/#enterprise"],
  ["About", "/#about"],
  ["Contact", "/contact"],
] as const;

const reasonOptions = [
  "General inquiry",
  "Aestrea Academy",
  "Astraea Enterprise",
  "Partnership",
  "Support",
] as const;

type Reason = (typeof reasonOptions)[number];

type FormState = {
  name: string;
  email: string;
  organization: string;
  reason: Reason;
  message: string;
  website: string; // honeypot
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters.";
  } else if (values.message.length > 4000) {
    errors.message = "Message is too long.";
  }
  return errors;
}

export function ContactPageClient() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    organization: "",
    reason: "General inquiry",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    function renderWidget() {
      if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      }
    }

    // If the Turnstile script was already loaded (e.g., React StrictMode second run), render immediately.
    if (window.turnstile) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    // ?render=explicit is required for calling window.turnstile.render() manually.
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = renderWidget;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const canSubmit = useMemo(() => status !== "submitting", [status]);

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setStatusMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to send your message right now.");
      }
      setStatus("success");
      setStatusMessage("Thanks for reaching out. We received your message and will follow up soon.");
      setForm({
        name: "",
        email: "",
        organization: "",
        reason: "General inquiry",
        message: "",
        website: "",
      });
      setErrors({});
      setTurnstileToken("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Unable to send your message right now.");
      setTurnstileToken("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <nav className="nav" aria-label="Primary navigation">
          <Link className="brand" href="/#home" aria-label="CyberCookie home">
            <Image className="brand-logo" src="/logo-dark.svg" alt="CyberCookie" width={188} height={36} priority />
          </Link>
          <div className="nav-links">
            {navItems.map(([label, href]) => (
              href.startsWith("/")
                ? <Link key={href} href={href}>{label}</Link>
                : <a key={href} href={href}>{label}</a>
            ))}
          </div>
          <a className="nav-cta" href="mailto:hello@cybercookie.org?subject=CyberCookie%20Beta">Join the beta <Arrow /></a>
        </nav>
      </header>

      <main id="main-content" className="legal-main section-shell">
        <section className="legal-hero" aria-labelledby="contact-heading">
          <div className="eyebrow"><span /> Contact</div>
          <h1 id="contact-heading">Get in touch with CyberCookie</h1>
          <p className="legal-intro">
            Have questions about CyberCookie Academy, Astraea Enterprise, support, or partnerships?
            Send us a message and our team will respond.
          </p>
          <p className="legal-meta">Prefer email? <a href="mailto:hello@cybercookie.org">hello@cybercookie.org</a></p>
        </section>

        <section className="legal-panel contact-form-panel" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading">Contact form</h2>
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="contact-grid">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
              </div>

              <div className="field">
                <label htmlFor="organization">Company / Organization (optional)</label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  value={form.organization}
                  onChange={(e) => setField("organization", e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="reason">Reason for contact</label>
                <select
                  id="reason"
                  name="reason"
                  value={form.reason}
                  onChange={(e) => setField("reason", e.target.value as Reason)}
                >
                  {reasonOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={8}
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && <p id="message-error" className="field-error">{errors.message}</p>}
            </div>

            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
              />
            </div>

            <div className="contact-actions-row">
              {TURNSTILE_SITE_KEY && <div ref={turnstileRef} />}
              <button className="button primary" type="submit" disabled={!canSubmit} aria-busy={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send message"} <Arrow />
              </button>
              <p className="contact-note">We usually respond within 1–2 business days.</p>
            </div>

            {statusMessage && (
              <p className={`form-status ${status === "success" ? "ok" : "error"}`} role="status" aria-live="polite">
                {statusMessage}
              </p>
            )}
          </form>
        </section>
      </main>

      <footer className="section-shell" aria-label="Site footer">
        <div className="footer-main">
          <div><Link className="brand" href="/#home" aria-label="CyberCookie home"><Image className="brand-logo footer-logo" src="/logo-dark.svg" alt="CyberCookie" width={188} height={36} /></Link><p>Practical security for everyone<br />ready to learn.</p></div>
          <div className="footer-links">
            <div><b>PRODUCTS</b><a href={ACADEMY_URL}>Academy</a><Link href="/#enterprise">Astraea</Link><Link href="/#about">About</Link><Link href="/contact">Contact</Link></div>
            <div><b>LEGAL</b><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link></div>
            <div><b>SOCIAL</b><a href="https://github.com/cybercookie" target="_blank" rel="noreferrer" aria-label="CyberCookie on GitHub (opens in a new tab)">GitHub</a><a href="https://www.linkedin.com/company/cybercookie" target="_blank" rel="noreferrer" aria-label="CyberCookie on LinkedIn (opens in a new tab)">LinkedIn</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 CyberCookie</span><span>Learn deeply. Defend thoughtfully.</span></div>
      </footer>
    </>
  );
}
