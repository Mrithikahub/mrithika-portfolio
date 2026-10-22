import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

interface ScrollCtx {
  scrollTo: (target: string | number) => void;
  stop: () => void;
  start: () => void;
}

const Ctx = createContext<ScrollCtx>({
  scrollTo: (target) => {
    if (typeof target === "number") window.scrollTo({ top: target });
    else document.querySelector(target)?.scrollIntoView();
  },
  stop: () => {},
  start: () => {},
});

/** Lenis inertial scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. Off under reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // Pinned sections measure layout; re-measure once fonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    // Debounced: refreshing resizes pin spacers, which would otherwise re-trigger the observer.
    let t = 0;
    let lastHeight = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastHeight) < 2) return;
        lastHeight = h;
        ScrollTrigger.refresh();
      }, 250);
    });
    ro.observe(document.body);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  const api: ScrollCtx = {
    scrollTo: (target) => {
      // Sections mount progressively (see Sections.tsx); ask for the rest, then retry next frame.
      if (typeof target === "string" && !document.querySelector(target)) {
        window.dispatchEvent(new Event("portfolio:mount-all"));
        requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(target) && api.scrollTo(target)));
        return;
      }
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        return;
      }
      if (typeof target === "number") window.scrollTo({ top: target });
      else document.querySelector(target)?.scrollIntoView();
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSmoothScroll(): ScrollCtx {
  return useContext(Ctx);
}
