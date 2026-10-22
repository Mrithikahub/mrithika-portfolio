import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useScramble } from "../../hooks/useScramble";

/** Mono section index ("01 / ABOUT") that decodes when it scrolls into view. */
export function ScrambleLabel({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const wrap = useRef<HTMLParagraphElement>(null);
  const inView = useInView(wrap, { once: true, amount: 1 });
  const ref = useScramble<HTMLSpanElement>(inView ? text : "", { speed: 18, instant: reduce });
  return (
    <p ref={wrap} className={`mono-label text-ink-faint ${className}`}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="inline-block min-h-[1.4em]" />
    </p>
  );
}
