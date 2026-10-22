import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "motion/react";
import { useMediaQuery, usePrefersReducedMotion } from "../../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  title: string;
  phrase: string;
  note: string;
}

const HEAD = {
  src: "/images/avatar-head-560.webp",
  srcSet: "/images/avatar-head-360.webp 360w, /images/avatar-head-560.webp 560w",
  width: 560,
  height: 429,
};

/**
 * The signature moment before each major section: a small centered title,
 * a giant orange phrase sliding across the full width, Mrithika's head-and-shoulders
 * cutout in front with a little parallax, and a mono note underneath.
 * Desktop: pinned and scrubbed with GSAP ScrollTrigger.
 * Mobile: no pin, the phrase just drifts with scroll (Motion).
 * Reduced motion: static, phrase wraps.
 */
export function SectionTransition(props: Props) {
  const reduce = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  if (reduce) return <StaticTransition {...props} />;
  return wide ? <PinnedTransition {...props} /> : <FlowTransition {...props} />;
}

function Title({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="h-px w-10 bg-accent" aria-hidden="true" />
      <p className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</p>
    </div>
  );
}

function Note({ note }: { note: string }) {
  return <p className="glass rounded-full px-4 py-2 font-mono text-[12px] text-ink">{note}</p>;
}

function Head({ className = "" }: { className?: string }) {
  return (
    <img
      src={HEAD.src}
      srcSet={HEAD.srcSet}
      sizes="(min-width: 1024px) 560px, 360px"
      width={HEAD.width}
      height={HEAD.height}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`select-none ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 72%, transparent 100%)",
      }}
    />
  );
}

const phraseClass =
  "inline-block whitespace-nowrap font-display font-bold leading-[0.9] tracking-[-0.045em] text-[var(--accent-display)] pb-[0.06em]";

function PinnedTransition({ title, phrase, note }: Props) {
  const section = useRef<HTMLElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Layout effect: GSAP must unwrap its pin-spacer before React removes these nodes.
  useLayoutEffect(() => {
    const el = section.current;
    const text = phraseRef.current;
    if (!el || !text) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        text,
        { x: () => window.innerWidth * 0.55 },
        { x: () => -(text.scrollWidth - window.innerWidth * 0.45), ease: "none" },
        0,
      )
        .fromTo(head.current, { yPercent: 16, scale: 0.92 }, { yPercent: -2, scale: 1.04, ease: "none" }, 0)
        .fromTo(titleRef.current, { y: 30, opacity: 0.2 }, { y: 0, opacity: 1, ease: "power2.out", duration: 0.25 }, 0);
    }, el);
    return () => ctx.revert();
  }, []);

  // Stable React-owned wrapper: GSAP's pin-spacer only ever wraps the inner section.
  return (
    <div>
      <section ref={section} aria-label={`${title}: ${phrase}`} className="relative h-[100dvh] overflow-hidden">
        <div
          className="dot-grid pointer-events-none absolute inset-0 opacity-50"
          style={{ maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)" }}
          aria-hidden="true"
        />
        <div ref={titleRef} className="absolute inset-x-0 top-[17%] flex justify-center">
          <Title title={title} />
        </div>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <p ref={phraseRef} className={`${phraseClass} text-[clamp(7rem,15vw,15rem)] will-change-transform`}>
            {phrase}
          </p>
        </div>
        <div ref={head} className="absolute bottom-0 left-1/2 w-[min(46vw,560px)] -translate-x-1/2 will-change-transform">
          <Head className="w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-[6%] flex justify-center">
          <Note note={note} />
        </div>
      </section>
    </div>
  );
}

function FlowTransition({ title, phrase, note }: Props) {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-72%"]);
  const headY = useTransform(scrollYProgress, [0, 1], ["14%", "-6%"]);

  return (
    <section ref={section} aria-label={`${title}: ${phrase}`} className="relative flex flex-col items-center overflow-hidden pb-6 pt-16">
      <Title title={title} />
      <div className="relative mt-8 w-full">
        <motion.p className={`${phraseClass} pl-4 text-[clamp(4.5rem,24vw,9rem)]`} style={{ x }}>
          {phrase}
        </motion.p>
      </div>
      <motion.div className="relative -mt-10 w-[78vw] max-w-[360px]" style={{ y: headY }}>
        <Head className="w-full" />
      </motion.div>
      <div className="relative -mt-8 flex justify-center px-4">
        <Note note={note} />
      </div>
    </section>
  );
}

function StaticTransition({ title, phrase, note }: Props) {
  return (
    <section aria-label={`${title}: ${phrase}`} className="relative flex flex-col items-center px-4 pt-20 text-center">
      <Title title={title} />
      <p className="mt-6 max-w-[14ch] text-balance font-display text-[clamp(3.5rem,11vw,9rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[var(--accent-display)]">
        {phrase}
      </p>
      <div className="relative mt-4 w-[min(70vw,420px)]">
        <Head className="w-full" />
      </div>
      <div className="-mt-6 mb-4">
        <Note note={note} />
      </div>
    </section>
  );
}
