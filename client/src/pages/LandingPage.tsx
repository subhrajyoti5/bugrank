import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleStartSolving = () => {
    if (user) {
      navigate('/problems');
    } else {
      navigate('/login');
    }
  };

  const faqItems = [
    {
      q: "How does BugRank fundamentally differ from conventional competitive programming platforms?",
      a: "Traditional platforms ask you to implement an algorithm from a blank slate to pass synthetic test vectors. BugRank immerses you in real production incidents: existing codebases with concurrency races, off-by-one pointer corruptions, memory leaks, and distributed split-brains. You must diagnose root causes using call stacks, telemetry, and minimal-diff surgery."
    },
    {
      q: "How are the sandboxed execution environments secured and measured?",
      a: "Every submission executes inside a micro-containerized runtime with deterministic CPU cycles, hard memory limits, and trace instrumentation. We measure execution latency, heap fragmentation, and source diff invariants to evaluate patch precision."
    },
    {
      q: "What criteria govern the scoring formula?",
      a: "Submissions are scored on three orthogonal pillars: (1) Correctness across adversarial edge cases, (2) Patch conciseness (fewer lines modified yields a higher precision rating), and (3) Memory and CPU efficiency deltas between original and patched execution."
    },
    {
      q: "Which languages and hardware runtimes are currently supported?",
      a: "We currently support C++20 (GCC/Clang with AddressSanitizer and ThreadSanitizer enabled), Java 21 LTS with JVM heap diagnostics, Rust 1.76+, and Go 1.22. Every runtime includes full symbol demangling and stack unwinding."
    },
    {
      q: "Can I track my global standing and share verified credentials?",
      a: "Yes. Every verified patch contributes to your global Elo rank on the public leaderboard. You can showcase verified surgical badges, diagnostic precision rates, and specialized domain competencies on your engineering portfolio."
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-charcoal selection:text-offwhite dark:selection:bg-offwhite dark:selection:text-charcoal transition-colors duration-300">
      
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION
          Strict constant left/right margin & center-aligned content
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border-line">
        <div className="absolute inset-0 grid-subtle-pattern opacity-40 pointer-events-none" />

        {/* Constant left/right margin container */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 text-center">
          
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-12 md:mb-16">
            {/* Hero Headline - Centered */}
            <h1 className="headline-hero mb-6 text-center">
              Practice the art <br className="hidden sm:inline" />
              <span className="italic font-normal">of debugging.</span>
            </h1>

            {/* Hero Description - Centered */}
            <p className="text-[1.05rem] md:text-[1.12rem] text-text-secondary leading-[1.65] font-normal mb-10 max-w-2xl mx-auto text-center">
              BugRank is the proving ground for software engineers. Solve production-grade incidents, 
              conquer architectural race conditions, and sharpen your diagnostic intuition.
            </p>

            {/* Hero Button Group - Centered */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleStartSolving}
                className="btn-primary w-full sm:w-auto text-[0.93rem] py-3 px-8 rounded-lg cursor-pointer"
              >
                <span>Initialize Mission</span>
                <span className="ml-2 font-mono text-xs">-&gt;</span>
              </button>

              <button
                onClick={() => navigate('/leaderboard')}
                className="btn-secondary w-full sm:w-auto text-[0.93rem] py-3 px-8 rounded-lg cursor-pointer text-center"
              >
                View Leaderboard
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              METRICS & STATS BAR
              Strictly centered
              ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16 mt-10 border-t border-border-line text-center">
            <div className="flex flex-col items-center text-center">
              <div className="font-serif text-4xl md:text-5xl text-text-primary font-normal tracking-tight mb-2">
                500+
              </div>
              <div className="eyebrow-text text-center">Production Bugs Solved</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="font-serif text-4xl md:text-5xl text-text-primary font-normal tracking-tight mb-2">
                19+
              </div>
              <div className="eyebrow-text text-center">Active Categories</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="font-serif text-4xl md:text-5xl text-text-primary font-normal tracking-tight mb-2">
                Polyglot
              </div>
              <div className="eyebrow-text text-center">C++ / Java / Rust / Go</div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="font-serif text-4xl md:text-5xl text-text-primary font-normal tracking-tight mb-2">
                Zero
              </div>
              <div className="eyebrow-text text-center">Latency Sandboxes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FEATURE SECTION
          Constant left/right margin & every single content block center-aligned
          ───────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 md:py-28 border-b border-border-line bg-surface-subtle/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          
          <div className="max-w-2xl mx-auto mb-14 md:mb-18 flex flex-col items-center text-center">
            <span className="eyebrow-text block mb-3 text-center">ENGINEERING ARCHITECTURE</span>
            <h2 className="headline-section mb-4 text-center">
              Precision tools for high-stakes problem solvers.
            </h2>
            <p className="text-[1rem] text-text-secondary leading-[1.65] text-center max-w-xl mx-auto">
              Every challenge is synthesized from real-world postmortems. We test the invariants that 
              determine software stability when systems scale.
            </p>
          </div>

          {/* 6-Column Feature Grid with center-aligned card contents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-[1px] bg-border-line rounded-xl overflow-hidden border border-border-line">
            
            {/* Feature 01 - spans 2 cols - Center aligned */}
            <div className="lg:col-span-2 p-8 md:p-10 bg-surface-card flex flex-col items-center justify-between text-center hover:bg-surface-subtle transition-colors duration-150">
              <div className="flex flex-col items-center text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-6 pb-3 border-b border-border-line w-full">
                  <span className="font-mono text-xs text-text-muted font-semibold tracking-widest">MODULE 01</span>
                  <span className="font-mono text-xs text-text-muted">/</span>
                  <span className="font-mono text-xs text-text-muted">SANDBOX</span>
                </div>
                <h3 className="headline-feature mb-4 text-center">
                  Deterministic Micro-Runtimes
                </h3>
                <p className="text-[0.93rem] text-text-secondary leading-[1.6] text-center max-w-xs mx-auto">
                  Containerized sandbox executions with zero-latency feedback. Nanosecond telemetry instruments 
                  memory allocations, instruction caches, and system calls.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border-line-subtle flex items-center justify-center text-xs font-mono text-text-muted w-full text-center">
                <span>LATENCY: &lt; 0.12ms</span>
              </div>
            </div>

            {/* Feature 02 - spans 2 cols - Center aligned */}
            <div className="lg:col-span-2 p-8 md:p-10 bg-surface-card flex flex-col items-center justify-between text-center hover:bg-surface-subtle transition-colors duration-150">
              <div className="flex flex-col items-center text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-6 pb-3 border-b border-border-line w-full">
                  <span className="font-mono text-xs text-text-muted font-semibold tracking-widest">MODULE 02</span>
                  <span className="font-mono text-xs text-text-muted">/</span>
                  <span className="font-mono text-xs text-text-muted">DEFECTS</span>
                </div>
                <h3 className="headline-feature mb-4 text-center">
                  Architectural Flaws
                </h3>
                <p className="text-[0.93rem] text-text-secondary leading-[1.6] text-center max-w-xs mx-auto">
                  Move past superficial syntax errors. Uncover deadlock hazards, lock-free ABA phenomena, 
                  memory fragmentation, and asynchronous race invariants.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border-line-subtle flex items-center justify-center text-xs font-mono text-text-muted w-full text-center">
                <span>SANITIZERS: ASAN / TSAN / UBSAN</span>
              </div>
            </div>

            {/* Feature 03 - spans 2 cols - Center aligned */}
            <div className="lg:col-span-2 p-8 md:p-10 bg-surface-card flex flex-col items-center justify-between text-center hover:bg-surface-subtle transition-colors duration-150">
              <div className="flex flex-col items-center text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-6 pb-3 border-b border-border-line w-full">
                  <span className="font-mono text-xs text-text-muted font-semibold tracking-widest">MODULE 03</span>
                  <span className="font-mono text-xs text-text-muted">/</span>
                  <span className="font-mono text-xs text-text-muted">SCORING</span>
                </div>
                <h3 className="headline-feature mb-4 text-center">
                  Surgical Diff Scoring
                </h3>
                <p className="text-[0.93rem] text-text-secondary leading-[1.6] text-center max-w-xs mx-auto">
                  The most elegant fix modifies the fewest lines while preserving all original semantics. 
                  Our scoring rewards minimal-diff precision and penalizes invasive rewrites.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border-line-subtle flex items-center justify-center text-xs font-mono text-text-muted w-full text-center">
                <span>EVALUATION: AST INVARIANT DELTA</span>
              </div>
            </div>

            {/* Feature 04 - Special: spans 3 cols - Center aligned */}
            <div className="lg:col-span-3 p-8 md:p-10 bg-surface-card flex flex-col items-center justify-between text-center hover:bg-surface-subtle transition-colors duration-150">
              <div className="flex flex-col items-center text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-6 pb-3 border-b border-border-line w-full">
                  <span className="font-mono text-xs text-text-muted font-semibold tracking-widest">MODULE 04</span>
                  <span className="font-mono text-xs text-text-muted">/</span>
                  <span className="font-mono text-xs text-text-muted">STANDINGS</span>
                </div>
                <h3 className="headline-feature mb-4 text-center">
                  Global Engineering Standings
                </h3>
                <p className="text-[0.93rem] text-text-secondary leading-[1.6] text-center max-w-md mx-auto">
                  A mathematically calibrated Elo system that evaluates your speed, accuracy, and code economy 
                  against thousands of engineers worldwide. Earn verified credentials to establish your diagnosis capability.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border-line-subtle flex items-center justify-center gap-4 text-xs font-mono text-text-muted w-full text-center">
                <span>ELO ENGINE: GFM-CALIBRATED</span>
                <span className="text-status-green font-semibold">PUBLIC BOARD ACTIVE</span>
              </div>
            </div>

            {/* Feature 05 - Special: spans 3 cols - Center aligned */}
            <div className="lg:col-span-3 p-8 md:p-10 bg-surface-card flex flex-col items-center justify-between text-center hover:bg-surface-subtle transition-colors duration-150">
              <div className="flex flex-col items-center text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-6 pb-3 border-b border-border-line w-full">
                  <span className="font-mono text-xs text-text-muted font-semibold tracking-widest">MODULE 05</span>
                  <span className="font-mono text-xs text-text-muted">/</span>
                  <span className="font-mono text-xs text-text-muted">TELEMETRY</span>
                </div>
                <h3 className="headline-feature mb-4 text-center">
                  Automated Invariant Telemetry
                </h3>
                <p className="text-[0.93rem] text-text-secondary leading-[1.6] text-center max-w-md mx-auto">
                  Every run outputs flamegraphs, memory allocation timelines, and call stack trees. 
                  Identify the exact instruction causing page faults before crafting your surgical fix.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border-line-subtle flex items-center justify-center gap-4 text-xs font-mono text-text-muted w-full text-center">
                <span>TRACE SPEC: EBPF / DWARF</span>
                <span className="text-text-primary font-semibold">100% DETERMINISTIC</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FAQ ACCORDION SECTION
          Constant left/right margin & center-aligned layout
          ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28 border-b border-border-line">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-18 flex flex-col items-center">
            <span className="eyebrow-text block mb-3 text-center">QUESTIONS & ANSWERS</span>
            <h2 className="headline-section mb-4 text-center">
              Frequently Clarified Questions
            </h2>
            <p className="text-[1rem] text-text-secondary leading-[1.65] text-center max-w-md mx-auto">
              Details on the BugRank proving ground and execution engine.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border-line bg-surface-card overflow-hidden transition-all duration-150"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-center flex items-center justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[1.03rem] font-medium text-text-primary tracking-[-0.01em] text-center flex-1">
                      {item.q}
                    </span>

                    {/* Rectangular toggle */}
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 font-mono text-sm transition-all duration-150 ${
                        isOpen
                          ? 'bg-text-primary text-canvas border border-text-primary'
                          : 'border border-border-line text-text-muted hover:border-text-primary'
                      }`}
                    >
                      {isOpen ? "−" : "+"}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 pt-0 animate-faq-reveal border-t border-border-line-subtle mt-1 text-center">
                      <p className="text-[0.95rem] text-text-secondary leading-[1.7] font-normal pt-4 max-w-2xl mx-auto text-center">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CALL TO ACTION MANIFESTO
          Center-aligned with constant margins
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 border-b border-border-line bg-surface-subtle/40 text-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col items-center text-center">
          <span className="eyebrow-text block mb-4 text-center">DEPLOY YOUR INSTINCTS</span>
          <h2 className="headline-hero text-4xl sm:text-6xl md:text-7xl mb-6 text-center">
            Turn broken code into <br />
            <span className="italic font-normal">pure architecture.</span>
          </h2>
          <p className="text-[1.05rem] text-text-secondary max-w-xl mx-auto mb-9 leading-[1.65] text-center">
            Join the circle of diagnosticians. Stop guessing at stack traces and master 
            the discipline of precision remediation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleStartSolving}
              className="btn-primary text-[0.93rem] py-3 px-8 rounded-lg cursor-pointer w-full sm:w-auto"
            >
              <span>Commence Investigation</span>
              <span className="ml-2 font-mono text-xs">-&gt;</span>
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="btn-secondary text-[0.93rem] py-3 px-7 rounded-lg cursor-pointer w-full sm:w-auto"
            >
              Examine Global Roster
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
          Strictly center-aligned with constant left/right margin
          ───────────────────────────────────────────────────────────── */}
      <footer className="py-16 md:py-20 bg-canvas">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col items-center text-center">
          
          {/* Centered Brand & Tagline */}
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 mb-10">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-border-line flex items-center justify-center bg-surface-card">
                <span className="font-serif text-base font-normal text-text-primary">β</span>
              </div>
              <span className="font-serif text-2xl tracking-[-0.03em] text-text-primary">
                Bug<span className="italic font-normal">Rank</span>
              </span>
            </div>

            <p className="text-[0.9rem] text-text-secondary leading-[1.65] text-center">
              The competitive arena for production debugging, invariant testing, and algorithmic medicine.
            </p>

            {/* Status Badge - Centered */}
            <div className="status-badge mx-auto">
              <span className="w-2 h-2 rounded-full bg-status-green" />
              <span className="font-mono text-xs font-semibold text-text-primary">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Centered Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[0.92rem] py-6 border-y border-border-line w-full max-w-3xl mb-8">
            <button
              onClick={() => navigate('/problems')}
              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Missions Archive
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Global Standings
            </button>
            <a
              href="#features"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#faq"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              FAQ
            </a>
            <a
              href="https://subhrajyotisahoo.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors font-medium"
            >
              Author
            </a>
          </div>

          {/* Centered Copyright & Protocols */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-text-muted font-mono text-center">
            <p>(c) {new Date().getFullYear()} BugRank. All rights reserved.</p>
            <span className="hidden sm:inline text-border-line">•</span>
            <div className="flex items-center justify-center gap-5">
              <span className="hover:text-text-primary transition-colors cursor-pointer">Security Protocol</span>
              <span className="hover:text-text-primary transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-text-primary transition-colors cursor-pointer">Privacy</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
