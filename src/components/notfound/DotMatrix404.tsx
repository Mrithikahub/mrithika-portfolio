import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

interface Dot {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Halftone "404" made of dots. The digits are rasterised offscreen in the display font,
 * sampled on a grid, and each sample becomes a dot that springs back to its home.
 * Dots scatter in on load, flee the pointer and re-form; a click sends a shockwave.
 * Reduced motion: dots are drawn in place, nothing moves.
 */
export function DotMatrix404({ text = "404", className = "" }: { text?: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Dev aid: ?still (see main.tsx) also freezes the dots at rest for layout screenshots.
  const still = import.meta.env.DEV && new URLSearchParams(window.location.search).has("still");
  const reduce = usePrefersReducedMotion() || still;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let color = "#f2622e";

    const readColor = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || color;
    };

    const build = async () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontSize = Math.min(height * 0.95, width / (text.length * 0.62));
      const font = `800 ${fontSize}px "Rubik Variable", system-ui, sans-serif`;
      try {
        await document.fonts.load(font);
      } catch {
        /* fall back to the system face */
      }

      const off = document.createElement("canvas");
      off.width = Math.round(width);
      off.height = Math.round(height);
      const o = off.getContext("2d")!;
      o.fillStyle = "#000";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = font;
      o.fillText(text, width / 2, height / 2 + fontSize * 0.04);
      const data = o.getImageData(0, 0, off.width, off.height).data;

      const step = Math.max(6, Math.round(fontSize / 26));
      const next: Dot[] = [];
      for (let y = step / 2; y < off.height; y += step) {
        for (let x = step / 2; x < off.width; x += step) {
          // Average a small neighbourhood so edge dots come out smaller: the halftone look.
          let sum = 0;
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const px = Math.min(off.width - 1, Math.max(0, Math.round(x + (dx * step) / 3)));
              const py = Math.min(off.height - 1, Math.max(0, Math.round(y + (dy * step) / 3)));
              sum += data[(py * off.width + px) * 4 + 3];
              n++;
            }
          }
          const a = sum / n / 255;
          if (a > 0.08) {
            const sx = reduce ? x : Math.random() * width;
            const sy = reduce ? y : Math.random() * height;
            next.push({ x: sx, y: sy, hx: x, hy: y, vx: 0, vy: 0, r: (step / 2) * (0.35 + a * 0.6) });
          }
        }
      }
      dots = next;
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      const R = Math.max(70, width * 0.09);
      for (const d of dots) {
        let ax = (d.hx - d.x) * 0.045;
        let ay = (d.hy - d.y) * 0.045;
        if (pointer.active) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < R * R) {
            const dist = Math.sqrt(dist2) || 1;
            const f = (1 - dist / R) * 6;
            ax += (dx / dist) * f;
            ay += (dy / dist) * f;
          }
        }
        d.vx = (d.vx + ax) * 0.84;
        d.vy = (d.vy + ay) * 0.84;
        d.x += d.vx;
        d.y += d.vy;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x > -40 && pointer.y > -40 && pointer.x < r.width + 40 && pointer.y < r.height + 40;
    };
    const onLeave = () => (pointer.active = false);
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      for (const d of dots) {
        const dx = d.x - px;
        const dy = d.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = Math.max(0, 1 - dist / (width * 0.6)) * 28;
        d.vx += (dx / dist) * f;
        d.vy += (dy / dist) * f;
      }
    };

    readColor();
    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readColor();
      if (reduce) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(tick);
    };

    if (!reduce) {
      raf = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointerdown", onDown);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [text, reduce]);

  return <canvas ref={canvasRef} role="img" aria-label={`Error ${text}`} className={`block h-full w-full touch-none ${className}`} />;
}
