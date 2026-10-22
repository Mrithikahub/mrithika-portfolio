import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { notFound, contact, site } from "../../data/content";
import { MagneticButton } from "../ui/MagneticButton";
import { ThemeToggle } from "../ui/ThemeToggle";
import { DotMatrix404 } from "./DotMatrix404";

/** Standalone 404 page: halftone "404" that scatters around the cursor, a mono status line, and a way home. */
export function NotFound() {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = `404 · ${site.name}`;
  }, []);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-bg">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-50" />

      <header className="relative flex h-[var(--header-h)] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href="/" className="mono-label text-ink hover:text-accent-ink">
          {site.name}
        </a>
        <ThemeToggle />
      </header>

      <main className="relative mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center px-4 pb-16 text-center">
        <motion.div className="h-[clamp(180px,34vw,380px)] w-full" {...rise(0)}>
          <DotMatrix404 text={notFound.code} />
        </motion.div>
        <motion.p className="mt-6 font-mono text-[15px] text-ink sm:text-base" {...rise(0.25)}>
          {notFound.line}
          <span className="caret ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[2px] bg-accent" aria-hidden="true" />
        </motion.p>
        <motion.h1 className="mt-3 max-w-[30ch] font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-tight tracking-tight text-ink" {...rise(0.35)}>
          {notFound.body}
        </motion.h1>
        <motion.div className="mt-8" {...rise(0.45)}>
          <MagneticButton href="/" arrow>
            {notFound.cta}
          </MagneticButton>
        </motion.div>
      </main>

      <footer className="relative px-4 pb-6 sm:px-6 lg:px-10">
        <p className="mono-label text-ink-faint">{contact.footer.corner}</p>
      </footer>
    </div>
  );
}
