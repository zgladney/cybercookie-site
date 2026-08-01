const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navItems = [
  ["Home", "#home"],
  ["Academy", "#academy"],
  ["Enterprise", "#enterprise"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

const academyCards = [
  {
    number: "01",
    title: "Learn the fundamentals",
    copy: "Build a durable security foundation through concise lessons designed around real-world context.",
  },
  {
    number: "02",
    title: "Practice in context",
    copy: "Work through guided labs and realistic scenarios—not slides, memorization, or empty theory.",
  },
  {
    number: "03",
    title: "Prove what you can do",
    copy: "Turn practical skills into visible progress and a portfolio that speaks for itself.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#home" aria-label="CyberCookie home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>CYBER<span>COOKIE</span></span>
        </a>
        <div className="nav-links">
          {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <a className="nav-cta" href="mailto:hello@cybercookie.org?subject=CyberCookie%20Beta">Join the beta <Arrow /></a>
      </nav>
      </header>

      <main id="main-content">
      <section className="hero section-shell" id="home" aria-labelledby="hero-heading">
        <div className="hero-glow" />
        <div className="eyebrow"><span /> Practical security. Real skills.</div>
        <h1 id="hero-heading">Cybersecurity built for people who <em>learn by doing.</em></h1>
        <p className="hero-copy">Practical education and defensive tools designed to make security clearer, more useful, and open to everyone.</p>
        <div className="hero-actions">
          <a className="button primary" href="https://cybercookie.org/academy">Explore the Academy <Arrow /></a>
          <a className="button secondary" href="#enterprise">Explore Astraea <Arrow /></a>
        </div>
        <div className="hero-proof">
          <span><Check /> Hands-on learning</span>
          <span><Check /> Built by practitioners</span>
          <span><Check /> No experience required</span>
        </div>

        <div className="console" aria-label="CyberCookie learning platform preview">
          <div className="console-top">
            <div><i /><i /><i /></div>
            <span>academy.cybercookie.org / workspace</span>
            <b>CONNECTED</b>
          </div>
          <div className="console-body">
            <aside>
              <span className="active">CC</span>
              <span>⌁</span><span>◇</span><span>⌘</span>
              <span className="aside-bottom">?</span>
            </aside>
            <div className="console-main">
              <div className="lab-head"><div><small>LEARNING PATH</small><h3>Network Defense Essentials</h3></div><span>42% complete</span></div>
              <div className="progress"><span /></div>
              <div className="console-grid">
                <div className="terminal">
                  <div><span>TERMINAL</span><b>zsh</b></div>
                  <p><i>learner@cybercookie</i>:~$ nmap -sV 10.0.0.24</p>
                  <p>Starting Nmap 7.95</p><p>PORT&nbsp;&nbsp;&nbsp;&nbsp; STATE&nbsp; SERVICE</p>
                  <p><strong>22/tcp&nbsp;&nbsp; open&nbsp;&nbsp; ssh</strong></p>
                  <p><strong>443/tcp&nbsp; open&nbsp;&nbsp; https</strong></p>
                  <p>2 services detected. Analyze exposure<span className="cursor" /></p>
                </div>
                <div className="task-card">
                  <span className="task-number">TASK 04</span>
                  <h4>Identify exposed services</h4>
                  <p>Scan the target host and determine which services require remediation.</p>
                  <div><Check /><span><b>Host discovered</b><small>10.0.0.24 is online</small></span></div>
                  <div><span className="radio" /><span><b>Review open ports</b><small>Determine the attack surface</small></span></div>
                  <button type="button">Check answer <Arrow /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="academy section-shell" id="academy">
        <div className="section-heading">
          <div><div className="eyebrow"><span /> CyberCookie Academy</div><h2>Skills that hold up<br /><em>in the real world.</em></h2></div>
          <p>Security is learned through practice. Our learning paths combine clear instruction with hands-on work so you can build confidence that lasts.</p>
        </div>
        <div className="academy-grid">
          {academyCards.map((card, index) => (
            <article key={card.number}>
              <div className={`card-icon icon-${index + 1}`} aria-hidden="true"><span>{index === 0 ? "⌁" : index === 1 ? ">_" : "✓"}</span></div>
              <span className="card-number">/{card.number}</span>
              <h3>{card.title}</h3><p>{card.copy}</p>
              <a href="#contact">Start learning <Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="enterprise section-shell" id="enterprise">
        <div className="enterprise-panel">
          <div className="radar" aria-hidden="true"><span className="ring ring-one" /><span className="ring ring-two" /><span className="ring ring-three" /><span className="sweep" /><i className="dot dot-one" /><i className="dot dot-two" /><i className="dot dot-three" /><b>A</b></div>
          <div className="enterprise-copy">
            <div className="eyebrow purple"><span /> Astraea Enterprise</div>
            <h2>See risk clearly.<br /><em>Act with confidence.</em></h2>
            <p>Astraea turns complex defensive signals into focused, actionable insight—helping lean security teams protect what matters without adding noise.</p>
            <ul>
              <li><Check /><span><b>Context over alerts</b> — understand what matters and why.</span></li>
              <li><Check /><span><b>Built for real teams</b> — fast to adopt, simple to operate.</span></li>
              <li><Check /><span><b>Defensive by design</b> — thoughtful tools, not security theater.</span></li>
            </ul>
            <a className="button lavender" href="#contact">Discover Astraea <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="about-statement">
          <div className="eyebrow"><span /> Why CyberCookie</div>
          <h2>Security should feel <em>possible.</em></h2>
        </div>
        <div className="about-copy">
          <p className="lead">Too much of cybersecurity is built to feel intimidating. We&apos;re here to change that.</p>
          <p>CyberCookie creates practical learning and focused defensive tools for people who want to understand how security actually works. No gatekeeping. No needless complexity. Just useful knowledge and technology built with care.</p>
          <div className="values"><span><b>CLARITY</b>Make the complex understandable.</span><span><b>CRAFT</b>Build things worth trusting.</span><span><b>ACCESS</b>Create more ways in.</span></div>
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <div className="contact-panel">
          <div className="eyebrow"><span /> Private beta</div>
          <h2>Help shape what<br />we&apos;re building.</h2>
          <p>We&apos;re inviting early learners and security teams to test CyberCookie and Astraea. Tell us what you&apos;re interested in and we&apos;ll be in touch.</p>
          <div className="contact-actions">
            <a className="button dark-button" href="mailto:hello@cybercookie.org?subject=CyberCookie%20Beta">Request beta access <Arrow /></a>
            <a className="email-link" href="mailto:hello@cybercookie.org">hello@cybercookie.org</a>
          </div>
          <small>No spam. No sales sequences. Just thoughtful updates.</small>
        </div>
      </section>

      </main>
      <footer className="section-shell" aria-label="Site footer">
        <div className="footer-main">
          <div><a className="brand" href="#home" aria-label="CyberCookie home"><span className="brand-mark" aria-hidden="true"><span /></span><span>CYBER<span>COOKIE</span></span></a><p>Practical security for everyone<br />ready to learn.</p></div>
          <div className="footer-links">
            <div><b>PRODUCTS</b><a href="https://cybercookie.org/academy">Academy</a><a href="#enterprise">Astraea</a><a href="#about">About</a><a href="mailto:hello@cybercookie.org">Contact</a></div>
            <div><b>LEGAL</b><a href="https://cybercookie.org/privacy">Privacy Policy</a><a href="https://cybercookie.org/terms">Terms of Service</a></div>
            <div><b>SOCIAL</b><a href="https://github.com/cybercookie" target="_blank" rel="noreferrer" aria-label="CyberCookie on GitHub (opens in a new tab)">GitHub</a><a href="https://www.linkedin.com/company/cybercookie" target="_blank" rel="noreferrer" aria-label="CyberCookie on LinkedIn (opens in a new tab)">LinkedIn</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 CyberCookie</span><span>Learn deeply. Defend thoughtfully.</span></div>
      </footer>
    </>
  );
}
