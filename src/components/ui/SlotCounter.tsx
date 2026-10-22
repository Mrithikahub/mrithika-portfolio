import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const DIGITS = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * Number that rolls into place like a slot machine: each digit spins through a 0-9 strip
 * (twice for the first column) and lands on its value. Screen readers just read the number.
 */
export function SlotCounter({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const digits = String(value).split("").map(Number);

  return (
    <span ref={ref} className={`inline-flex items-baseline tabular-nums ${className}`}>
      <span className="sr-only">{`${value}${suffix}`}</span>
      {digits.map((d, i) => {
        // Land on the second loop so every column visibly spins.
        const target = 10 + d;
        return (
          <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none" aria-hidden="true">
            <motion.span
              className="flex flex-col"
              initial={{ y: reduce ? `-${target * 5}%` : "0%" }}
              animate={inView || reduce ? { y: `-${target * 5}%` } : undefined}
              transition={{ duration: 1.4 + i * 0.25, ease: [0.2, 0.9, 0.25, 1], delay: 0.1 + i * 0.08 }}
            >
              {DIGITS.map((n, k) => (
                <span key={k} className="block h-[1em] leading-none">
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}
