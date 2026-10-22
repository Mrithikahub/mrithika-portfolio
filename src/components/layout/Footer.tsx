import { ArrowUpIcon } from "@phosphor-icons/react";
import { codingProfiles, contact } from "../../data/content";
import { useSmoothScroll } from "../../providers/SmoothScroll";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  return (
    <footer className="relative border-t border-line px-4 pb-28 pt-8 sm:px-6 md:pb-8 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-5 md:grid-cols-3">
        <p className="mono-label text-ink-soft">{contact.footer.copyright}</p>

        <ul className="flex items-center gap-5 md:justify-center" aria-label="Coding profiles">
          {codingProfiles.map((p) => (
            <li key={p.label}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-label text-ink-soft underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 md:justify-end">
          <p className="mono-label text-ink-faint">
            {contact.footer.built}
          </p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            aria-label={contact.footer.backToTop}
            data-cursor-snap=""
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink hover:bg-accent-soft"
          >
            <ArrowUpIcon size={16} weight="bold" />
          </button>
        </div>
      </div>
    </footer>
  );
}
