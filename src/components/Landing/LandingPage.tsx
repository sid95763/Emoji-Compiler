import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap,
  Play,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  Download,
  Flame,
} from 'lucide-react';
import { PIPELINE_STAGES } from '../../lib/pipelinePhases';
import { samplePrograms } from '../../data/samplePrograms';
import confetti from 'canvas-confetti';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onLaunchPlayground: (sampleId?: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchPlayground }) => {
  const [heroFixed, setHeroFixed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      gsap.set(
        [
          '.landing-navbar',
          '.hero-status-pill',
          '.hero-display-title',
          '.hero-lead-text',
          '.hero-cta-cluster > *',
          '.telemetry-card',
          '.hero-terminal-card',
          '.floating-hud',
          '.pipeline-stage-card',
          '.bento-card',
          '.sample-showcase-card',
          '.cta-banner-wrapper',
        ],
        { opacity: 1, clearProps: 'all' }
      );
      return;
    }

    gsap.ticker.lagSmoothing(500, 33);

    // 0. Intro Screen Initial Entrance
    const introEntranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    introEntranceTl
      .fromTo('.intro-top-bar', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo('.intro-emblem', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo('.intro-kicker', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
      .fromTo(
        '.intro-title',
        { y: 25, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 },
        '-=0.3'
      )
      .fromTo('.intro-tagline', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
      .fromTo('.intro-bottom-action', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');

    // Pinned Cinematic Curtain & Zoom Intro Scrub (Exact technique from Sentinal)
    const introPinTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#intro-screen',
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    introPinTl
      .to('.intro-top-bar', { y: -40, opacity: 0, duration: 0.25 }, 0)
      .to('.intro-bottom-action', { y: 40, opacity: 0, duration: 0.25 }, 0)
      .to(
        '.intro-center-hero',
        {
          scale: 3.2,
          opacity: 0,
          filter: 'blur(12px)',
          duration: 0.85,
          ease: 'power2.in',
        },
        0.05
      )
      .to(
        '.intro-glow-aura',
        {
          scale: 2.8,
          opacity: 0.8,
          duration: 0.8,
        },
        0.05
      )
      .to(
        '#intro-screen',
        {
          opacity: 0,
          duration: 0.35,
        },
        0.65
      );

    // 1. Hero Section Coordinated Entrance Timeline
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.landing-hero-section',
        start: 'top 85%',
        once: true,
      },
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(
          [
            '.hero-status-pill',
            '.hero-display-title',
            '.hero-lead-text',
            '.hero-cta-cluster > *',
            '.telemetry-card',
            '.hero-terminal-card',
            '.floating-hud',
          ],
          { clearProps: 'opacity,transform,visibility' }
        );
      },
    });

    heroTl
      .fromTo('.landing-navbar', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo('.hero-status-pill', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.3')
      .fromTo('.hero-display-title', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.25')
      .fromTo('.hero-lead-text', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.35')
      .fromTo(
        '.hero-cta-cluster > *',
        { y: 15, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.08 },
        '-=0.35'
      )
      .fromTo(
        '.telemetry-card',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.07 },
        '-=0.3'
      )
      .fromTo(
        '.hero-terminal-card',
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.7'
      )
      .fromTo(
        '.floating-hud',
        { y: 16, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.15 },
        '-=0.4'
      );

    // 2. Compilation Pipeline Cards Stagger
    gsap.fromTo(
      '.pipeline-stage-card',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.pipeline-section',
          start: 'top 75%',
          once: true,
        },
      }
    );

    // 3. Bento Grid Cards Stagger
    gsap.fromTo(
      '.bento-card',
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 75%',
          once: true,
        },
      }
    );

    // 4. Sample Showcase Cards Stagger
    gsap.fromTo(
      '.sample-showcase-card',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.samples-section',
          start: 'top 75%',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleScrollToHero = () => {
    const heroEl = document.getElementById('hero-section');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroApplyFix = () => {
    setHeroFixed(true);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.5, x: 0.75 },
        colors: ['#00ff66', '#22d3ee', '#ffffff'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="landing-master-wrapper" ref={containerRef}>
      {/* ─────────────────────────────────────────────────────────────
          0. PINNED CINEMATIC CURTAIN & ZOOM INTRO (GSAP)
      ───────────────────────────────────────────────────────────── */}
      <section id="intro-screen" className="intro-viewport" aria-label="Welcome to EmojiCompiler">
        {/* Cosmic Ambient Glow Aura */}
        <div className="intro-glow-aura">
          <div className="intro-aura-orb"></div>
        </div>

        {/* Top Coordinates & Compiler Engine Status */}
        <div className="intro-top-bar">
          <span className="intro-beacon-dot"></span>
          <span>CLANG 18 / GCC 14 C++20 RUNTIME ENGINE • IN-BROWSER VM</span>
        </div>

        {/* Central Cinematic Kinetic Emblem & Typography */}
        <div className="intro-center-hero">
          <div className="intro-emblem">
            <div className="intro-emblem-ring"></div>
            <div className="intro-emblem-badge">🔥</div>
          </div>

          <div className="intro-kicker">C++ COMPILER &amp; PLAYGROUND REIMAGINED</div>

          <h1 className="intro-title">EMOJICOMPILER</h1>

          <p className="intro-tagline">
            Turn obscure compiler diagnostics, cryptic template errors, and segmentation faults into witty insights,
            interactive code diffs, and live AST token streams.
          </p>
        </div>

        {/* Bottom Scroll Indicator & Action */}
        <button
          type="button"
          className="intro-bottom-action"
          onClick={handleScrollToHero}
          title="Scroll or click to enter the playground"
        >
          <span className="intro-scroll-label">Scroll to Enter Playground</span>
          <div className="intro-mouse">
            <div className="intro-mouse-wheel"></div>
          </div>
          <span className="intro-skip-hint">or click to skip</span>
        </button>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          1. STICKY GLASSMORPHIC NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <nav className="landing-navbar" aria-label="Landing Navigation">
        <div className="landing-container nav-inner">
          <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="nav-brand-icon">🔥</div>
            <span className="nav-brand-text">EmojiCompiler</span>
          </div>

          <div className="nav-links-cluster">
            <a href="#pipeline" className="nav-link">
              Pipeline
            </a>
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#samples" className="nav-link">
              Sample Bugs
            </a>
            <a href="#comparison" className="nav-link">
              Comparison
            </a>
          </div>

          <div className="nav-actions-cluster">
            <button
              type="button"
              className="nav-launch-btn"
              onClick={() => onLaunchPlayground()}
              title="Launch Full Screen Playground"
            >
              <span>Launch Playground</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="hero-section" className="landing-hero-section">
        <div className="landing-container hero-content-layout">
          {/* Left Column: Headline, CTAs, Telemetry */}
          <div className="hero-text-column">
            <div className="hero-status-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>⚡ ZERO SETUP · 100% IN-BROWSER C++ PLAYGROUND</span>
            </div>

            <h2 className="hero-display-title">
              C++ Code without the Tears.{' '}
              <span className="text-gradient-cyan">With Emojis</span> &amp;{' '}
              <span className="text-gradient-amber">Laughter</span>.
            </h2>

            <p className="hero-lead-text">
              The friendly, visual C++ IDE that teaches you <em>why</em> your code broke, illustrates the 5 compilation
              phases, and fixes missing semicolons with a single click.
            </p>

            <div className="hero-cta-cluster">
              <button
                type="button"
                className="hero-primary-cta"
                onClick={() => onLaunchPlayground()}
              >
                <Play size={16} fill="currentColor" />
                <span>Launch Interactive Playground</span>
              </button>

              <a href="#pipeline" className="hero-secondary-cta">
                <Layers size={15} />
                <span>Explore 5-Stage Pipeline</span>
              </a>
            </div>

            <div className="hero-telemetry-row">
              <div className="telemetry-card">
                <div className="telemetry-num">
                  <span>0.004</span>
                  <span className="unit">sec</span>
                </div>
                <div className="telemetry-label">Ultra-fast compilation simulation</div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-num">
                  <span>5</span>
                  <span className="unit">stages</span>
                </div>
                <div className="telemetry-label">Full AST &amp; linker pipeline visibility</div>
              </div>

              <div className="telemetry-card">
                <div className="telemetry-num">
                  <span>O(1)</span>
                  <span className="unit">Big-O</span>
                </div>
                <div className="telemetry-label">Real-time static algorithmic complexity</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Simulation Terminal Preview */}
          <div className="hero-terminal-mockup-wrapper">
            <div className="floating-hud floating-hud-1">
              <Sparkles size={14} className="text-amber-400" />
              <span>ELI5 AI Beginner Mentor</span>
            </div>

            <div className="floating-hud floating-hud-2">
              <Cpu size={14} className="text-cyan-400" />
              <span>x86-64 ASM Disassembly Ready</span>
            </div>

            <div className="hero-terminal-card">
              <div className="terminal-mockup-header">
                <div className="mockup-controls-dots">
                  <span className="mockup-dot red"></span>
                  <span className="mockup-dot amber"></span>
                  <span className="mockup-dot green"></span>
                </div>
                <div className="mockup-file-tab">
                  <Code2 size={13} />
                  <span>main.cpp</span>
                </div>
                <span className="mockup-status-tag">C++17</span>
              </div>

              <div className="terminal-code-body">
                <div className="code-line">
                  <span className="line-num">1</span>
                  <span className="line-code">#include &lt;iostream&gt;</span>
                </div>
                <div className="code-line">
                  <span className="line-num">2</span>
                  <span className="line-code">using namespace std;</span>
                </div>
                <div className="code-line">
                  <span className="line-num">3</span>
                  <span className="line-code"></span>
                </div>
                <div className="code-line">
                  <span className="line-num">4</span>
                  <span className="line-code">int main() {'{'}</span>
                </div>
                <div className={`code-line ${heroFixed ? '' : 'error-target-line'}`}>
                  <span className="line-num">5</span>
                  <span className="line-code">
                    {heroFixed
                      ? '    cout << "Welcome to EmojiCompiler!" << endl;'
                      : '    cout << "Welcome to EmojiCompiler!" << endl'}
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-num">6</span>
                  <span className="line-code">    return 0;</span>
                </div>
                <div className="code-line">
                  <span className="line-num">7</span>
                  <span className="line-code">{'}'}</span>
                </div>

                {/* Anchored Popover Simulation */}
                {!heroFixed ? (
                  <div className="hero-anchored-popover">
                    <div className="hero-popover-meta">
                      <div className="popover-badge-row">
                        <span className="text-lg">✂️</span>
                        <span className="sev-chip">error</span>
                        <span className="phase-chip">Parsing Phase 🧩</span>
                      </div>
                      <span className="font-mono text-xs text-slate-400">Line 5:48</span>
                    </div>

                    <div className="hero-popover-joke">
                      “Your line never ended. Like a bad movie. Add ';'”
                    </div>

                    <div className="hero-popover-diff">
                      <div className="diff-content font-mono">
                        <span className="diff-minus">- cout &lt;&lt; ... &lt;&lt; endl</span>
                        <span className="diff-plus">+ cout &lt;&lt; ... &lt;&lt; endl;</span>
                      </div>
                      <button
                        type="button"
                        className="hero-apply-btn"
                        onClick={handleHeroApplyFix}
                        title="Click to apply simulated patch"
                      >
                        Apply Fix ✨
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 mt-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>Zero errors! All 5 compilation stages passed cleanly!</span>
                    </div>
                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
                      onClick={() => setHeroFixed(false)}
                    >
                      Reset Demo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. 5-STAGE COMPILATION PIPELINE SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="pipeline" className="pipeline-section">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-kicker">COMPILER ARCHITECTURE</div>
            <h3 className="section-title">The 5-Stage Compilation Stepper</h3>
            <p className="section-subtitle">
              Unlike normal compilers that dump 100 cryptic errors in raw terminal text, EmojiCompiler isolates exactly
              which compiler pipeline phase caught the bug.
            </p>
          </div>

          <div className="pipeline-cards-grid">
            {PIPELINE_STAGES.map((stage, idx) => {
              const iconsList = ['🔤', '🧩', '🧠', '⚡', '⚙️'];
              const sampleTags = ['Unterminated strings', 'Missing semicolons', 'Undeclared vars', 'Dead code elimination', 'Nullptr segfaults'];
              return (
                <div key={stage.id} className="pipeline-stage-card">
                  <div className="stage-num-badge">STAGE 0{idx + 1}</div>
                  <div className="stage-icon-wrap">{iconsList[idx]}</div>
                  <div className="stage-title">{stage.name}</div>
                  <div className="stage-desc">{stage.description}</div>
                  <div className="stage-sample-tag">{sampleTags[idx]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BENTO GRID FEATURES
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="features-section">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-kicker">FEATURE SUITE</div>
            <h3 className="section-title">Engineered to Make C++ Fun &amp; Intuitive</h3>
            <p className="section-subtitle">
              Everything you need for university assignments, competitive programming, and teaching novices without the fear factor.
            </p>
          </div>

          <div className="bento-grid">
            {/* Bento Card 1: AI Diagnostics & Humor Levels */}
            <div className="bento-card bento-span-2">
              <div className="bento-icon-frame">🎭</div>
              <h4 className="bento-title">3 Humor Levels: From Pure Professional to Savage Roast</h4>
              <p className="bento-desc">
                Switch between <strong>0 (Pro)</strong> for serious factual explanations, <strong>1 (Light Puns)</strong> for gentle coding metaphors, and <strong>2 (Roast)</strong> when you need a good laugh about your pointer arithmetic.
              </p>
              <div className="bento-preview-box">
                <div className="flex items-center gap-3 text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">0:pro</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400">1:puns</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">2:roast</span>
                </div>
                <p className="text-slate-300 italic">
                  “Summoning entities from the void? Declare it or call an exorcist.”
                </p>
              </div>
            </div>

            {/* Bento Card 2: Big-O Complexity Meter */}
            <div className="bento-card">
              <div className="bento-icon-frame">📈</div>
              <h4 className="bento-title">Algorithmic Big-O Complexity Meter</h4>
              <p className="bento-desc">
                Real-time heuristic scanner detects nested loops ($O(N^2)$, $O(N^3)$), binary search patterns ($O(\log N)$), and branching recursion ($O(2^N)$).
              </p>
              <div className="bento-preview-box flex items-center justify-between">
                <span className="text-emerald-400 font-bold">ESTIMATE: O(N²)</span>
                <span className="text-xs text-slate-400">Nesting Depth: 2</span>
              </div>
            </div>

            {/* Bento Card 3: Live AST Tokens Visualizer */}
            <div className="bento-card">
              <div className="bento-icon-frame">🔠</div>
              <h4 className="bento-title">Live C++ Token Stream</h4>
              <p className="bento-desc">
                Inspect every terminal token with live color categories: keywords, identifiers, literals, operators, and preprocessors.
              </p>
              <div className="bento-preview-box tokens-stream-demo">
                <span className="token-demo-chip" style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>#include</span>
                <span className="token-demo-chip" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>&lt;iostream&gt;</span>
                <span className="token-demo-chip" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>int</span>
                <span className="token-demo-chip" style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}>main</span>
                <span className="token-demo-chip" style={{ background: 'rgba(148,163,184,0.2)', color: '#94a3b8' }}>()</span>
              </div>
            </div>

            {/* Bento Card 4: Emotional Bug Mascot Companion */}
            <div className="bento-card bento-span-2">
              <div className="bento-icon-frame">🐛</div>
              <h4 className="bento-title">Emotional Mascot: Your Corner Debugging Buddy</h4>
              <p className="bento-desc">
                The corner dock mascot reacts in real-time to your code state: celebrates zero errors with joyful confetti, panics on missing brackets, goes sleepy after 60 seconds of inactivity, and laughs along with silly typos.
              </p>
              <div className="bento-preview-box flex items-center gap-4">
                <div className="text-3xl">🎉</div>
                <div className="text-xs font-mono text-emerald-300">
                  “Clean build! All 5 stages passed cleanly! Not a single bug harmed! ✨”
                </div>
              </div>
            </div>

            {/* Bento Card 5: PDF Reports & Assembly Export */}
            <div className="bento-card">
              <div className="bento-icon-frame">📑</div>
              <h4 className="bento-title">Printable PDF &amp; x86-64 Export</h4>
              <p className="bento-desc">
                Export diagnostic reports as presentation-ready PDF documents with phase breakdowns, or download the compiled x86-64 assembly source (.s).
              </p>
              <div className="bento-preview-box text-xs font-mono text-cyan-300 flex items-center justify-between">
                <span>emojicompiler_report.pdf</span>
                <Download size={13} />
              </div>
            </div>

            {/* Bento Card 6: Gamified Clean Streaks */}
            <div className="bento-card bento-span-2">
              <div className="bento-icon-frame">🏆</div>
              <h4 className="bento-title">Clean Compile Streaks &amp; Achievements</h4>
              <p className="bento-desc">
                Earn badges like <em>Ghost Hunter</em> (fix 10 undeclared variables), <em>Night Owl</em> (compile after midnight), and <em>Flawless Streak</em> (5 clean compilations in a row).
              </p>
              <div className="bento-preview-box flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-400" />
                  <span className="font-bold text-white">Current Streak: 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-400" />
                  <span className="text-xs text-slate-300">8 Achievements Ready to Unlock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SAMPLE ALGORITHMS & BUGS SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <section id="samples" className="samples-section">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-kicker">PRE-LOADED CHALLENGES</div>
            <h3 className="section-title">Explore Samples &amp; Algorithms</h3>
            <p className="section-subtitle">
              Jump straight into common compiler bugs or competitive programming algorithms with a single click.
            </p>
          </div>

          <div className="samples-cards-grid">
            {samplePrograms.slice(0, 6).map((s) => (
              <div key={s.id} className="sample-showcase-card">
                <div className="sample-card-top">
                  <span className="text-2xl">{s.expectedEmoji}</span>
                  <span className={`sample-badge ${s.category}`}>{s.category}</span>
                </div>
                <div className="sample-card-name">{s.name}</div>
                <div className="sample-card-desc">{s.description}</div>
                <div className="sample-code-snippet">{s.code.trim().slice(0, 140)}...</div>
                <button
                  type="button"
                  className="sample-launch-btn"
                  onClick={() => onLaunchPlayground(s.id)}
                >
                  <Play size={13} fill="currentColor" />
                  <span>Open in Playground</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. COMPARISON MATRIX
      ───────────────────────────────────────────────────────────── */}
      <section id="comparison" className="comparison-section">
        <div className="landing-container">
          <div className="section-header-centered">
            <div className="section-kicker">HEAD-TO-HEAD</div>
            <h3 className="section-title">Why EmojiCompiler?</h3>
            <p className="section-subtitle">
              See how EmojiCompiler replaces intimidating terminal walls of error text with human-friendly guidance.
            </p>
          </div>

          <div className="comparison-table-wrap">
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Standard GCC / Clang CLI</th>
                  <th className="highlight-col">EmojiCompiler</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Compiler Output</td>
                  <td>Raw wall of text with template vomit</td>
                  <td className="highlight-cell">Anchored popovers with line highlights &amp; emojis</td>
                </tr>
                <tr>
                  <td>Pipeline Stage Visibility</td>
                  <td>None (Single monolithic error code)</td>
                  <td className="highlight-cell">Visual 5-Stage Stepper (Lexing → Assembly)</td>
                </tr>
                <tr>
                  <td>Auto-Fix Suggestions</td>
                  <td>None (manual editor jumping required)</td>
                  <td className="highlight-cell">One-click diff patch with "Apply Fix ✨"</td>
                </tr>
                <tr>
                  <td>Complexity Analysis</td>
                  <td>Requires separate profiler tool</td>
                  <td className="highlight-cell">Instant live O(1) to O(N³) Big-O estimation</td>
                </tr>
                <tr>
                  <td>Novice / Learner Mode</td>
                  <td>Zero context or guidance</td>
                  <td className="highlight-cell">AI Beginner Mentor (ELI5) plain English</td>
                </tr>
                <tr>
                  <td>Setup Required</td>
                  <td>MinGW / WSL / CMake installation</td>
                  <td className="highlight-cell">Zero install: runs immediately in any browser</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. COSMIC CALL TO ACTION
      ───────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-banner-wrapper">
            <div className="cta-nebula-glow"></div>
            <div className="cta-content-inner">
              <h3 className="cta-title">Ready to Squash Some C++ Bugs?</h3>
              <p className="cta-desc">
                Start writing modern C++17 and C++20 code right now. No installations, no configuration files, and zero
                fear of the compiler.
              </p>
              <button
                type="button"
                className="cta-primary-btn"
                onClick={() => onLaunchPlayground()}
              >
                <Zap size={18} fill="currentColor" />
                <span>Launch Interactive Playground</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <div className="footer-brand">
            <span className="text-lg">🔥</span>
            <span>EmojiCompiler</span>
          </div>

          <div className="footer-copy">
            Crafted for engineers, students, and educators. C++ compilation without tears.
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 text-xs font-mono text-slate-300"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑ Back to Top
          </button>
        </div>
      </footer>
    </div>
  );
};
