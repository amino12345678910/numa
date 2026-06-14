import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './DreamSection.css';

export default function DreamSection() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const pathGlowRef = useRef(null);
  const stickyColRef = useRef(null);
  const shadowsRef = useRef(null);
  const cardRefs = useRef([]);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Helper to store card refs dynamically
  const addToCardRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  // Effect 1: Track scroll progress through this section for parallax/dream-line shift
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Progress from 0 (section starts entering bottom) to 1 (section fully leaves top)
      const totalScrollable = rect.height + windowHeight;
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect 2: GSAP Entrance Animations triggered when section enters viewport
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.dream-word', { y: '0%' });
      gsap.set('.dream-reveal-label, .dream-reveal-desc, .dream-reveal-quote, .dream-card', {
        opacity: 1,
        y: 0,
        scale: 1
      });
      return;
    }

    // Initialize states
    gsap.set('.dream-word', { y: '100%' });
    gsap.set(['.dream-reveal-label', '.dream-reveal-desc', '.dream-reveal-quote'], {
      opacity: 0,
      y: 20
    });
    gsap.set('.dream-card', {
      opacity: 0,
      y: 40,
      scale: 0.96
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ctx = gsap.context(() => {
              const tl = gsap.timeline({
                defaults: { ease: 'power4.out', duration: 1.4 }
              });

              tl.to('.dream-reveal-label', {
                opacity: 1,
                y: 0,
                duration: 1.0
              }, 0.1);

              tl.to('.dream-reveal-headline .dream-word', {
                y: '0%',
                stagger: 0.08,
                duration: 1.2,
                ease: 'power4.out'
              }, 0.2);

              tl.to('.dream-reveal-desc', {
                opacity: 1,
                y: 0,
                duration: 1.0
              }, 0.7);

              tl.to('.dream-reveal-quote', {
                opacity: 1,
                y: 0,
                duration: 1.0
              }, 0.9);

              tl.to('.dream-card', {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.15,
                duration: 1.6,
                ease: 'power3.out'
              }, 0.6);

            }, sectionRef);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Effect 3: Waving SVG Dream Line tied to scroll progress
  useEffect(() => {
    let animId;
    let time = 0;

    const animateDreamSectionLine = () => {
      time += 0.0055;

      // Base nodes weaving dynamically
      // Start of line on the left (x = 0), matching the exit point of hero
      const yStart = 100 + Math.sin(time) * 15;
      
      // Control points shifting with time + scroll progress
      const cx0 = 300 + Math.sin(time * 0.8) * 25;
      const cy0 = 250 + Math.cos(time * 1.1) * 35 + scrollProgress * 120;
      
      const cx1 = 700 + Math.cos(time * 0.9) * 20;
      const cy1 = 450 + Math.sin(time * 1.3) * 40 - scrollProgress * 150;
      
      const cx2 = 1100 + Math.sin(time * 1.2) * 30;
      const cy2 = 650 + Math.cos(time * 0.7) * 35 + scrollProgress * 100;
      
      const yEnd = 800 + Math.sin(time * 1.1) * 20 - scrollProgress * 50;

      // Draw path starting from top-left (0, yStart) weaving down to bottom-right (1440, yEnd)
      const pathString = `M0,${yStart} C${cx0},${cy0} ${cx1},${cy1} 720,${cy1 + 50} C${cx2},${cy2} 1150,${cy2 - 100} 1440,${yEnd}`;

      if (pathRef.current) {
        pathRef.current.setAttribute('d', pathString);
      }
      if (pathGlowRef.current) {
        pathGlowRef.current.setAttribute('d', pathString);
      }

      animId = requestAnimationFrame(animateDreamSectionLine);
    };

    animateDreamSectionLine();

    return () => cancelAnimationFrame(animId);
  }, [scrollProgress]);

  // Effect 4: Mouse Move Parallax offsets inside the section
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHoverable = window.matchMedia('(hover: hover)').matches;

    if (!isHoverable || prefersReducedMotion) return;

    let animId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Parallax shadows
      if (shadowsRef.current) {
        shadowsRef.current.style.transform = `translate(${currentX * 30}px, ${currentY * 30}px)`;
      }

      // Parallax card imagery subtle shifts
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const img = card.querySelector('.dream-card-image');
        if (img) {
          const depth = (idx + 1) * 8;
          img.style.transform = `scale(1.05) translate(${currentX * -depth}px, ${currentY * -depth}px)`;
        }
      });

      animId = requestAnimationFrame(updateParallax);
    };

    updateParallax();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="dream-section-container" 
      id="dream"
      aria-label="Nüma Brand Philosophy"
    >
      {/* Editorial Background Aesthetics */}
      <div className="dream-bg-leak"></div>
      <div className="dream-film-grain"></div>
      <div ref={shadowsRef} className="dream-botanical-shadows" aria-hidden="true"></div>

      {/* Large Watermark Background typography */}
      <div className="dream-ghost-typography" aria-hidden="true">
        <div className="dream-ghost-text">RÊVE</div>
      </div>

      {/* Dynamic Visual Dream Line Waving */}
      <svg className="dream-section-line-svg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path 
          ref={pathGlowRef}
          className="dream-line-glow" 
          d="M0,100 C300,250 700,450 720,500 C1100,650 1150,550 1440,800" 
          fill="none" 
          stroke="url(#dream-section-gradient-glow)" 
          strokeWidth="8" 
        />
        <path 
          ref={pathRef}
          className="dream-line-path" 
          d="M0,100 C300,250 700,450 720,500 C1100,650 1150,550 1440,800" 
          fill="none" 
          stroke="url(#dream-section-gradient)" 
          strokeWidth="2" 
        />
        <defs>
          <linearGradient id="dream-section-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-olive-light)" stopOpacity="0.1" />
            <stop offset="35%" stopColor="var(--color-gold)" stopOpacity="0.8" />
            <stop offset="65%" stopColor="var(--color-gold-bright)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-olive)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="dream-section-gradient-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-olive-light)" stopOpacity="0.0" />
            <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-olive)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="dream-split-grid">
        {/* Left Editorial Sticky Block */}
        <div ref={stickyColRef} className="dream-sticky-col">
          <div className="dream-reveal-label">
            <span className="dream-label-tag">THE DREAM ///</span>
          </div>

          <h2 className="dream-headline dream-reveal-headline">
            <span className="headline-line">
              <span className="dream-word">A</span> <span className="dream-word">WAKING</span>
            </span>
            <span className="headline-line">
              <span className="dream-word">DREAM,</span>
            </span>
            <span className="headline-line">
              <span className="dream-word">SERVED</span> <span className="dream-word">DAILY.</span>
            </span>
          </h2>

          <p className="dream-paragraph dream-reveal-desc">
            At Nüma, coffee is not rushed, brunch is not ordinary, and every detail is designed to slow the world down. Between warm light, botanical textures, crafted plates, and quiet moments, the experience becomes more than a meal — it becomes a waking dream.
          </p>

          <div className="dream-quote-box dream-reveal-quote">
            <div className="quote-indicator"></div>
            <p className="quote-text">“Come for coffee. Stay inside the dream.”</p>
          </div>
        </div>

        {/* Right Stacked Animated Cards */}
        <div className="dream-cards-col">
          
          {/* Card 1: Nature */}
          <div ref={addToCardRefs} className="dream-card">
            <div className="dream-card-img-wrapper">
              <img 
                src="/assets/numa_nature.png" 
                alt="Nüma Nature Concept" 
                className="dream-card-image" 
              />
              <div className="dream-card-image-overlay overlay-nature"></div>
              <div className="dream-card-ambient-shadow"></div>
            </div>
            
            <div className="dream-card-glass-panel">
              <div className="card-corner top-left"></div>
              <div className="card-corner bottom-right"></div>
              <span className="card-index">01</span>
              <h3 className="card-title">NATURE</h3>
              <p className="card-desc">
                Greenery, calm textures, and soft light shape the atmosphere.
              </p>
              <div className="card-glow-indicator"></div>
            </div>
          </div>

          {/* Card 2: Coffee */}
          <div ref={addToCardRefs} className="dream-card">
            <div className="dream-card-img-wrapper">
              <img 
                src="/assets/numa_coffee.png" 
                alt="Nüma Coffee Ritual" 
                className="dream-card-image" 
              />
              <div className="dream-card-image-overlay overlay-coffee"></div>
              <div className="dream-card-ambient-shadow"></div>
            </div>
            
            <div className="dream-card-glass-panel">
              <div className="card-corner top-left"></div>
              <div className="card-corner bottom-right"></div>
              <span className="card-index">02</span>
              <h3 className="card-title">COFFEE</h3>
              <p className="card-desc">
                A daily ritual of aroma, warmth, and slow conversation.
              </p>
              <div className="card-glow-indicator"></div>
            </div>
          </div>

          {/* Card 3: Kitchen */}
          <div ref={addToCardRefs} className="dream-card">
            <div className="dream-card-img-wrapper">
              <img 
                src="/assets/numa_kitchen.png" 
                alt="Nüma Kitchen Artistry" 
                className="dream-card-image" 
              />
              <div className="dream-card-image-overlay overlay-kitchen"></div>
              <div className="dream-card-ambient-shadow"></div>
            </div>
            
            <div className="dream-card-glass-panel">
              <div className="card-corner top-left"></div>
              <div className="card-corner bottom-right"></div>
              <span className="card-index">03</span>
              <h3 className="card-title">KITCHEN</h3>
              <p className="card-desc">
                Brunch, desserts, and plates crafted like small pieces of art.
              </p>
              <div className="card-glow-indicator"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
