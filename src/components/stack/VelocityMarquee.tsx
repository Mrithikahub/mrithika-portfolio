import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { TechMark } from "./TechMark";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface RowProps {
  items: string[];
  /** Percent of the strip per second; negative moves right. */
  speed: number;
}

/**
 * One marquee row. Base drift is constant; scrolling adds speed and a skew proportional
 * to scroll velocity, and hovering eases it down to a crawl. Driven by motion values in
 * useAnimationFrame, so React never re-renders per frame. Idle while off screen.
 */
function Row({ items, speed }: RowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-3000, 0, 3000], [4, 0, 4]);
  const skewX = useTransform(smooth, [-3000, 3000], [9, -9], { clamp: true });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const hoverMul = useRef(1);
  const hoverTarget = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    hoverMul.current += (hoverTarget.current - hoverMul.current) * 0.08;
    const dt = Math.min(delta, 64) / 1000;
    base.set(base.get() + speed * dt * (1 + boost.get()) * hoverMul.current);
  });

  const strip = items.map((name, i) => (
    <span key={i} className="mx-3 inline-flex items-center gap-3 rounded-full border border-line bg-elev px-5 py-3 text-ink shadow-soft">
      <TechMark name={name} size={22} />
      <span className="font-mono text-[14px]">{name}</span>
    </span>
  ));

  return (
    <div
      ref={ref}
      className="overflow-hidden py-2"
      onPointerEnter={() => (hoverTarget.current = 0.18)}
      onPointerLeave={() => (hoverTarget.current = 1)}
    >
      <motion.div className="flex w-max whitespace-nowrap" style={reduce ? undefined : { x, skewX }}>
        <div className="flex">{strip}</div>
        <div className="flex" aria-hidden="true">
          {strip}
        </div>
      </motion.div>
    </div>
  );
}

/** Two rows moving in opposite directions. The only marquee on the page. */
export function VelocityMarquee({ items }: { items: string[] }) {
  const half = Math.ceil(items.length / 2);
  return (
    <div
      className="relative -mx-4 sm:-mx-6 lg:-mx-10"
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <p className="sr-only">Technologies: {items.join(", ")}</p>
      <div aria-hidden="true" className="flex flex-col gap-3">
        <Row items={items.slice(0, half)} speed={-2.2} />
        <Row items={items.slice(half)} speed={2.2} />
      </div>
    </div>
  );
}
