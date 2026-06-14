import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './SignatureMenuSection.css';

const menuItems = [
  {
    id: "coffee",
    name: "Nüma Signature Coffee",
    category: "COFFEE",
    description: "A warm daily ritual built around aroma, balance, and slow conversation.",
    tag: "Coffee Ritual",
    price: "$8",
    image: "/assets/numa_menu_coffee.png",
    featured: true
  },
  {
    id: "brunch",
    name: "Botanical Brunch Plate",
    category: "BRUNCH",
    description: "Fresh textures, colorful details, and a plate designed for slow mornings.",
    tag: "Brunch",
    price: "$18",
    image: "/assets/numa_menu_brunch.png",
    featured: false
  },
  {
    id: "dessert",
    name: "Golden Dessert Plate",
    category: "DESSERT",
    description: "A soft, generous sweet moment finished with cream, fruit, and golden warmth.",
    tag: "Dessert",
    price: "$14",
    image: "/assets/numa_menu_dessert.png",
    featured: false
  },
  {
    id: "kitchen",
    name: "Nüma Kitchen Creation",
    category: "KITCHEN",
    description: "A crafted plate where comfort, freshness, and culinary detail meet.",
    tag: "Kitchen",
    price: "$22",
    image: "/assets/numa_menu_kitchen.png",
    featured: true
  },
  {
    id: "secret",
    name: "Secret Kitchen Item",
    category: "SECRET ITEMS",
    description: "A hidden favorite crafted for guests who like discovering something unexpected.",
    tag: "Secret",
    price: "$16",
    image: "/assets/numa_menu_secret.png",
    featured: false
  }
];

const categories = ["ALL", "COFFEE", "BRUNCH", "DESSERT", "KITCHEN", "SECRET ITEMS"];

export default function SignatureMenuSection() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const pathGlowRef = useRef(null);
  const galleryRef = useRef(null);
  const shadowsRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter items
  const filteredItems = activeCategory === "ALL" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Clear card refs on category switch to prevent stale refs
  cardRefs.current = [];

  const addToCardRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  // Effect 1: Track scroll progress for line/parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height + windowHeight;
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect 2: GSAP Entrance Animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.menu-word', { y: '0%' });
      gsap.set('.menu-reveal-label, .menu-reveal-desc, .menu-reveal-tabs, .menu-reveal-sensory, .menu-card', {
        opacity: 1,
        y: 0,
        scale: 1
      });
      return;
    }

    gsap.set('.menu-word', { y: '100%' });
    gsap.set(['.menu-reveal-label', '.menu-reveal-desc', '.menu-reveal-tabs', '.menu-reveal-sensory'], {
      opacity: 0,
      y: 20
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ctx = gsap.context(() => {
              const tl = gsap.timeline({
                defaults: { ease: 'power4.out', duration: 1.4 }
              });

              tl.to('.menu-reveal-label', { opacity: 1, y: 0, duration: 1.0 }, 0.1);
              tl.to('.menu-reveal-headline .menu-word', {
                y: '0%',
                stagger: 0.08,
                duration: 1.2
              }, 0.2);
              tl.to('.menu-reveal-desc', { opacity: 1, y: 0, duration: 1.0 }, 0.6);
              tl.to('.menu-reveal-tabs', { opacity: 1, y: 0, duration: 1.0 }, 0.7);
              tl.to('.menu-reveal-sensory', { opacity: 1, y: 0, duration: 1.2 }, 0.8);
              
              // Animate cards
              tl.to('.menu-card', {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.12,
                duration: 1.5,
                ease: 'power3.out'
              }, 0.6);

            }, sectionRef);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Effect 3: Handle card animations on category change
  useEffect(() => {
    if (cardRefs.current.length === 0) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(cardRefs.current, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // Trigger subtle fade-and-rise trigger for filtered cards
    gsap.fromTo(cardRefs.current, 
      { opacity: 0, y: 30, scale: 0.98 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        stagger: 0.08, 
        duration: 1.2, 
        ease: 'power3.out',
        overwrite: 'auto'
      }
    );
  }, [activeCategory]);

  // Effect 4: Waving SVG Dream Line connected from top-right to bottom-left
  useEffect(() => {
    let animId;
    let time = 0;

    const animateMenuLine = () => {
      time += 0.005;

      // Start of line on the right (x = 1440), connecting from bottom-right of DreamSection
      const yStart = 50 + Math.sin(time) * 12 + scrollProgress * 60;
      
      const cx0 = 1100 + Math.cos(time * 0.9) * 25;
      const cy0 = 200 + Math.sin(time * 1.2) * 35 - scrollProgress * 100;
      
      const cx1 = 700 + Math.sin(time * 1.1) * 20;
      const cy1 = 400 + Math.cos(time * 0.8) * 30 + scrollProgress * 120;
      
      const cx2 = 300 + Math.cos(time * 1.3) * 25;
      const cy2 = 600 + Math.sin(time * 0.9) * 35 - scrollProgress * 80;
      
      const yEnd = 850 + Math.sin(time * 1.2) * 15 + scrollProgress * 50;

      // Draw path starting from top-right (1440, yStart) weaving down to bottom-left (0, yEnd)
      const pathString = `M1440,${yStart} C${cx0},${cy0} ${cx1},${cy1} 720,${cy1 - 50} C${cx2},${cy2} 250,${cy2 + 100} 0,${yEnd}`;

      if (pathRef.current) {
        pathRef.current.setAttribute('d', pathString);
      }
      if (pathGlowRef.current) {
        pathGlowRef.current.setAttribute('d', pathString);
      }

      animId = requestAnimationFrame(animateMenuLine);
    };

    animateMenuLine();

    return () => cancelAnimationFrame(animId);
  }, [scrollProgress]);

  // Effect 5: Mouse Parallax and shadows drift
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

      if (shadowsRef.current) {
        shadowsRef.current.style.transform = `translate(${currentX * 35}px, ${currentY * 35}px)`;
      }

      // Parallax menu cards subtle image translation
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const img = card.querySelector('.menu-card-image');
        if (img) {
          const depth = (idx + 1) * 6;
          img.style.transform = `scale(1.04) translate(${currentX * -depth}px, ${currentY * -depth}px)`;
        }
      });

      animId = requestAnimationFrame(updateParallax);
    };

    updateParallax();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeCategory]);

  return (
    <section 
      ref={sectionRef} 
      className="menu-section-container" 
      id="menu"
      aria-label="Nüma Culinary Experience"
    >
      {/* Decorative Overlays */}
      <div className="menu-bg-leak"></div>
      <div className="menu-film-grain"></div>
      <div ref={shadowsRef} className="menu-botanical-shadows" aria-hidden="true"></div>

      {/* Watermark */}
      <div className="menu-ghost-typography" aria-hidden="true">
        <div className="menu-ghost-text">TASTE</div>
      </div>

      {/* Signature SVG Dream Line */}
      <svg className="menu-section-line-svg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path 
          ref={pathGlowRef}
          className="dream-line-glow" 
          d="M1440,50 C1100,200 700,400 720,350 C300,600 250,700 0,850" 
          fill="none" 
          stroke="url(#menu-section-gradient-glow)" 
          strokeWidth="8" 
        />
        <path 
          ref={pathRef}
          className="dream-line-path" 
          d="M1440,50 C1100,200 700,400 720,350 C300,600 250,700 0,850" 
          fill="none" 
          stroke="url(#menu-section-gradient)" 
          strokeWidth="2" 
        />
        <defs>
          <linearGradient id="menu-section-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-olive-light)" stopOpacity="0.1" />
            <stop offset="40%" stopColor="var(--color-gold)" stopOpacity="0.85" />
            <stop offset="70%" stopColor="var(--color-gold-bright)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-olive)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="menu-section-gradient-glow" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-olive-light)" stopOpacity="0.0" />
            <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-olive)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="menu-split-grid">
        {/* Left Sticky Editorial Column */}
        <div className="menu-sticky-col">
          <div className="menu-reveal-label">
            <span className="menu-label-tag">SIGNATURES ///</span>
          </div>

          <h2 className="menu-headline menu-reveal-headline">
            <span className="menu-headline-line">
              <span className="menu-word">A</span> <span className="menu-word">MENU</span> <span className="menu-word">THAT</span>
            </span>
            <span className="menu-headline-line">
              <span className="menu-word">FEELS</span> <span className="menu-word">LIKE</span>
            </span>
            <span className="menu-headline-line">
              <span className="menu-word">A</span> <span className="menu-word">MOMENT.</span>
            </span>
          </h2>

          <p className="menu-paragraph menu-reveal-desc">
            From slow coffee to colorful brunch plates and delicate desserts, every Nüma creation is designed to feel crafted, warm, and unforgettable.
          </p>

          {/* Interactive Categories Selector */}
          <nav className="menu-category-tabs menu-reveal-tabs" role="tablist" aria-label="Menu category filters">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                aria-controls={`menu-gallery-${cat}`}
                className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className="tab-indicator-dot"></span>
              </button>
            ))}
          </nav>

          {/* Sensory Notes Panel */}
          <div className="sensory-notes-module menu-reveal-sensory">
            <span className="sensory-label">SENSORY NOTES ///</span>
            <div className="sensory-items">
              <div className="sensory-row">
                <span className="sensory-item">Warmth</span>
                <span className="sensory-dot">•</span>
                <span className="sensory-item">Aroma</span>
              </div>
              <div className="sensory-divider"></div>
              <div className="sensory-row">
                <span className="sensory-item">Texture</span>
                <span className="sensory-dot">•</span>
                <span className="sensory-item">Color</span>
              </div>
              <div className="sensory-divider"></div>
              <div className="sensory-row">
                <span className="sensory-item">Slow moments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Asymmetric "Tasting Table" Gallery */}
        <div 
          ref={galleryRef} 
          className="menu-gallery-col" 
          id={`menu-gallery-${activeCategory}`}
          role="tabpanel"
        >
          {filteredItems.map((item, idx) => {
            // Render first item as Featured Dish (unless filtering, but wait, first item in array is always featured-style to anchor the layout)
            const isFeatured = idx === 0;
            return (
              <div
                key={item.id}
                ref={addToCardRefs}
                className={`menu-card ${isFeatured ? 'card-featured' : 'card-supporting'} card-${item.id}`}
              >
                <div className="menu-card-img-wrapper">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="menu-card-image" 
                  />
                  <div className="menu-card-ambient-shadow"></div>
                </div>

                <div className="menu-card-glass-panel">
                  <div className="menu-card-corner top-left"></div>
                  <div className="menu-card-corner bottom-right"></div>
                  
                  <div className="card-header-row">
                    <span className="menu-item-tag">{item.tag}</span>
                    <span className="menu-item-price">{item.price}</span>
                  </div>

                  <h3 className="menu-item-title">{item.name}</h3>
                  <p className="menu-item-desc">{item.description}</p>
                  
                  {isFeatured && (
                    <div className="menu-featured-indicator">
                      <span>NÜMA KITCHEN /// SERVED DAILY</span>
                    </div>
                  )}
                  <div className="menu-card-glow-indicator"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refined CTA Footer */}
      <footer className="menu-section-footer">
        <div className="footer-content">
          <p className="footer-manifesto">The full menu lives in the details.</p>
          <div className="footer-cta-wrapper">
            <a href="#menu-full" className="menu-cta-btn btn-explore">
              <span>Explore Full Menu</span>
            </a>
            <a 
              href="https://www.instagram.com/numa_coffee_kitchen/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="menu-cta-link"
            >
              <span>View on Instagram</span>
              <svg className="menu-cta-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
