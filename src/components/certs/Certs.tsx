import { useCallback, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CircleDashedIcon, SealCheckIcon } from "@phosphor-icons/react";
import { certifications, type Cert } from "../../data/content";
import { logoUrl } from "../../lib/logos";
import { techIcons } from "../../lib/techIcons";
import { BrandIcon } from "../ui/BrandIcon";
import { ScrambleLabel } from "../ui/ScrambleLabel";
import { SplitHeading } from "../ui/SplitHeading";
import { CertViewer } from "./CertViewer";

/** Issuer logo from src/assets/logos, then a Simple Icons mark for the issuer, then an initials badge. */
function IssuerMark({ cert, done }: { cert: Cert; done: boolean }) {
  const logo = logoUrl(cert.logo);
  const icon = techIcons[cert.issuer];
  const base = "grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105";
  if (logo) {
    return (
      <span className={`${base} border border-line bg-white p-1.5`}>
        <img src={logo} alt="" width={56} height={56} loading="lazy" className="h-full w-full object-contain" />
      </span>
    );
  }
  if (icon) {
    return (
      <span className={`${base} border border-line bg-white`}>
        <BrandIcon icon={icon} size={28} brand />
      </span>
    );
  }
  return (
    <span className={`${base} font-mono text-[11px] font-bold tracking-wider ${done ? "bg-teal-soft text-teal-deep" : "bg-accent-soft text-accent-ink"}`}>
      {cert.mark}
    </span>
  );
}

/** Certifications in two columns. Verified certs with a file open the lightbox viewer; in-progress ones are static. */
export function Certs() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Cert | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="certifications" aria-labelledby="certs-title" className="relative overflow-x-clip px-4 py-24 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4">
          <ScrambleLabel text={certifications.index} />
          <SplitHeading id="certs-title" text={certifications.heading} className="font-display text-[clamp(2.4rem,4.6vw,4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-ink" />
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {certifications.items.map((c, i) => {
            const done = c.status === "verified";
            const viewable = done && !!c.file;
            const body: ReactNode = (
              <>
                <IssuerMark cert={c} done={done} />
                <div className="min-w-0">
                  <h3 className="font-display text-[18px] font-bold leading-snug tracking-tight text-ink">{c.name}</h3>
                  <p className="mt-1 font-mono text-[12px] text-ink-faint">
                    {c.issuer} · {c.date}
                  </p>
                  {viewable && (
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-accent-ink transition-[opacity,translate] duration-300 [@media(hover:hover)]:-translate-x-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-x-0 [@media(hover:hover)]:group-focus-within:opacity-100"
                    >
                      {certifications.viewHint} <ArrowRightIcon size={11} weight="bold" />
                    </span>
                  )}
                </div>
                <span
                  className={`col-start-2 inline-flex items-center gap-1.5 justify-self-start rounded-full px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] sm:col-start-3 sm:justify-self-end ${
                    done ? "bg-teal-soft text-teal-deep" : "bg-accent-soft text-accent-ink"
                  }`}
                >
                  {done ? (
                    <SealCheckIcon size={14} weight="fill" aria-hidden="true" />
                  ) : (
                    <CircleDashedIcon size={14} weight="bold" aria-hidden="true" className="animate-[spin_6s_linear_infinite]" />
                  )}
                  {done ? certifications.verified : certifications.inProgress}
                </span>
              </>
            );
            const cardClass = `group grid h-full w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-3 rounded-[24px] border bg-elev p-5 shadow-soft transition-[translate,border-color,box-shadow] duration-500 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-6 ${
              done ? "border-line" : "border-dashed border-accent/60"
            }`;
            return (
              <motion.li
                key={c.name}
                className="min-w-0"
                initial={reduce ? false : { opacity: 0, x: i % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: Math.floor(i / 2) * 0.08 }}
              >
                <article
                  className={`${cardClass} relative ${viewable ? "hover:-translate-y-1 hover:border-line-strong hover:shadow-lift has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent" : ""}`}
                  data-cursor={viewable ? "View" : undefined}
                >
                  {viewable && (
                    // Stretched button: the whole card opens the viewer, the heading stays a real heading.
                    <button
                      type="button"
                      onClick={() => setOpen(c)}
                      aria-haspopup="dialog"
                      aria-label={`View certificate: ${c.name}`}
                      className="absolute inset-0 z-10 cursor-pointer rounded-[24px] outline-none"
                    />
                  )}
                  {body}
                </article>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <CertViewer cert={open} onClose={close} />
    </section>
  );
}
