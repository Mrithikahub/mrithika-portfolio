import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowSquareOutIcon, DownloadSimpleIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, XIcon } from "@phosphor-icons/react";
import type { Cert } from "../../data/content";
import { useSmoothScroll } from "../../providers/SmoothScroll";
import { Z } from "../../lib/layers";

const fileUrl = (file: string) => `/certificates/${encodeURIComponent(file)}`;
const previewUrl = (file: string, page: number) =>
  `/certificates/previews/${encodeURIComponent(file.replace(/\.[^.]+$/, ""))}-p${page}.webp`;

/**
 * Lightbox for one certificate. Every page is shown as its pre-rendered image (built by
 * `npm run images`), so PDFs display on phones too, where inline PDF viewers don't work.
 * Click a page or the magnifier to zoom; the original file is one click away via Download / Open.
 * Closes on Esc, the close button, or a click on the backdrop. Focus stays inside while open.
 */
export function CertViewer({ cert, onClose }: { cert: Cert | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const scroll = useSmoothScroll();
  const scrollRef = useRef(scroll);
  scrollRef.current = scroll;
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!cert) return;
    setZoom(false);
    const opener = document.activeElement as HTMLElement | null;
    scrollRef.current.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtn.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      scrollRef.current.start();
      opener?.focus();
    };
  }, [cert, onClose]);

  const pages = cert?.file ? Array.from({ length: cert.pages ?? 1 }, (_, i) => i + 1) : [];

  return createPortal(
    <AnimatePresence>
      {cert?.file && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
          style={{ zIndex: Z.modal }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-[#16130f]/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-viewer-title"
            className="relative flex max-h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-[24px] border border-line bg-elev shadow-lift"
            initial={reduce ? false : { y: 24, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduce ? undefined : { y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
              <div className="min-w-0 flex-1 basis-[220px]">
                <h2 id="cert-viewer-title" className="font-display text-[17px] font-bold leading-snug tracking-tight text-ink">
                  {cert.name}
                </h2>
                <p className="font-mono text-[11px] text-ink-faint">
                  {cert.issuer} · {cert.date}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => !z)}
                  aria-pressed={zoom}
                  aria-label={zoom ? "Zoom out" : "Zoom in"}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink"
                >
                  {zoom ? <MagnifyingGlassMinusIcon size={16} weight="bold" /> : <MagnifyingGlassPlusIcon size={16} weight="bold" />}
                </button>
                <a
                  href={fileUrl(cert.file)}
                  download
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3 font-mono text-[12px] text-ink transition-colors hover:border-ink"
                >
                  <DownloadSimpleIcon size={14} weight="bold" aria-hidden="true" />
                  Download
                </a>
                <a
                  href={fileUrl(cert.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3 font-mono text-[12px] text-[#22201d]"
                >
                  <ArrowSquareOutIcon size={14} weight="bold" aria-hidden="true" />
                  <span className="hidden sm:inline">Open in new tab</span>
                  <span className="sm:hidden">Open</span>
                </a>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={onClose}
                  aria-label="Close certificate viewer"
                  className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-ink text-bg"
                >
                  <XIcon size={16} weight="bold" />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-sunk p-3 sm:p-5" data-lenis-prevent="">
              <div className={`mx-auto flex flex-col gap-4 ${zoom ? "w-[220%] sm:w-[160%]" : "w-full max-w-[900px]"}`}>
                {pages.map((n) => (
                  <img
                    key={n}
                    src={previewUrl(cert.file!, n)}
                    alt={`${cert.name} certificate${pages.length > 1 ? `, page ${n} of ${pages.length}` : ""}`}
                    onClick={() => setZoom((z) => !z)}
                    className={`h-auto w-full rounded-xl bg-white shadow-soft ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
