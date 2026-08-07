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
  title: "Terms of Service | CyberCookie",
  description:
    "CyberCookie Terms of Service for cybersecurity education services and enterprise cybersecurity software.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
        <section className="legal-hero" aria-labelledby="terms-heading">
          <div className="eyebrow"><span /> Legal</div>
          <h1 id="terms-heading">Terms of Service</h1>
          <p className="legal-meta">Effective date: August 7, 2026</p>
          <p className="legal-intro">
            These Terms of Service (&quot;Terms&quot;) govern your use of CyberCookie websites, training products (including CyberCookie
            Academy), and enterprise software offerings (including Astraea). By accessing or using our services, you agree to these Terms.
          </p>
        </section>

        <section className="legal-panel">
          <h2>1. Eligibility and accounts</h2>
          <ul>
            <li>You must provide accurate information and keep account credentials secure.</li>
            <li>You are responsible for all activity under your account.</li>
            <li>You must promptly notify us of unauthorized account use.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>2. Use of services</h2>
          <p>You may use the services only in compliance with applicable laws and these Terms.</p>
          <h3>You agree not to:</h3>
          <ul>
            <li>Use the services for unlawful, abusive, or fraudulent activity.</li>
            <li>Interfere with service availability, security, or integrity.</li>
            <li>Attempt unauthorized access to systems, accounts, or data.</li>
            <li>Reverse engineer or misuse service functionality beyond permitted use.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>3. Educational content and simulations</h2>
          <p>Academy content is designed for training and skill development. Simulated scenarios are educational and must not be interpreted as authorization to perform security testing on systems you do not own or explicitly control.</p>
        </section>

        <section className="legal-panel">
          <h2>4. Enterprise services</h2>
          <p>Enterprise subscriptions may be governed by a separate written agreement (such as an order form or master services agreement). If there is a conflict, that written agreement controls for enterprise customers.</p>
        </section>

        <section className="legal-panel">
          <h2>5. Fees and billing</h2>
          <p>Paid services, if applicable, are billed under the pricing and terms presented at purchase or in your enterprise agreement. Fees are non-refundable except where required by law or expressly stated in writing.</p>
        </section>

        <section className="legal-panel">
          <h2>6. Intellectual property</h2>
          <ul>
            <li>CyberCookie and its licensors retain all rights in the services, software, content, and trademarks.</li>
            <li>We grant you a limited, non-exclusive, non-transferable right to use the services during your authorized access period.</li>
            <li>You retain rights in content you submit, and grant us necessary rights to host and process that content to provide the services.</li>
          </ul>
        </section>

        <section className="legal-panel">
          <h2>7. Privacy and security</h2>
          <p>Your use of the services is also governed by our <Link href="/privacy">Privacy Policy</Link>. We implement reasonable safeguards, but no system can be guaranteed perfectly secure.</p>
        </section>

        <section className="legal-panel">
          <h2>8. Suspension and termination</h2>
          <p>We may suspend or terminate access if you violate these Terms, pose a security risk, or if required by law. You may stop using the services at any time.</p>
        </section>

        <section className="legal-panel">
          <h2>9. Disclaimers</h2>
          <p>Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
        </section>

        <section className="legal-panel">
          <h2>10. Limitation of liability</h2>
          <p>To the fullest extent permitted by law, CyberCookie is not liable for indirect, incidental, consequential, special, or punitive damages, or for lost profits, revenues, data, or goodwill. Our aggregate liability is limited to amounts paid by you to CyberCookie for the services in the twelve months preceding the claim.</p>
        </section>

        <section className="legal-panel">
          <h2>11. Indemnification</h2>
          <p>You agree to indemnify and hold harmless CyberCookie from claims, damages, and expenses arising from your misuse of the services or violation of these Terms.</p>
        </section>

        <section className="legal-panel">
          <h2>12. Governing law</h2>
          <p>These Terms are governed by applicable laws of the jurisdiction where CyberCookie is established, unless otherwise required by law or agreed in a separate enterprise contract.</p>
        </section>

        <section className="legal-panel">
          <h2>13. Changes to terms</h2>
          <p>We may update these Terms from time to time. Continued use of services after updated Terms are posted constitutes acceptance of the revised Terms.</p>
        </section>

        <section className="legal-panel">
          <h2>14. Contact</h2>
          <p>For legal questions, contact <a href="mailto:hello@cybercookie.org">hello@cybercookie.org</a>.</p>
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
