import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import type { Project } from "../../data/content";

/** GitHub / Live links for a project. Renders nothing when a project has neither. */
export function ProjectLinks({ project, size = "md" }: { project: Project; size?: "sm" | "md" }) {
  if (!project.github && !project.live) return null;
  const pad = size === "sm" ? "h-9 px-3.5 text-[12px]" : "h-10 px-4 text-[13px]";
  return (
    <div className="relative z-10 flex flex-wrap gap-2">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-snap=""
          aria-label={`${project.title} on GitHub (opens in a new tab)`}
          className={`inline-flex items-center gap-2 rounded-full border border-line-strong font-mono text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg ${pad}`}
        >
          <GithubLogoIcon size={15} weight="bold" aria-hidden="true" />
          GitHub
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-snap=""
          aria-label={`${project.title} live demo (opens in a new tab)`}
          className={`group/live inline-flex items-center gap-2 rounded-full bg-accent font-mono text-[#22201d] transition-shadow duration-300 hover:shadow-[0_10px_24px_-10px_rgb(242_98_46/0.8)] ${pad}`}
        >
          Live
          <ArrowUpRightIcon size={14} weight="bold" aria-hidden="true" className="transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
        </a>
      )}
    </div>
  );
}

export function StackTags({ stack, limit }: { stack: string[]; limit?: number }) {
  const shown = limit ? stack.slice(0, limit) : stack;
  const rest = limit ? stack.length - shown.length : 0;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
      {shown.map((s) => (
        <li key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-soft">
          {s}
        </li>
      ))}
      {rest > 0 && <li className="rounded-full px-1.5 py-1 font-mono text-[11px] text-ink-faint">+{rest}</li>}
    </ul>
  );
}

/** Updates --mx/--my on the element for the cursor-follow spotlight. No React state involved. */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
