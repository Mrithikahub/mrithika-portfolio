import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRightIcon, CursorClickIcon, HandTapIcon } from "@phosphor-icons/react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useRef, useState } from "react";
import { about } from "../../data/content";
import { ClipReveal } from "../ui/ClipReveal";
import { ScrambleLabel } from "../ui/ScrambleLabel";
import { SlotCounter } from "../ui/SlotCounter";
import { SplitHeading } from "../ui/SplitHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const reduce = useReducedMotion();
  const imageWrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageWrap, offset: ["start end", "end start"] });
  // Gentle parallax inside the frame: the scene drifts slower than the page.
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  // Real photo: shows on hover with a mouse; a tap (or Enter/Space) toggles it on touch and keyboard.
  const [human, setHuman] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [seen, setSeen] = useState(false); // stops the hint's pulse after the first flip
  const pointer = useRef<string>("mouse");
  const canHover = useMediaQuery("(hover: hover)");
  const showing = human || hovering;

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section id="about" aria-labelledby="about-title" className="relative px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Scene */}
        <div ref={imageWrap} className="lg:col-span-6 lg:pt-10">
          <ClipReveal from="left" radius={28} innerClassName="relative overflow-hidden rounded-[28px] shadow-lift">
            <button
              type="button"
              aria-pressed={human}
              data-human={human}
              data-seen={seen}
              onPointerDown={(e) => (pointer.current = e.pointerType)}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                setHovering(true);
                setSeen(true);
              }}
              onPointerLeave={() => setHovering(false)}
              onClick={(e) => {
                // Mouse users flip by hovering; taps and Enter/Space toggle.
                if (pointer.current !== "mouse" || e.detail === 0) {
                  setHuman((h) => !h);
                  setSeen(true);
                }
              }}
              data-cursor="Hi!"
              className="about-swap group relative block aspect-[1024/632] w-full overflow-hidden bg-teal text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
            >
              <motion.img
                src="/images/avatar-desk-1024.webp"
                srcSet="/images/avatar-desk-640.webp 640w, /images/avatar-desk-1024.webp 1024w"
                sizes="(min-width: 1024px) 46vw, 92vw"
                width={1024}
                height={632}
                alt=""
                loading="lazy"
                decoding="async"
                className="about-swap__avatar absolute inset-x-0 top-[-6%] h-[112%] w-full object-cover"
                style={reduce ? undefined : { y: imgY }}
              />
              <img
                src="/images/me-640.webp"
                srcSet="/images/me-420.webp 420w, /images/me-640.webp 640w"
                sizes="(min-width: 1024px) 46vw, 92vw"
                width={640}
                height={640}
                alt=""
                loading="lazy"
                decoding="async"
                className="about-swap__photo absolute inset-0 h-full w-full object-cover object-[40%_72%]"
              />
              {/* Accessible name: what is shown now, then what pressing does. Images are decorative inside the button. */}
              <span className="sr-only">
                {human ? about.photoAlt : about.imageAlt}. {human ? "Show the avatar again" : "Show a real photo"}.
              </span>
              <span
                aria-hidden="true"
                className="about-swap__hint glass absolute bottom-3 right-3 inline-flex max-w-[calc(100%-24px)] items-center gap-2 overflow-hidden rounded-full px-3 py-1.5 font-mono text-[11px] text-ink sm:bottom-4 sm:right-4"
              >
                {showing ? (
                  about.photoShown
                ) : (
                  <>
                    {canHover ? <CursorClickIcon size={14} weight="bold" className="shrink-0 text-accent-ink" /> : <HandTapIcon size={14} weight="bold" className="shrink-0 text-accent-ink" />}
                    <span className="truncate">{canHover ? about.photoHintHover : about.photoHintTap}</span>
                    <ArrowRightIcon size={12} weight="bold" className="shrink-0" />
                  </>
                )}
              </span>
            </button>
          </ClipReveal>

          <motion.dl className="mt-6 grid grid-cols-1 gap-3 font-mono text-[12px] sm:grid-cols-[auto_1fr] sm:gap-x-6" {...rise(0.2)}>
            <dt className="text-ink-faint">degree /</dt>
            <dd className="text-ink">{about.education.degree}</dd>
            <dt className="text-ink-faint">school /</dt>
            <dd className="text-ink">{about.education.school}</dd>
            <dt className="text-ink-faint">years /</dt>
            <dd className="text-ink">{about.education.years}</dd>
          </motion.dl>
        </div>

        {/* Story */}
        <div className="flex flex-col lg:col-span-6">
          <ScrambleLabel text={about.index} />
          <SplitHeading
            id="about-title"
            text={about.heading}
            stagger={0.018}
            className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.03em] text-ink"
          />

          <div className="mt-8 flex max-w-[60ch] flex-col gap-5 text-[17px] leading-relaxed text-ink-soft">
            {about.paragraphs.map((p, i) => (
              <motion.p key={i} {...rise(0.05 * i)}>
                {p}
              </motion.p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {about.stats.map((s, i) => (
              <motion.div key={s.label} className="flex flex-col-reverse gap-2" {...rise(0.1 + i * 0.08)}>
                <dt className="font-mono text-[12px] text-ink-faint">{s.label}</dt>
                <dd className="font-display text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-none tracking-tight text-ink">
                  <SlotCounter value={s.value} suffix={s.suffix} />
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
