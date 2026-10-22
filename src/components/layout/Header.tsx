import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { nav, site, socials, contact } from "../../data/content";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useSmoothScroll } from "../../providers/SmoothScroll";
import { useIntro } from "../../providers/IntroProvider";
import { Z } from "../../lib/layers";

const meta = [
  { k: "Name", v: site.name },
  { k: "Role", v: site.role, short: site.roleShort },
  { k: "Based", v: site.based },
];

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollTo, stop, start } = useSmoothScroll();
  const { ready } = useIntro();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  useEffect(() => {
    if (open) stop();
    else start();
  }, [open, stop, start]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollTo(href), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled ? "border-b border-line bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
        }`}
        style={{ zIndex: Z.header }}
        initial={{ y: -24, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 rounded-full bg-accent px-4 py-2 text-sm text-[#22201d]">
          Skip to content
        </a>
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-10">
          <a href="#home" onClick={go("#home")} className="mono-label shrink-0 text-ink md:hidden" aria-label={`${site.name}, back to top`}>
            {site.name}
          </a>

          <dl className="hidden flex-1 grid-cols-3 gap-6 md:grid lg:max-w-[720px]">
            {meta.map((m) => (
              <div key={m.k} className="min-w-0">
                <dt className="mono-label text-ink-faint">{m.k} /</dt>
                <dd className="mono-label truncate text-ink">
                  {m.short ? (
                    <>
                      <span className="xl:hidden">{m.short}</span>
                      <span className="hidden xl:inline">{m.v}</span>
                    </>
                  ) : (
                    m.v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={go(n.href)}
                data-cursor-snap=""
                className="mono-label group relative rounded-full px-3 py-2 text-ink transition-colors hover:text-accent-ink"
              >
                {n.label}
                <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <ThemeToggle className="ml-auto md:ml-2" />
        </div>
      </motion.header>

      {/* Floating circular menu button, mobile and tablet portrait */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed bottom-5 right-5 grid h-14 w-14 place-items-center rounded-full bg-accent text-[#22201d] shadow-[0_14px_30px_-10px_rgb(242_98_46/0.8)] active:scale-95 md:hidden"
        style={{ zIndex: Z.menuButton }}
        initial={{ scale: 0 }}
        animate={ready ? { scale: 1 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "list"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <MobileMenu open={open} onClose={() => setOpen(false)} go={go} />
    </>
  );
}

function MobileMenu({ open, onClose, go }: { open: boolean; onClose: () => void; go: (href: string) => (e: React.MouseEvent) => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 flex flex-col bg-bg px-6 pb-28 pt-24 md:hidden"
          style={{ zIndex: Z.menu }}
          initial={{ clipPath: "circle(0% at calc(100% - 48px) calc(100% - 48px))" }}
          animate={{ clipPath: "circle(150% at calc(100% - 48px) calc(100% - 48px))" }}
          exit={{ clipPath: "circle(0% at calc(100% - 48px) calc(100% - 48px))" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <nav aria-label="Mobile" className="relative flex flex-col gap-1">
            {nav.map((n, i) => (
              <div key={n.href} className="overflow-hidden">
                <motion.a
                  ref={i === 0 ? firstLink : undefined}
                  href={n.href}
                  onClick={go(n.href)}
                  className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.75rem,14vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-ink"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "110%" }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-xs font-normal text-ink-faint">0{i + 1}</span>
                  {n.label}
                </motion.a>
              </div>
            ))}
          </nav>
          <motion.div
            className="relative mt-auto flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.45 }}
          >
            <a href={`mailto:${site.email}`} className="font-mono text-sm text-accent-ink underline-offset-4 hover:underline">
              {site.email}
            </a>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.filter((s) => "href" in s && s.href.startsWith("https")).map((s) => (
                <li key={s.label}>
                  <a href={"href" in s ? s.href : undefined} target="_blank" rel="noopener noreferrer" className="mono-label text-ink-soft hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mono-label text-ink-faint">{contact.footer.corner}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
