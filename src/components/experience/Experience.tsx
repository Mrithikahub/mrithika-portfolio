import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "../../data/content";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { ScrambleLabel } from "../ui/ScrambleLabel";
import { SplitHeading } from "../ui/SplitHeading";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vertical timeline. The orange line draws itself as you scroll (GSAP scrub),
 * each entry slides in when reached, and its node pops with a ring pulse.
 * Desktop: entries alternate around a centered line. Mobile: line on the left.
 * Node styles live under "Timeline" in index.css.
 */
export function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".tl-item"));

    if (reduce) {
      items.forEach((it) => it.classList.add("is-reached"));
      if (progress.current) progress.current.style.transform = "scaleY(1)";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progress.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 65%", end: "bottom 65%", scrub: 0.6 } },
      );

      items.forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.classList.add("is-reached"),
          onLeaveBack: () => item.classList.remove("is-reached"),
        });
        gsap.from(item.querySelector(".tl-card"), {
          x: () => (window.innerWidth >= 1024 ? (fromLeft ? -60 : 60) : 30),
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 75%", once: true },
        });
        gsap.from(item.querySelector(".tl-when"), {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: { trigger: item, start: "top 75%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative overflow-x-clip px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center">
          <ScrambleLabel text={experience.index} />
          <SplitHeading
            id="experience-title"
            text={experience.heading}
            className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink"
          />
        </div>

        <div className="relative mx-auto mt-16 max-w-[1100px] lg:mt-24">
          {/* Track and the scroll-drawn progress line */}
          <div aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-px bg-line-strong lg:left-1/2" />
          <div ref={progress} aria-hidden="true" className="absolute bottom-0 left-[19px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-accent lg:left-1/2" style={{ transform: "scaleY(0)" }} />

          <ol ref={list} className="relative flex flex-col gap-14 lg:gap-24">

          {experience.items.map((job, i) => {
            const left = i % 2 === 0;
            return (
              <li key={job.org} className="tl-item relative grid grid-cols-1 pl-14 lg:grid-cols-2 lg:gap-24 lg:pl-0">
                <span aria-hidden="true" className="tl-node absolute left-[12px] top-7 grid h-4 w-4 place-items-center lg:left-1/2 lg:-ml-2">
                  <span className="tl-ring" />
                  <span className="tl-dot" />
                </span>

                {/* Date block on the opposite side (desktop), above the card (mobile) */}
                <div className={`tl-when flex flex-col justify-start pt-5 ${left ? "lg:order-2" : "lg:order-1 lg:items-end lg:text-right"}`}>
                  <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-bold leading-none tracking-tight text-ink/25">{job.period}</p>
                </div>

                <article
                  className={`tl-card mt-3 rounded-[24px] border border-line bg-elev p-6 shadow-soft transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:border-line-strong hover:shadow-lift sm:p-7 lg:mt-0 ${left ? "lg:order-1" : "lg:order-2"}`}
                >
                  <p className="font-mono text-[12px] text-accent-ink">{job.period}</p>
                  <h3 className="mt-3 font-display text-[22px] font-bold leading-tight tracking-tight text-ink">{job.role}</h3>
                  <p className="mt-1 text-[15px] text-ink-soft">{job.org}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {job.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                        <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools used">
                    {job.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
