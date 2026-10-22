import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { HandHeartIcon } from "@phosphor-icons/react";
import { community } from "../../data/content";
import { useIsDesktopPointer } from "../../hooks/useMediaQuery";
import { logoUrl } from "../../lib/logos";
import { ScrambleLabel } from "../ui/ScrambleLabel";
import { SplitHeading } from "../ui/SplitHeading";

type Club = (typeof community.clubs)[number];

function Logo({ logo, name, initials, size = "lg" }: { logo: string; name: string; initials: string; size?: "lg" | "md" }) {
  const url = logoUrl(logo);
  const box = size === "lg" ? "h-20 w-20 rounded-[22px]" : "h-16 w-16 rounded-[18px]";
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden border border-line bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:shadow-[0_0_0_1px_var(--accent),0_12px_36px_-6px_rgb(242_98_46/0.55)] ${box}`}
    >
      {url ? (
        <img src={url} alt={`${name} logo`} width={80} height={80} loading="lazy" className="h-full w-full object-contain p-1.5" />
      ) : (
        <span className="font-display text-[20px] font-bold tracking-tight text-accent-ink" aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  );
}

function ClubCard({ club }: { club: Club }) {
  const ref = useRef<HTMLElement>(null);
  const desktop = useIsDesktopPointer();
  const reduce = useReducedMotion();
  const live = desktop && !reduce;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!live || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  return (
    <motion.article
      ref={ref}
      tabIndex={0}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={live ? { rotateX: srx, rotateY: sry, transformPerspective: 900 } : undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-elev p-7 shadow-soft outline-none transition-[box-shadow,border-color] duration-500 hover:border-line-strong hover:shadow-lift focus-visible:ring-2 focus-visible:ring-accent sm:p-9"
    >
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60" />

      <div className="relative flex items-start justify-between gap-6">
        <Logo logo={club.logo} name={club.name} initials={club.initials} />
        <span className="rounded-full bg-accent-soft px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent-ink">{club.role}</span>
      </div>

      <h3 className="relative mt-8 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-tight text-ink">{club.name}</h3>

      {/* Detail: always visible on touch; slides in on hover or keyboard focus with a pointer */}
      <div className="relative mt-3 overflow-hidden">
        <p className="text-[16px] leading-relaxed text-ink-soft transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100">
          {club.detail}
        </p>
      </div>
    </motion.article>
  );
}

/** Volunteering gets its own quieter, full-width strip: teal instead of orange, dashed edge, no tilt. */
function VolunteerCard() {
  const v = community.volunteering;
  return (
    <article className="group relative flex flex-col gap-5 overflow-hidden rounded-[28px] border border-dashed border-teal/60 bg-teal-soft p-7 sm:flex-row sm:items-center sm:gap-7 sm:p-8">
      <Logo logo={v.logo} name={v.name} initials={v.initials} size="md" />
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-teal-deep">
          <HandHeartIcon size={14} weight="fill" aria-hidden="true" />
          {v.label}
        </p>
        <h3 className="mt-2 font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-tight tracking-tight text-ink">{v.name}</h3>
      </div>
      <div className="flex flex-col items-start gap-1.5 sm:items-end">
        <span className="rounded-full bg-teal-deep px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-bg">{v.role}</span>
        <span className="font-mono text-[12px] text-ink-soft">{v.period}</span>
      </div>
    </article>
  );
}

export function Community() {
  const reduce = useReducedMotion();
  const rise = (i: number, x = 0) => ({
    initial: reduce ? false : { opacity: 0, x, y: x ? 0 : 32 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.1 },
  });

  return (
    <section id="community" aria-labelledby="community-title" className="relative overflow-x-clip px-4 pb-8 pt-24 sm:px-6 lg:px-10 lg:pb-10 lg:pt-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4">
          <ScrambleLabel text={community.index} />
          <SplitHeading id="community-title" text={community.heading} className="font-display text-[clamp(2.4rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-ink" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {community.clubs.map((club, i) => (
            // Slide-in rather than a clip wipe: a clip would cut the corners of the tilting card.
            <motion.div key={club.name} className="h-full" {...rise(i, i ? 48 : -48)}>
              <ClubCard club={club} />
            </motion.div>
          ))}
          <motion.div className="md:col-span-2" {...rise(2)}>
            <VolunteerCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
