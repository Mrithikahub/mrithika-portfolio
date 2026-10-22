import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { featured, projects, work, type Category, type Project } from "../../data/content";

// Featured projects appear here too, so the filters cover everything.
const all: Project[] = [...featured, ...projects];
import { Cover } from "./Cover";
import { ProjectLinks, StackTags, trackSpotlight } from "./ProjectLinks";

type Filter = (typeof work.filters)[number];

/** "All projects": every project (featured included), category filter chips, and a grid that re-flows with layout animation. */
export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: all.length };
    for (const f of work.filters) if (f !== "All") c[f] = all.filter((p) => p.categories.includes(f as Category)).length;
    return c;
  }, []);

  const shown = filter === "All" ? all : all.filter((p) => p.categories.includes(filter as Category));

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-24 sm:px-6 lg:px-10 lg:pt-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h3 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-ink">{work.allHeading}</h3>

        <LayoutGroup id="project-filters">
          <div role="group" aria-label="Filter projects by category" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
            {work.filters.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  data-cursor-snap=""
                  className={`relative shrink-0 rounded-full px-4 py-2 font-mono text-[12px] transition-colors duration-300 ${active ? "text-[#22201d]" : "text-ink-soft hover:text-ink"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {!active && <span className="absolute inset-0 rounded-full border border-line-strong" aria-hidden="true" />}
                  <span className="relative">
                    {f} <span className={active ? "" : "text-ink-faint"}>{counts[f]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <GridCard key={p.slug} project={p} reduce={!!reduce} />
          ))}
        </AnimatePresence>
      </motion.ul>
      {shown.length === 0 && <p className="mt-10 font-mono text-sm text-ink-faint">{work.emptyState}</p>}
    </div>
  );
}

function GridCard({ project, reduce }: { project: Project; reduce: boolean }) {
  const primary = project.live ?? project.github;
  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="h-full"
    >
      <article
        onPointerMove={trackSpotlight}
        data-cursor={primary ? "Open" : undefined}
        className="group/grid relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-elev shadow-soft transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-line-strong hover:shadow-lift"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover/grid:opacity-100"
          style={{ background: "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgb(242 98 46 / 0.12), transparent 45%)" }}
        />
        <div className="relative overflow-hidden border-b border-line">
          <Cover project={project} className="aspect-[16/9] w-full" />
          {project.label && (
            <span className="absolute -right-10 top-4 w-36 rotate-[38deg] bg-accent py-0.5 text-center font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#22201d] shadow-soft">
              {project.label}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.categories.map((c) => (
              <span key={c} className="font-mono text-[11px] text-teal-deep">
                {c}
              </span>
            ))}
          </div>
          <h4 className="font-display text-[21px] font-bold leading-tight tracking-tight text-ink">
            {primary ? (
              <a href={primary} target="_blank" rel="noopener noreferrer" className="outline-none after:absolute after:inset-0 after:z-0 after:rounded-[24px] focus-visible:after:ring-2 focus-visible:after:ring-accent">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h4>
          <p className="text-[14.5px] leading-relaxed text-ink-soft">{project.summary}</p>
          <p className="flex gap-2 font-mono text-[12px] leading-relaxed text-ink">
            <span className="text-accent-ink" aria-hidden="true">
              &gt;
            </span>
            {project.impact}
          </p>
          <div className="mt-auto flex flex-col gap-4 pt-2">
            <StackTags stack={project.stack} limit={4} />
            <ProjectLinks project={project} size="sm" />
          </div>
        </div>
      </article>
    </motion.li>
  );
}
