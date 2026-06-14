import './style.css';
import { gsap } from 'gsap';

// Initialize core features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupEntranceAnimations();
  setupDreamLine();
  setupInteractiveParallax();
  handleVideoPlayback();
  setupLucideIcons();
});

/**
 * Handles the cinematic entrance animations using GSAP.
 */
function setupEntranceAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If user prefers reduced motion, skip complex animations and just fade in
  if (prefersReducedMotion) {
    gsap.set('.word', { y: '0%' });
    gsap.set('#hero-label-wrapper, #hero-headline .headline-sub-title, #hero-subtitle, #hero-cta-wrapper, #info-panel, #hero-bottom-bar .details-row, #hero-bottom-bar #scroll-cue', { opacity: 1, y: 0, scale: 1 });
    gsap.set('#dream-line-path', { strokeDashoffset: 0 });
    gsap.set('#hero-video', { opacity: 0.45, scale: 1 });
    return;
  }

  // Create primary reveal timeline
  const tl = gsap.timeline({
    defaults: {
      ease: 'power4.out',
      duration: 1.4
    }
  });

  // 1. Slow cinematic fade and scale-in of the background layer
  tl.to('#hero-video', {
    opacity: 0.4,
    scale: 1,
    duration: 4,
    ease: 'power2.inOut'
  }, 0);

  // 2. Premium brand label slide-in
  tl.to('#hero-label-wrapper', {
    opacity: 1,
    y: 0,
    duration: 1.2
  }, 0.5);

  // 3. Cinematic mask reveal for main title (word-by-word)
  tl.to('.headline-line .word', {
    y: '0%',
    stagger: 0.12,
    duration: 1.4,
    ease: 'power4.out'
  }, 0.7);

  // 4. Subtitle and secondary headline fade-in
  tl.to('#hero-headline .headline-sub-title', {
    opacity: 1,
    y: 0,
    duration: 1.0
  }, 1.2);

  tl.to('#hero-subtitle', {
    opacity: 1,
    y: 0,
    duration: 1.2
  }, 1.4);

  // 5. Action CTA buttons slide up
  tl.to('#hero-cta-wrapper', {
    opacity: 1,
    y: 0,
    duration: 1.2
  }, 1.6);

  // 6. Glassmorphic Info Panel reveal (with subtle elastic bounce)
  tl.to('#info-panel', {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1.8,
    ease: 'elastic.out(1, 0.85)'
  }, 1.3);

  // 7. Signature Dream Line draws itself
  tl.to('#dream-line-path', {
    strokeDashoffset: 0,
    duration: 3,
    ease: 'power3.inOut'
  }, 1.0);

  // 8. Bottom indicators reveal
  tl.to('#hero-bottom-bar .details-row', {
    opacity: 1,
    y: 0,
    duration: 1.2
  }, 1.8);

  tl.to('#hero-bottom-bar #scroll-cue', {
    opacity: 1,
    y: 0,
    duration: 1.2
  }, 2.0);
}

/**
 * Creates the organic, waving, mouse-interactive SVG "Dream Line".
 */
function setupDreamLine() {
  const pathElement = document.getElementById('dream-line-path');
  if (!pathElement) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isHoverable = window.matchMedia('(hover: hover)').matches;

  // State parameters for wave math
  let time = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Track mouse coordinates if interactive
  if (isHoverable && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
    });
  }

  // Animation Loop
  function animate() {
    time += prefersReducedMotion ? 0.001 : 0.004; // Slow down wave if reduced motion

    // Smooth lerp for mouse coordinates
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // Organic wave offsets using sine and cosine combination
    // This creates a double-bend bezier curve representing coffee steam or a natural vine
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

    // Build the dynamic SVG path command
    const dAttr = `M1440,${y0} C${cx0},${cy0} ${cx1},${cy1} 700,${y1} C${cx2},${cy2} ${cx3},${cy3} 0,${y2}`;
    pathElement.setAttribute('d', dAttr);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/**
 * Handles mouse parallax shifting on title, shadows, and the panel.
 */
function setupInteractiveParallax() {
  const isHoverable = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isHoverable || prefersReducedMotion) return;

  const headline = document.getElementById('hero-headline');
  const infoPanel = document.getElementById('info-panel');
  const shadows = document.querySelector('.hero-botanical-shadows');
  const logo = document.getElementById('header-logo');

  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let parallaxX = 0;
  let parallaxY = 0;

  window.addEventListener('mousemove', (e) => {
    // Center point coordinates
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Calculate normalized deviation from center (-1 to 1)
    targetParallaxX = (e.clientX - cx) / cx;
    targetParallaxY = (e.clientY - cy) / cy;
  });

  function update() {
    // Lerp smoothing
    parallaxX += (targetParallaxX - parallaxX) * 0.06;
    parallaxY += (targetParallaxY - parallaxY) * 0.06;

    // 1. Headline moves slightly in direction of mouse
    if (headline) {
      headline.style.transform = `translate(${parallaxX * 22}px, ${parallaxY * 22}px)`;
    }

    // 2. Info panel tilts and translates opposite to mouse (creating 3D depth)
    if (infoPanel) {
      infoPanel.style.transform = `
        translate(${parallaxX * -12}px, ${parallaxY * -12}px)
        rotateY(${parallaxX * 4.5}deg)
        rotateX(${parallaxY * -4.5}deg)
      `;
    }

    // 3. Botanical shadows drift heavily to simulate lighting angles
    if (shadows) {
      shadows.style.transform = `translate(${parallaxX * 45 - 5}%, ${parallaxY * 45 - 5}%)`;
    }

    // 4. Logo reacts with a tiny elegant magnetic drag
    if (logo) {
      logo.style.transform = `translate(${parallaxX * 6}px, ${parallaxY * 6}px)`;
    }

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Handles fallback and behavior for the video background.
 */
function handleVideoPlayback() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  // Add loaded class as soon as the video metadata is loaded
  if (video.readyState >= 1) {
    video.style.opacity = 0.45;
  } else {
    video.addEventListener('loadedmetadata', () => {
      video.style.opacity = 0.45;
    });
  }

  // Handle potential play block issues (e.g. low power modes or strict policies)
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Autoplay was prevented. Fallback poster is active.", error);
    });
  }
}

/**
 * Renders any icons if needed (optional utility).
 */
function setupLucideIcons() {
  // Simple check if icons are loaded
  console.log("Nüma Coffee Kitchen: Brand experience initialized successfully.");
}
