import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "../../data/content";
import { work } from "../../data/content";
import { Cover } from "./Cover";
import { ProjectLinks, StackTags, trackSpotlight } from "./ProjectLinks";

interface Props {
  project: Project;
  /** Resting "fanned" pose. Hover straightens it. */
  fan?: { rotate: number; skewY: number; y: number };
  interactive: boolean;
  headingLevel?: "h3" | "h4";
  /** Cover sized by viewport height (pinned gallery) instead of a fixed aspect ratio. */
  fitHeight?: boolean;
}

/**
 * Large featured project card: 3D tilt toward the cursor, spotlight glow under the pointer,
 * straightens and lifts on hover, angled category tag on its corner.
 */
export function FeaturedCard({ project, fan = { rotate: 0, skewY: 0, y: 0 }, interactive, headingLevel: H = "h3", fitHeight = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const primary = project.live ?? project.github;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    trackSpotlight(e);
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    setHover(false);
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor={primary ? work.cursorLabel : undefined}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-elev shadow-soft [transform-style:preserve-3d]"
      style={{ rotateX: interactive ? srx : 0, rotateY: interactive ? sry : 0, transformPerspective: 1100 }}
      animate={
        interactive
          ? hover
            ? { rotate: 0, skewY: 0, y: -18, scale: 1.035 }
            : { rotate: fan.rotate, skewY: fan.skewY, y: fan.y, scale: 1 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 170, damping: 20 }}
    >
      {/* Spotlight that follows the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(242 98 46 / 0.14), transparent 45%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[24px] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          padding: 1,
          background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), var(--accent), transparent 60%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative">
        <Cover project={project} className={fitHeight ? "h-[clamp(120px,19dvh,200px)] w-full" : "aspect-[16/9] w-full"} />
        {project.label && (
          <span className="absolute -right-9 top-5 w-36 rotate-[38deg] bg-accent py-1 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#22201d] shadow-soft">
            {project.label}
          </span>
        )}
      </div>

      <div className={`flex min-h-0 flex-1 flex-col ${fitHeight ? "gap-2.5 p-5" : "gap-3 p-6"}`}>
        <H className={`font-display font-bold leading-[1.1] tracking-tight text-ink ${fitHeight ? "text-[23px]" : "text-[26px]"}`}>
          {primary ? (
            // Stretched link: the whole card opens the primary link, while inner links stay clickable.
            <a href={primary} target="_blank" rel="noopener noreferrer" className="outline-none after:absolute after:inset-0 after:z-0 after:rounded-[24px] focus-visible:after:ring-2 focus-visible:after:ring-accent">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </H>
        <p className={`text-[15px] leading-relaxed text-ink-soft ${fitHeight ? "line-clamp-2" : "line-clamp-3"}`}>{project.summary}</p>
        <p className={`font-mono text-[12px] leading-relaxed text-ink ${fitHeight ? "line-clamp-2" : "line-clamp-3"}`}>
          <span className="mr-2 text-accent-ink" aria-hidden="true">
            &gt;
          </span>
          {project.impact}
        </p>
        <div className="mt-auto flex flex-col gap-3 pt-1">
          <StackTags stack={project.stack} limit={fitHeight ? 3 : 4} />
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.article>
  );
}
