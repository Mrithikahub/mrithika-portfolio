import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featured, work } from "../../data/content";
import { useMediaQuery, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { ClipReveal } from "../ui/ClipReveal";
import { ScrambleLabel } from "../ui/ScrambleLabel";
import { SplitHeading } from "../ui/SplitHeading";
import { FeaturedCard } from "./FeaturedCard";

gsap.registerPlugin(ScrollTrigger);

// Resting poses: a light fan (max 2 degrees) so every card stays fully readable. Hover straightens.
const FAN = [
  { rotate: -1.5, skewY: 0, y: 6 },
  { rotate: 1.2, skewY: 0, y: -6 },
  { rotate: -1, skewY: 0, y: 8 },
  { rotate: 1.8, skewY: 0, y: -4 },
];

// Equal start and end padding: the first card starts fully in view and the last one ends fully in view.
const EDGE = "max(56px, calc((100vw - 1400px) / 2 + 56px))";

function Header({ id, compact = false }: { id: string; compact?: boolean }) {
  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-4"}`}>
      <ScrambleLabel text={work.index} />
      <SplitHeading
        id={id}
        text={work.heading}
        className={`font-display font-bold leading-[1.02] tracking-[-0.03em] text-ink ${compact ? "text-[clamp(2.2rem,3.6vw,3.5rem)]" : "text-[clamp(2.6rem,5vw,4.5rem)]"}`}
      />
    </div>
  );
}

/**
 * Desktop: the section pins and the fanned stack of cards pans horizontally as you scroll
 * (canonical horizontal-pan pattern: start "top top", pin, scrub, distance = track overflow).
 * Cards fly in with rotation and settle into the fan as the section arrives.
 * Mobile and reduced motion: a simple vertical list with clip reveals.
 */
export function FeaturedGallery() {
  const reduce = usePrefersReducedMotion();
  // The pinned pan needs room for a full card; short or narrow screens get the stacked list.
  const roomy = useMediaQuery("(min-width: 1024px) and (min-height: 680px)");
  return roomy && !reduce ? <PinnedGallery /> : <StackedGallery />;
}

function PinnedGallery() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // Layout effect: GSAP must unwrap its pin-spacer before React removes these nodes.
  useLayoutEffect(() => {
    const el = wrap.current;
    const tr = track.current;
    if (!el || !tr) return;
    const ctx = gsap.context(() => {
      // Use layout width, not scrollWidth: the cards' fly-in transforms would inflate scrollWidth
      // and make the pan overshoot. offsetWidth includes the equal start/end padding.
      const distance = () => Math.max(0, tr.offsetWidth - document.documentElement.clientWidth);

      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Fly-in: cards arrive from the right, spinning, and settle into the fan.
      gsap.from(".fly-card", {
        x: () => window.innerWidth * 0.5,
        y: 120,
        rotate: 24,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // The outer div is React-owned and never moves; GSAP wraps only the inner pinned element
  // in its pin-spacer, so React can still insert siblings safely.
  return (
    <div>
      <div ref={wrap} className="relative flex h-[100dvh] flex-col overflow-hidden pt-[calc(var(--header-h)+16px)]">
        <div className="w-full" style={{ paddingLeft: EDGE }}>
          <Header id="work-title" compact />
        </div>
        <div className="flex min-h-0 flex-1 items-center py-6">
          <div
            ref={track}
            className="flex w-max shrink-0 items-stretch gap-7 [perspective:1400px]"
            style={{ paddingLeft: EDGE, paddingRight: EDGE }}
          >
            {featured.map((p, i) => (
              <div key={p.slug} className="fly-card relative w-[clamp(300px,28vw,400px)] shrink-0 hover:z-20!" style={{ zIndex: featured.length - i }}>
                <FeaturedCard project={p} fan={FAN[i % FAN.length]} interactive fitHeight />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedGallery() {
  return (
    <div className="px-4 pt-24 sm:px-6">
      <Header id="work-title" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {featured.map((p, i) => (
          <ClipReveal key={p.slug} from="bottom" radius={24} delay={(i % 2) * 0.08}>
            <FeaturedCard project={p} interactive={false} />
          </ClipReveal>
        ))}
      </div>
    </div>
  );
}
