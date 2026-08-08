import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LenisGsapProvider({ children }) {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // 2. Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Add Lenis to GSAP Ticker for 60+ FPS synchronization
    const updateGsapTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateGsapTicker);

    // Disable GSAP lag smoothing to keep Lenis and GSAP perfectly in sync
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateGsapTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 4. Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 5. Global ScrollTrigger Batch Reveal Animations for all pages
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = document.querySelectorAll(
        'section, .bg-white.border, [data-gsap="reveal"]'
      );

      elements.forEach((el) => {
        // Skip fixed navbar, sidebar, or footer
        if (el.closest('header') || el.closest('aside') || el.closest('footer')) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return <>{children}</>;
}
