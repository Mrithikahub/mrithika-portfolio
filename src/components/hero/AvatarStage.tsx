import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { hero } from "../../data/content";
import { useIsDesktopPointer, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { CodeStreams } from "./CodeStreams";
import { WhoamiPanel } from "./WhoamiPanel";

const EASE = [0.16, 1, 0.3, 1] as const;

const chipLayout = [
  { className: "left-[-2%] top-[7%] sm:left-[-6%] sm:top-[9%]", depth: 34, dur: "6.5s", delay: "0s" },
  { className: "right-[-2%] top-[30%] sm:right-[-7%]", depth: 46, dur: "7.5s", delay: "-2s" },
  { className: "right-[4%] bottom-[-4%]", depth: 28, dur: "6s", delay: "-4s" },
  { className: "left-[-9%] top-[52%]", depth: 40, dur: "8s", delay: "-1s" },
];

/**
 * The hero avatar, built as layered depth:
 *   glow (back) < card + image < glass whoami panel < floating chips (front)
 * On desktop each layer follows the pointer at its own depth, and the card tilts in 3D.
 */
export function AvatarStage({ start }: { start: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktopPointer();
  const reduce = usePrefersReducedMotion();
  const live = desktop && !reduce;

  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(ny, { stiffness: 120, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [-1, 1], [-9, 9]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);
  const cardX = useTransform(sx, [-1, 1], [-10, 10]);
  const cardY = useTransform(sy, [-1, 1], [-8, 8]);
  const imgX = useTransform(sx, [-1, 1], [14, -14]);
  const imgY = useTransform(sy, [-1, 1], [10, -10]);
  const panelX = useTransform(sx, [-1, 1], [-26, 26]);
  const panelY = useTransform(sy, [-1, 1], [-18, 18]);
  const glowX = useTransform(sx, [-1, 1], [18, -18]);
  const glowY = useTransform(sy, [-1, 1], [14, -14]);
  const shineX = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const shineY = useTransform(sy, [-1, 1], ["10%", "70%"]);
  const shine = useTransform(
    [shineX, shineY] as MotionValue<string>[],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgb(255 255 255 / 0.45), transparent 55%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (!live || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    nx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    ny.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    nx.set(0);
    ny.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto w-full max-w-[540px] [perspective:1200px]"
    >
      {/* Code streams: tilted lanes of project code drifting behind everything */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
      >
        <CodeStreams sx={sx} sy={sy} live={live} />
      </motion.div>

      {/* Soft animated glow behind the card */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[6%] -z-0"
        style={{ x: live ? glowX : 0, y: live ? glowY : 0 }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={start ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      >
        <div
          className="glow-spin h-full w-full rounded-full opacity-55 blur-3xl will-change-transform dark:opacity-40"
          style={{ background: "conic-gradient(from 90deg, var(--accent), var(--teal), #f7b267, var(--accent))" }}
        />
      </motion.div>

      <div className={reduce ? "" : "drift"} style={{ ["--drift-dur" as string]: "9s" }}>
        {/* Card */}
        <motion.div
          className="relative [transform-style:preserve-3d]"
          style={live ? { rotateX, rotateY, x: cardX, y: cardY } : undefined}
        >
          <motion.div
            className="relative aspect-[1/1.05] overflow-hidden rounded-[32px] bg-teal shadow-lift ring-1 ring-black/5"
            initial={{ clipPath: "inset(100% 0% 0% 0% round 32px)" }}
            animate={start ? { clipPath: "inset(0% 0% 0% 0% round 32px)" } : undefined}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          >
            <motion.img
              src="/images/avatar-hero-1024.webp"
              srcSet="/images/avatar-hero-640.webp 640w, /images/avatar-hero-1024.webp 1024w"
              sizes="(min-width: 1024px) 44vw, 92vw"
              width={1024}
              height={868}
              alt={hero.avatarAlt}
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="absolute inset-0 h-full w-full scale-[1.1] object-cover object-[46%_50%]"
              style={live ? { x: imgX, y: imgY } : undefined}
              initial={{ scale: 1.3 }}
              animate={start ? { scale: 1.1 } : undefined}
              transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
            />
            {/* Light sheen that tracks the tilt */}
            {live && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: shine }}
              />
            )}
            <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/20" aria-hidden="true" />
          </motion.div>
        </motion.div>

        {/* Glass "whoami" panel */}
        <motion.div
          className="glass absolute -bottom-[9%] left-[2%] w-[60%] min-w-[244px] max-w-[310px] rounded-2xl p-3.5 sm:-left-[10%] sm:p-4"
          style={live ? { x: panelX, y: panelY } : undefined}
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={start ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
        >
          <WhoamiPanel start={start} />
        </motion.div>

        {/* Floating chips */}
        {hero.chips.map((chip, i) => (
          <Chip key={chip} label={chip} index={i} start={start} live={live} sx={sx} sy={sy} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  index,
  start,
  live,
  sx,
  sy,
}: {
  label: string;
  index: number;
  start: boolean;
  live: boolean;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const layout = chipLayout[index % chipLayout.length];
  const x = useTransform(sx, [-1, 1], [-layout.depth, layout.depth]);
  const y = useTransform(sy, [-1, 1], [-layout.depth * 0.7, layout.depth * 0.7]);
  return (
    <motion.div
      className={`absolute ${layout.className} ${index > 1 ? "hidden sm:block" : ""}`}
      style={live ? { x, y } : undefined}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={start ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.9 + index * 0.12 }}
    >
      <div
        className="drift glass rounded-full px-3.5 py-1.5 font-mono text-[11px] text-ink transition-transform duration-300 hover:scale-110 sm:text-[12px]"
        style={{ ["--drift-dur" as string]: layout.dur, ["--drift-delay" as string]: layout.delay }}
      >
        <span className="mr-1.5 text-accent-ink" aria-hidden="true">
          #
        </span>
        {label}
      </div>
    </motion.div>
  );
}
