import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useIsDesktopPointer, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { Z } from "../../lib/layers";

const BASE = 34;

/**
 * Ring cursor for desktop pointers only.
 * - Elements with data-cursor="Label" grow the ring and show the label.
 * - Elements with data-cursor-snap snap the ring to their outline.
 * Position lives in motion values, so moving the mouse never re-renders React.
 */
export function Cursor() {
  const desktop = useIsDesktopPointer();
  const reduce = usePrefersReducedMotion();
  const enabled = desktop && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const w = useMotionValue(BASE);
  const h = useMotionValue(BASE);
  const r = useMotionValue(BASE / 2);

  const spring = { stiffness: 380, damping: 32, mass: 0.5 };
  const rx = useSpring(x, spring);
  const ry = useSpring(y, spring);
  const rw = useSpring(w, spring);
  const rh = useSpring(h, spring);
  const rr = useSpring(r, spring);

  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let snapEl: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      setHidden(false);
      if (snapEl) {
        const b = snapEl.getBoundingClientRect();
        // Follow a little inside the element so the snap still feels alive.
        x.set(b.left + b.width / 2 + (e.clientX - (b.left + b.width / 2)) * 0.12);
        y.set(b.top + b.height / 2 + (e.clientY - (b.top + b.height / 2)) * 0.12);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      // The nearest marked ancestor wins, so a link inside a "View" card still snaps.
      const hit = t?.closest<HTMLElement>("[data-cursor], [data-cursor-snap]");
      const labelled = hit?.hasAttribute("data-cursor") ? hit : null;
      const snap = hit?.hasAttribute("data-cursor-snap") ? hit : null;
      if (labelled) {
        snapEl = null;
        setLabel(labelled.dataset.cursor || null);
        w.set(84);
        h.set(84);
        r.set(42);
      } else if (snap) {
        snapEl = snap;
        const b = snap.getBoundingClientRect();
        const radius = parseFloat(getComputedStyle(snap).borderRadius) || 12;
        setLabel(null);
        w.set(b.width + 10);
        h.set(b.height + 10);
        r.set(Math.min(radius + 5, (b.height + 10) / 2));
      } else {
        snapEl = null;
        setLabel(null);
        w.set(BASE);
        h.set(BASE);
        r.set(BASE / 2);
      }
    };

    const leave = () => setHidden(true);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    const dot = document.getElementById("cursor-dot")!;
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y, w, h, r]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: Z.cursor }}>
      <div
        id="cursor-dot"
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent transition-opacity duration-200"
        style={{ opacity: hidden || label ? 0 : 1 }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center border border-ink/50 transition-[background-color,border-color,opacity] duration-300"
        style={{
          x: rx,
          y: ry,
          width: rw,
          height: rh,
          borderRadius: rr,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
          scale: pressed ? 0.88 : 1,
          backgroundColor: label ? "var(--accent)" : "transparent",
          borderColor: label ? "var(--accent)" : undefined,
        }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="mono-label font-medium text-[#22201d]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
