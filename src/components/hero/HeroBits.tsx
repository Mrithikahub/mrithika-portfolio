import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { hero } from "../../data/content";
import { useScramble } from "../../hooks/useScramble";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

/** Cycles the hero taglines with a decode transition and a blinking block caret. */
export function Tagline({ start }: { start: boolean }) {
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const text = start ? hero.taglines[index] : "";
  const ref = useScramble<HTMLSpanElement>(text, { speed: 22, instant: reduce });

  useEffect(() => {
    if (!start || reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % hero.taglines.length), 3600);
    return () => window.clearInterval(id);
  }, [start, reduce]);

  return (
    <p className="flex min-h-[1.6em] items-center font-mono text-[15px] text-ink sm:text-lg" aria-live="off">
      <span className="mr-2 text-accent-ink" aria-hidden="true">
        &gt;
      </span>
      <span className="sr-only">{hero.taglines[0]}</span>
      <span ref={ref} aria-hidden="true" />
      <span className="caret ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[1px] bg-accent" aria-hidden="true" />
    </p>
  );
}

/** "stack /" followed by a vertical word ticker. */
export function StackTicker({ start }: { start: boolean }) {
  const reduce = usePrefersReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!start || reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % hero.stack.length), 1700);
    return () => window.clearInterval(id);
  }, [start, reduce]);

  return (
    <p className="flex items-center gap-3 font-mono text-[13px]">
      <span className="text-ink-faint">{hero.stackPrefix} /</span>
      <span className="sr-only">{hero.stack.join(", ")}</span>
      <span className="relative inline-flex h-6 min-w-[11ch] items-center overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={hero.stack[i]}
            className="absolute left-0 inline-flex items-center gap-2 whitespace-nowrap text-ink"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="h-1.5 w-1.5 rounded-[2px] bg-teal" />
            {hero.stack[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-ink-faint">+{hero.stack.length - 1}</span>
    </p>
  );
}

const istFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live availability + IST clock. Re-renders once per second, nothing else. */
export function StatusWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = `${istFormat.format(now)} ${hero.statusTimezone}`;
  const [lead, extra] = hero.status.split(" · ");

  // On phones the clock drops below the pill so the status line never wraps.
  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <div className="glass inline-flex items-center gap-2.5 whitespace-nowrap rounded-full py-2 pl-3 pr-4 font-mono text-[11px] text-ink sm:gap-3 sm:text-[12px]">
        <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
          <span className="status-ping absolute inset-0 rounded-full bg-ok" />
          <span className="relative h-2 w-2 rounded-full bg-ok" />
        </span>
        <span>
          {lead}
          {extra && <span className="hidden sm:inline"> · {extra}</span>}
        </span>
        <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden="true" />
        <time className="hidden tabular-nums text-ink-soft sm:inline" dateTime={now.toISOString()} aria-label={`Current time in India ${time}`}>
          {time}
        </time>
      </div>
      <p className="pl-3 font-mono text-[11px] text-ink-soft sm:hidden">
        {extra && <span className="text-ink">{extra}</span>}
        {extra && <span className="mx-2 text-ink-faint" aria-hidden="true">|</span>}
        <time className="tabular-nums text-ink-faint" dateTime={now.toISOString()} aria-label={`Current time in India ${time}`}>
          {time}
        </time>
      </p>
    </div>
  );
}

/** Animated mouse outline: the hero's only scroll hint. */
export function ScrollCue({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 text-ink-faint transition-colors hover:text-ink"
      aria-label="Scroll to the next section"
      data-cursor-snap=""
    >
      <span className="relative flex h-9 w-6 justify-center rounded-full border border-current pt-1.5">
        <span className="wheel-dot h-1.5 w-1 rounded-full bg-accent" />
      </span>
      <span className="mono-label">{hero.scrollCue}</span>
    </button>
  );
}
