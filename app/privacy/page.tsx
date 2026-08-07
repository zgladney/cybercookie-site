import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
];

export const metadata: Metadata = {
  title: "Privacy Policy | CyberCookie",
  description:
    "CyberCookie Privacy Policy for our cybersecurity education platform and enterprise cybersecurity software services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
        <section className="legal-hero" aria-labelledby="privacy-heading">
          <div className="eyebrow"><span /> Legal</div>
          <h1 id="privacy-heading">Privacy Policy</h1>
          <p className="legal-meta">Effective date: August 7, 2026</p>
          <p className="legal-intro">
            CyberCookie, LLC (&quot;CyberCookie,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides cybersecurity education services
            (including CyberCookie Academy) and cybersecurity software for organizations (including Astraea). This Privacy
            Policy explains how we collect, use, disclose, and protect personal information when you use our websites,
            applications, and related services.
          </p>
        </section>

        <section className="legal-panel">
          <h2>1. Information we collect</h2>
          <p>We collect information you provide directly, information generated while using our services, and limited technical data collected automatically.</p>
          <h3>Information you provide</h3>
          <ul>
            <li>Contact details such as name, email address, company name, and role.</li>
            <li>Account details such as login credentials and profile information.</li>
            <li>Communications you send to us, including support and beta inquiries.</li>
          </ul>
          <h3>Information generated through service use</h3>
          <ul>
            <li>Learning and progression data in Academy (for example training history, submitted answers, and completion status).</li>
            <li>Configuration and usage data in Astraea required to provide defensive security workflows and reporting.</li>
          </ul>
          <h3>Automatically collected information</h3>
          <ul>
            <li>Device and browser metadata, IP address, timestamps, and basic diagnostics required to secure and operate our services.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>2. How we use information</h2>
          <ul>
            <li>Provide, maintain, and improve our education and software services.</li>
            <li>Authenticate users, secure accounts, and prevent abuse.</li>
            <li>Respond to support requests and communicate service updates.</li>
            <li>Analyze product performance and reliability.</li>
            <li>Comply with legal obligations and enforce our terms.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>3. Legal bases for processing</h2>
          <p>Where applicable, we process personal information based on contract necessity, legitimate interests, consent, and legal obligations.</p>
        </section>

        <section className="legal-panel">
          <h2>4. Sharing of information</h2>
          <p>We do not sell personal information. We may share information with:</p>
          <ul>
            <li>Service providers who help us host, secure, and operate our services.</li>
            <li>Enterprise customers as needed to administer customer-managed accounts and workspaces.</li>
            <li>Legal or regulatory authorities when required by law.</li>
            <li>Successors in connection with a merger, acquisition, or asset transfer.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>5. Data retention</h2>
          <p>We retain information for as long as necessary to provide services, meet legal obligations, resolve disputes, and enforce agreements. Retention periods vary by data type and service context.</p>
        </section>

        <section className="legal-panel">
          <h2>6. Security</h2>
          <p>We implement administrative, technical, and organizational safeguards designed to protect personal information. No method of transmission or storage is completely secure, but we continuously work to reduce risk and improve controls.</p>
        </section>

        <section className="legal-panel">
          <h2>7. Your choices and rights</h2>
          <ul>
            <li>You may access and update account profile information in product settings.</li>
            <li>You may request deletion of your account and associated personal data, subject to legal and contractual obligations.</li>
            <li>You may opt out of non-essential communications at any time.</li>
            <li>Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain processing.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>8. Children&apos;s privacy</h2>
          <p>Our services are not directed to children under 13 (or the minimum age required by local law). We do not knowingly collect personal information from children without appropriate consent.</p>
        </section>

        <section className="legal-panel">
          <h2>9. International data transfers</h2>
          <p>If information is transferred across borders, we use appropriate safeguards consistent with applicable data protection laws.</p>
        </section>

        <section className="legal-panel">
          <h2>10. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. If changes are material, we will provide notice through our services or by other appropriate means.</p>
        </section>

        <section className="legal-panel">
          <h2>11. Contact us</h2>
          <p>For privacy questions or requests, contact <a href="mailto:hello@cybercookie.org">hello@cybercookie.org</a>.</p>
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
