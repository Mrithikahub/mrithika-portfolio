import { motion, useReducedMotion } from "motion/react";
import { skills } from "../../data/content";
import { techIcons } from "../../lib/techIcons";
import { ScrambleLabel } from "../ui/ScrambleLabel";
import { SplitHeading } from "../ui/SplitHeading";
import { TechMark } from "./TechMark";
import { VelocityMarquee } from "./VelocityMarquee";

// Bento layout per group (desktop 6-column grid) with varied surfaces so the grid has rhythm.
const layout: Record<string, { span: string; surface: string }> = {
  "AI/ML": { span: "lg:col-span-4", surface: "bg-teal-soft dot-grid" },
  Languages: { span: "lg:col-span-2", surface: "bg-ink text-bg" },
  Backend: { span: "lg:col-span-2", surface: "bg-elev" },
  Frontend: { span: "lg:col-span-2", surface: "bg-elev" },
  Databases: { span: "lg:col-span-2", surface: "bg-elev" },
  "Cloud/Tools": { span: "lg:col-span-6", surface: "bg-accent-soft" },
};

export function Stack() {
  const reduce = useReducedMotion();
  // Marquee shows every skill that has a real logo.
  const logos = skills.groups.flatMap((g) => g.items).filter((n, i, a) => techIcons[n] && a.indexOf(n) === i && n !== "React Native");

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4">
          <ScrambleLabel text={skills.index} />
          <SplitHeading id="stack-title" text={skills.heading} className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink" />
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {skills.groups.map((g, i) => {
            const l = layout[g.name] ?? { span: "lg:col-span-2", surface: "bg-elev" };
            const inverted = l.surface.includes("bg-ink");
            return (
              <motion.li
                key={g.name}
                className={`group relative overflow-hidden rounded-[24px] border border-line p-6 shadow-soft sm:p-7 ${l.span} ${l.surface} ${g.name === "Cloud/Tools" || g.name === "AI/ML" ? "sm:col-span-2" : ""}`}
                initial={reduce ? false : { opacity: 0, y: 28, clipPath: "inset(12% 0% 0% 0% round 24px)" }}
                whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={`font-display text-[22px] font-bold tracking-tight ${inverted ? "text-bg" : "text-ink"}`}>{g.name}</h3>
                  <span className={`font-mono text-[12px] ${inverted ? "text-bg/60" : "text-ink-faint"}`}>{String(g.items.length).padStart(2, "0")}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[12.5px] transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 ${
                        inverted
                          ? "border-bg/20 text-bg hover:border-accent hover:text-accent"
                          : "border-line-strong bg-bg/60 text-ink hover:border-accent hover:text-accent-ink"
                      }`}
                    >
                      <TechMark name={item} size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-16">
          <VelocityMarquee items={logos} />
        </div>
      </div>
    </section>
  );
}
