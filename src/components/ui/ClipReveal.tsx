import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type From = "bottom" | "left" | "right" | "top";

const hidden: Record<From, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

interface Props {
  children: ReactNode;
  from?: From;
  delay?: number;
  duration?: number;
  className?: string;
  innerClassName?: string;
  /** Rounded corners for the clip so the wipe matches the card shape. */
  radius?: number;
}

/**
 * Clip-path wipe reveal on scroll. The in-view check lives on the unclipped outer element:
 * an element clipped to nothing reads as zero-size to IntersectionObserver and would never trigger.
 */
export function ClipReveal({ children, from = "bottom", delay = 0, duration = 1.1, className = "", innerClassName = "", radius = 0 }: Props) {
  const reduce = useReducedMotion();
  const round = radius ? ` round ${radius}px` : "";
  return (
    <motion.div className={className} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <motion.div
        className={innerClassName}
        variants={{
          hidden: { clipPath: hidden[from] + round },
          show: { clipPath: `inset(0% 0% 0% 0%${round})`, transition: { duration, delay, ease: [0.76, 0, 0.24, 1] } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
