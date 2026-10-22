import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { hero, site } from "../../data/content";
import { useIntro } from "../../providers/IntroProvider";
import { useSmoothScroll } from "../../providers/SmoothScroll";
import { useMediaQuery, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { MagneticButton } from "../ui/MagneticButton";
import { NeuralField } from "./NeuralField";
import { AvatarStage } from "./AvatarStage";
import { ScrollCue, StackTicker, StatusWidget, Tagline } from "./HeroBits";

const EASE = [0.16, 1, 0.3, 1] as const;

function MaskWord({ children, delay, start, className = "" }: { children: React.ReactNode; delay: number; start: boolean; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] align-bottom -mb-[0.1em]">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "110%", rotate: 4 }}
        animate={start ? { y: "0%", rotate: 0 } : undefined}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { ready } = useIntro();
  const { scrollTo } = useSmoothScroll();
  const reduce = usePrefersReducedMotion();
  // The scroll-out shrink only makes sense when the whole hero fits in one screen.
  const wide = useMediaQuery("(min-width: 1024px)");
  const start = ready;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: start ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section ref={ref} id="home" aria-labelledby="hero-title" className="relative isolate">
      <motion.div
        className="relative flex min-h-[100dvh] origin-top flex-col overflow-hidden"
        style={reduce || !wide ? undefined : { scale, opacity, y, borderRadius: radius }}
      >
        <NeuralField />

        <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-y-14 px-4 pb-24 pt-[calc(var(--header-h)+28px)] sm:px-6 lg:grid-cols-12 lg:gap-x-10 lg:px-10 lg:pb-20 lg:pt-[calc(var(--header-h)+8px)]">
          {/* Copy */}
          <div className="relative z-10 flex flex-col items-start lg:col-span-7 xl:col-span-6">
            <motion.div {...fade(0.05)}>
              <StatusWidget />
            </motion.div>

            <h1
              id="hero-title"
              className="mt-7 font-display text-[clamp(3.1rem,11.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[clamp(4rem,8vw,5.5rem)] lg:text-[clamp(4.5rem,7.1vw,7.25rem)]"
            >
              <span className="block">
                <MaskWord start={start} delay={0.1}>
                  {hero.greeting[0]}
                </MaskWord>{" "}
                <MaskWord start={start} delay={0.18}>
                  {hero.greeting[1]}
                </MaskWord>
              </span>
              <span className="relative inline-block">
                <MaskWord start={start} delay={0.28}>
                  {hero.name}
                </MaskWord>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 20"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.06em] left-[0.02em] h-[0.16em] w-[92%] overflow-visible"
                >
                  <motion.path
                    d="M3 14 C 70 4, 150 3, 297 9"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={start ? { pathLength: 1 } : undefined}
                    transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.95 }}
                  />
                </svg>
              </span>
            </h1>

            <motion.div className="mt-7 flex flex-col gap-2.5" {...fade(0.55)}>
              <Tagline start={start} />
              <StackTicker start={start} />
            </motion.div>

            <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...fade(0.7)}>
              <MagneticButton href="#work" onClick={go("#work")} arrow>
                {hero.ctas.work}
              </MagneticButton>
              {site.resumeReady && (
                <MagneticButton
                  href={site.resume}
                  download
                  variant="outline"
                  icon={<DownloadSimpleIcon size={17} weight="bold" aria-hidden="true" />}
                >
                  {hero.ctas.resume}
                </MagneticButton>
              )}
              <MagneticButton href="#contact" onClick={go("#contact")} variant="outline">
                {hero.ctas.contact}
              </MagneticButton>
            </motion.div>

            <motion.p
              className="mt-8 origin-left -rotate-3 font-script text-[28px] leading-none text-accent-ink sm:text-[30px]"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={start ? { clipPath: "inset(0 0% 0 0)" } : undefined}
              // Phones reveal it sooner: it is the largest text there, so it decides LCP.
              transition={{ duration: wide ? 1.1 : 0.6, ease: [0.65, 0, 0.35, 1], delay: wide ? 1.25 : 0.35 }}
            >
              {hero.signoff}
            </motion.p>
          </div>

          {/* Avatar */}
          <div className="relative lg:col-span-5 lg:col-start-8 xl:col-span-5 xl:col-start-8">
            <AvatarStage start={start} />
          </div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
          initial={{ opacity: 0 }}
          animate={start ? { opacity: 1 } : undefined}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <ScrollCue onClick={() => scrollTo("#about")} />
        </motion.div>
      </motion.div>
    </section>
  );
}
