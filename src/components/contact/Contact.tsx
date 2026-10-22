import { motion, useReducedMotion } from "motion/react";
import { CopyIcon } from "@phosphor-icons/react";
import { contact, site } from "../../data/content";
import { copyText } from "../../lib/clipboard";
import { useToast } from "../../providers/ToastProvider";
import { SplitHeading } from "../ui/SplitHeading";
import { SocialCard } from "./SocialCard";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact() {
  const reduce = useReducedMotion();
  const { show } = useToast();

  const copyEmail = async () => {
    const ok = await copyText(site.email);
    show(ok ? contact.copied : contact.copyFailed, ok ? "success" : "error");
  };

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-10 lg:pb-28 lg:pt-12">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center">
        <p className="mono-label self-start text-ink-faint">{contact.index}</p>

        {/* Avatar in an arch, gently bobbing */}
        {/* The in-view check sits on this unclipped wrapper: a clipped element reads as zero-size to the observer. */}
        <motion.div
          className="mt-4"
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            className="relative h-[300px] w-[260px] sm:h-[360px] sm:w-[310px]"
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0%)" },
              show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } },
            }}
          >
            <div className="absolute inset-x-0 bottom-0 top-[22%] overflow-hidden rounded-t-full bg-teal" aria-hidden="true">
              <div className="dot-grid absolute inset-0 opacity-30 mix-blend-soft-light" />
              <div className="absolute inset-x-[12%] bottom-[-30%] h-[60%] rounded-full bg-accent/30 blur-2xl" />
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
              }}
            >
              <div className="drift absolute inset-x-0 top-0 flex justify-center" style={{ ["--drift-dur" as string]: "5.5s" }}>
                <img
                  src="/images/avatar-standing-640.webp"
                  srcSet="/images/avatar-standing-420.webp 420w, /images/avatar-standing-640.webp 640w"
                  sizes="(min-width: 640px) 310px, 260px"
                  width={640}
                  height={1089}
                  alt={contact.avatarAlt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-[86%] select-none"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <SplitHeading
          id="contact-title"
          text={contact.heading}
          className="relative -mt-6 text-center font-display text-[clamp(3.75rem,13vw,9rem)] font-bold leading-[1] tracking-[-0.04em] text-ink sm:-mt-10"
        />

        <motion.p className="mt-5 max-w-[46ch] text-balance text-center text-base leading-relaxed text-ink-soft sm:text-lg" {...rise(0.15)}>
          {contact.body}
        </motion.p>

        <motion.div className="mt-12" {...rise(0.3)}>
          <SocialCard />
        </motion.div>

        <motion.div className="mt-8 flex flex-col items-center gap-2" {...rise(0.4)}>
          <span className="mono-label text-ink-faint">or copy my email</span>
          <button
            type="button"
            onClick={copyEmail}
            data-cursor-snap=""
            aria-label={`${contact.copyLabel}: ${site.email}`}
            className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-line-strong px-4 py-2.5 font-mono text-[13px] text-ink transition-colors duration-300 hover:border-ink hover:bg-accent-soft sm:text-[15px]"
          >
            <span className="truncate">{site.email}</span>
            <CopyIcon size={16} weight="bold" className="shrink-0 text-accent-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
