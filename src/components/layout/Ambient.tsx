import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { Z } from "../../lib/layers";
import { contact } from "../../data/content";

/**
 * Page-level atmosphere, all fixed and pointer-events-none:
 * - two soft colour fields (orange, teal) that trade places as you scroll
 * - a film-grain overlay
 * - the thin scroll progress bar
 * - the "PORTFOLIO" corner label
 * Only transform and opacity animate, so everything stays on the compositor.
 */
export function Ambient() {
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const warmY = useTransform(scrollYProgress, [0, 1], ["-10%", "60%"]);
  const warmOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.9, 0.35, 0.7, 0.5]);
  const coolY = useTransform(scrollYProgress, [0, 1], ["50%", "-10%"]);
  const coolOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.35, 0.9, 0.4, 0.8]);
  // The corner label steps aside when the footer arrives.
  const cornerOpacity = useTransform(scrollYProgress, [0.94, 0.99], [1, 0]);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: Z.ambient }}>
        <motion.div
          className="absolute -left-[20vw] h-[80vh] w-[80vw] rounded-full"
          style={{
            y: reduce ? 0 : warmY,
            opacity: reduce ? 0.6 : warmOpacity,
            background: "radial-gradient(closest-side, var(--accent-soft), transparent)",
          }}
        />
        <motion.div
          className="absolute -right-[20vw] h-[80vh] w-[80vw] rounded-full"
          style={{
            y: reduce ? "20%" : coolY,
            opacity: reduce ? 0.6 : coolOpacity,
            background: "radial-gradient(closest-side, var(--teal-soft), transparent)",
          }}
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: Z.grain }}>
        <div
          className="absolute -inset-[10%] opacity-[0.07] mix-blend-multiply dark:opacity-[0.09] dark:mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            animation: reduce ? undefined : "grain 1.2s steps(4) infinite",
          }}
        />
      </div>

      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-[2px] origin-left bg-accent"
        style={{ scaleX: scrollYProgress, zIndex: Z.progress }}
      />

      <motion.p
        aria-hidden="true"
        className="mono-label pointer-events-none fixed bottom-6 left-6 hidden text-ink-faint lg:block lg:left-10"
        style={{ zIndex: Z.corner, opacity: cornerOpacity }}
      >
        {contact.footer.corner}
      </motion.p>
    </>
  );
}
