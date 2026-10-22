import { motion, useReducedMotion, type Variants } from "motion/react";

type Tag = "h1" | "h2" | "h3" | "p";

interface Props {
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
  /** Seconds between letters. */
  stagger?: number;
  delay?: number;
}

const letter: Variants = {
  hidden: { y: "105%", rotate: 8 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Section heading whose letters rise out of a mask, one after another, when it scrolls into view.
 * The in-view check runs on the heading itself: the letters start clipped inside their masks,
 * so observing them directly would never fire.
 * Screen readers get the plain string; the split letters are hidden from them.
 */
export function SplitHeading({ text, as = "h2", className = "", id, stagger = 0.03, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  const words = text.split(" ");

  return (
    <MotionTag
      id={id}
      className={className}
      aria-label={text}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" variants={letter}>
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
