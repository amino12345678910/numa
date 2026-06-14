import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './HeroSection.css';

export default function HeroSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const pathRef = useRef(null);
  const headlineRef = useRef(null);
  const infoPanelRef = useRef(null);
  const shadowsRef = useRef(null);
  const logoRef = useRef(null);
  const labelRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const bottomBarRef = useRef(null);

  // Effect 1: Cinematic Entrance Animations with GSAP Context
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scoped GSAP context for React 18 safety
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion defaults: immediately visible
        gsap.set('.word', { y: '0%' });
        gsap.set([labelRef.current, '.headline-sub-title', subtitleRef.current, ctaRef.current, infoPanelRef.current, bottomBarRef.current], {
          opacity: 1,
          y: 0,
          scale: 1
        });
        gsap.set(pathRef.current, { strokeDashoffset: 0 });
        gsap.set(videoRef.current, { opacity: 0.45, scale: 1 });
        return;
      }

      // 1. Setup initial states
      gsap.set('.word', { y: '100%' });
      gsap.set([labelRef.current, '.headline-sub-title', subtitleRef.current, ctaRef.current, bottomBarRef.current], {
        opacity: 0,
        y: 20
      });
      gsap.set(infoPanelRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 25
      });
      gsap.set(pathRef.current, {
        strokeDashoffset: 2000
      });
      gsap.set(videoRef.current, {
        opacity: 0,
        scale: 1.05
      });

      // 2. Entrance Timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.4 }
      });

      tl.to(videoRef.current, {
        opacity: 0.45,
        scale: 1,
        duration: 4,
        ease: 'power2.inOut'
      }, 0);

      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2
      }, 0.5);

      tl.to('.headline-line .word', {
        y: '0%',
        stagger: 0.12,
        duration: 1.4,
        ease: 'power4.out'
      }, 0.7);

      tl.to('.headline-sub-title', {
        opacity: 1,
        y: 0,
        duration: 1.0
      }, 1.2);

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2
      }, 1.4);

      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2
      }, 1.6);

      tl.to(infoPanelRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.8,
        ease: 'elastic.out(1, 0.85)'
      }, 1.3);

      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 3.2,
        ease: 'power3.inOut'
      }, 1.0);

      tl.to(bottomBarRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2
      }, 1.8);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Effect 2: Organic Waving SVG Dream Line and Lerped Mouse Attraction
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHoverable = window.matchMedia('(hover: hover)').matches;

    let animId;
    let time = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
    };

    if (isHoverable && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const animateLine = () => {
      time += prefersReducedMotion ? 0.001 : 0.0045;

      // Smooth interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Mathematical cubic bezier shifts representing rising steam
      const y0 = 800 + Math.sin(time * 1.5) * 12 + mouseY * 15;
      const cx0 = 1100 + Math.cos(time * 1.2) * 18 + mouseX * 25;
      const cy0 = 750 + Math.sin(time * 0.8) * 20 + mouseY * 30;
      const cx1 = 950 + Math.sin(time * 1.0) * 15 + mouseX * 20;
      const cy1 = 500 + Math.cos(time * 1.4) * 22 + mouseY * 25;
      const y1 = 450 + Math.sin(time * 0.9) * 12 + mouseY * 15;
      const cx2 = 450 + Math.cos(time * 1.1) * 18 + mouseX * 25;
      const cy2 = 400 + Math.sin(time * 1.3) * 20 + mouseY * 35;
      const cx3 = 300 + Math.sin(time * 0.7) * 15 + mouseX * 15;
      const cy3 = 600 + Math.cos(time * 1.5) * 22 + mouseY * 25;
      const y2 = 500 + Math.sin(time * 1.1) * 15 + mouseY * 10;

      const pathString = `M1440,${y0} C${cx0},${cy0} ${cx1},${cy1} 700,${y1} C${cx2},${cy2} ${cx3},${cy3} 0,${y2}`;
      
      if (pathRef.current) {
        pathRef.current.setAttribute('d', pathString);
      }

      animId = requestAnimationFrame(animateLine);
    };

    animateLine();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Effect 3: Subtly magnetic mouse parallax offsets
  useEffect(() => {
    const isHoverable = window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isHoverable || prefersReducedMotion) return;

    let animId;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    const handleParallaxMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetParallaxX = (e.clientX - cx) / cx;
      targetParallaxY = (e.clientY - cy) / cy;
    };

    window.addEventListener('mousemove', handleParallaxMove);

    const updateParallax = () => {
      parallaxX += (targetParallaxX - parallaxX) * 0.06;
      parallaxY += (targetParallaxY - parallaxY) * 0.06;

      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate(${parallaxX * 22}px, ${parallaxY * 22}px)`;
      }

      if (infoPanelRef.current) {
        infoPanelRef.current.style.transform = `
          translate(${parallaxX * -12}px, ${parallaxY * -12}px)
          rotateY(${parallaxX * 4.5}deg)
          rotateX(${parallaxY * -4.5}deg)
        `;
      }

      if (shadowsRef.current) {
        shadowsRef.current.style.transform = `translate(${parallaxX * 45 - 5}%, ${parallaxY * 45 - 5}%)`;
      }

      if (logoRef.current) {
        logoRef.current.style.transform = `translate(${parallaxX * 6}px, ${parallaxY * 6}px)`;
      }

      animId = requestAnimationFrame(updateParallax);
    };

    updateParallax();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleParallaxMove);
    };
  }, []);

  return (
    <div ref={sectionRef} className="hero-viewport-container">
      
      {/* Editorial Header */}
      <header className="editorial-header">
        <div ref={logoRef} className="header-logo">
          <span className="logo-text">NÜMA</span>
          <span className="logo-sub">COFFEE KITCHEN</span>
        </div>
        <nav className="editorial-nav">
          <a href="#explore" className="nav-link">EXPLORE</a>
          <a href="#menu" className="nav-link">MENU</a>
          <a href="#dream" className="nav-link">THE DREAM</a>
          <a href="https://www.instagram.com/numa_coffee_kitchen/" target="_blank" rel="noopener noreferrer" className="nav-link nav-link-social">
            <span>INSTAGRAM</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="instagram-icon"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
        </nav>
      </header>

      {/* Cinematic Background Layer */}
      <div className="hero-bg-container">
        <video 
          ref={videoRef} 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/assets/numa-hero-poster.png"
        >
          <source src="/assets/numa-hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <div ref={shadowsRef} className="hero-botanical-shadows"></div>
      </div>

      {/* Ghost Background Typography */}
      <div className="ghost-typography-container" aria-hidden="true">
        <div className="ghost-text ghost-numa">NÜMA</div>
        <div className="ghost-text ghost-reve">RÊVE</div>
        <div className="ghost-text ghost-coffee">COFFEE KITCHEN</div>
      </div>

      {/* Signature Organic Dream Line */}
      <svg className="dream-line-svg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path 
          ref={pathRef}
          className="dream-line-path" 
          d="M1440,800 C1100,750 950,500 700,450 C450,400 300,600 0,500" 
          fill="none" 
          stroke="url(#dream-line-gradient)" 
          strokeWidth="2" 
        />
        <defs>
          <linearGradient id="dream-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-olive)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-olive-light)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero Interactive Grid */}
      <section className="hero-content-grid" aria-label="Nüma Hero Section">
        
        {/* Left Column: Headlines & CTAs */}
        <div className="hero-primary-col">
          <div ref={labelRef} className="hero-label-wrapper">
            <span className="hero-label">NÜMA COFFEE KITCHEN /// MENZAH 8</span>
          </div>

          <h1 ref={headlineRef} className="hero-headline" aria-label="Le Rêve Éveillé — Where Coffee Becomes A Waking Dream">
            <span className="headline-line headline-line-1">
              <span className="word">LE</span> <span className="word">RÊVE</span>
            </span>
            <span className="headline-line headline-line-2">
              <span className="word">ÉVEILLÉ</span>
            </span>
            <span className="headline-sub-title">WHERE COFFEE BECOMES A WAKING DREAM</span>
          </h1>

          <p ref={subtitleRef} className="hero-subtitle">
            A botanical coffee kitchen where nature, brunch, desserts, and slow moments meet culinary art.
          </p>

          <div ref={ctaRef} className="hero-cta-wrapper">
            <a href="#reserve" className="cta-btn cta-primary">
              <span className="btn-text">Reserve a Table</span>
            </a>
            <a href="#menu" className="cta-btn cta-secondary">
              <span className="btn-text">Explore the Menu</span>
            </a>
          </div>
        </div>

        {/* Right Column: Glassmorphic Details Card */}
        <div className="hero-sidebar-col">
          <div ref={infoPanelRef} className="info-panel-glass">
            <div className="botanical-corner top-left"></div>
            <div className="botanical-corner bottom-right"></div>

            <div className="info-section">
              <span className="info-label">OPEN DAILY</span>
              <h3 className="info-value">08:00 — 00:00</h3>
            </div>

            <div className="info-divider"></div>

            <div className="info-section">
              <span className="info-label">LOCATION</span>
              <h3 className="info-value">MENZAH 8</h3>
              <p className="info-subtext">Rue Mouawiya Ibn Abi Sofiene</p>
            </div>

            <div className="info-divider"></div>

            <div className="info-section">
              <span className="info-label">SIGNATURES</span>
              <div className="signature-chips">
                <span className="chip">Coffee</span>
                <span className="chip">Brunch</span>
                <span className="chip">Dessert</span>
                <span className="chip">Kitchen</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Bottom Bar Details & Scroll Line */}
      <footer ref={bottomBarRef} className="hero-bottom-bar">
        <div className="details-row">
          <span className="detail-item">08:00 — 00:00</span>
          <span className="detail-separator">•</span>
          <span className="detail-item">Menzah 8</span>
          <span className="detail-separator">•</span>
          <span className="detail-item">Coffee • Brunch • Dessert • Kitchen</span>
        </div>

        <div className="scroll-cue">
          <span className="scroll-text">SCROLL TO TASTE THE DREAM</span>
          <div className="scroll-line-container">
            <div className="scroll-line"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}
