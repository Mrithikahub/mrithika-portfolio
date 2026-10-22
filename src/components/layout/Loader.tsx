import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { loader } from "../../data/content";
import { useIntro } from "../../providers/IntroProvider";
import { useSmoothScroll } from "../../providers/SmoothScroll";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { Z } from "../../lib/layers";

const LINE_STEP = 0.2;
const HOLD_MS = 1000;

// Phones and tablets skip the boot sequence: on a slow device it only delays the hero (LCP).
const skipOnThisDevice = () => window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;

/** Terminal-style boot sequence (about 1.3s total) on desktop, then a wipe up into the hero. */
export function Loader() {
  const { markReady } = useIntro();
  const { stop, start } = useSmoothScroll();
  const reduce = usePrefersReducedMotion();
  const [skip] = useState(skipOnThisDevice);
  const [visible, setVisible] = useState(!skip);

  useEffect(() => {
    if (reduce || skip) {
      setVisible(false);
      markReady();
      return;
    }
    stop();
    const t = window.setTimeout(() => {
      setVisible(false);
      markReady();
      start();
    }, HOLD_MS);
    return () => window.clearTimeout(t);
    // markReady/start/stop are stable for the page lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
          className="fixed inset-0 flex items-end bg-bg px-6 pb-10 sm:px-10 sm:pb-14"
          style={{ zIndex: Z.loader }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative w-full max-w-md font-mono text-[13px] leading-7 text-ink-soft">
            {loader.lines.map((line, i) => (
              <motion.div
                key={line}
                className="flex justify-between gap-6"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * LINE_STEP, duration: 0.25 }}
              >
                <span>{line}...</span>
                <motion.span
                  className="text-teal-deep"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * LINE_STEP + 0.16, duration: 0.1 }}
                >
                  ok
                </motion.span>
              </motion.div>
            ))}
            <motion.div
              className="mt-3 flex items-center gap-3 text-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: loader.lines.length * LINE_STEP }}
            >
              <span className="text-accent-ink">✓</span>
              <span>{loader.done}</span>
              <span className="caret inline-block h-4 w-2 bg-accent" />
            </motion.div>
            <div className="mt-5 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full origin-left bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000 - 0.05, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
