import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

interface Palette {
  dot: string;
  accent: [number, number, number];
  teal: [number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  return {
    dot: s.getPropertyValue("--dot").trim() || "#cfc3b0",
    accent: hexToRgb(s.getPropertyValue("--accent") || "#f2622e"),
    teal: hexToRgb(s.getPropertyValue("--teal") || "#5fa89a"),
  };
}

/**
 * Interactive dot grid behind the hero.
 * Dots near the pointer are pulled in like iron filings, brighten from teal to orange,
 * and link up with thin lines into a live mesh. With no pointer (touch, idle),
 * a slow "phantom" attractor wanders so the field never looks dead.
 * Runs only while the hero is on screen and the tab is visible.
 */
export function NeuralField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let palette = readPalette();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let gap = 26;
    let dots: { x: number; y: number }[] = [];

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0, targetStrength: 0, lastMove: 0, real: false };
    let raf = 0;
    let running = false;
    let visible = true;
    let t0 = performance.now();

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = width < 640 ? 24 : 28;
      dots = [];
      const ox = (width % gap) / 2;
      const oy = (height % gap) / 2;
      for (let y = oy; y <= height; y += gap) {
        for (let x = ox; x <= width; x += gap) dots.push({ x, y });
      }
    };

    const radius = () => (width < 640 ? 120 : 190);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Phantom attractor when there is no real pointer activity.
      const idle = !pointer.real || now - pointer.lastMove > 2600;
      if (idle && !reduce) {
        const t = (now - t0) / 1000;
        pointer.tx = width * (width < 1024 ? 0.5 + 0.25 * Math.sin(t * 0.33) : 0.3 + 0.18 * Math.sin(t * 0.33));
        pointer.ty = height * (0.48 + 0.26 * Math.sin(t * 0.47 + 1.2));
        pointer.targetStrength = 0.75;
      }
      pointer.x += (pointer.tx - pointer.x) * (idle ? 0.04 : 0.16);
      pointer.y += (pointer.ty - pointer.y) * (idle ? 0.04 : 0.16);
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.08;

      const R = radius();
      const R2 = R * R;
      const near: { x: number; y: number; f: number }[] = [];
      const [ar, ag, ab] = palette.accent;
      const [tr, tg, tb] = palette.teal;

      ctx.fillStyle = palette.dot;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = pointer.x - d.x;
        const dy = pointer.y - d.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < R2 && pointer.strength > 0.01) {
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / R) * pointer.strength;
          const pull = f * f * 0.42;
          near.push({ x: d.x + dx * pull, y: d.y + dy * pull, f });
        } else {
          ctx.fillRect(d.x - 0.9, d.y - 0.9, 1.8, 1.8);
        }
      }

      // Mesh lines between nearby warped dots.
      const linkDist = gap * 1.55;
      const link2 = linkDist * linkDist;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < near.length; i++) {
        const a = near[i];
        for (let j = i + 1; j < near.length; j++) {
          const b = near[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            const f = Math.min(a.f, b.f);
            const mix = Math.min(1, f * 1.6);
            const r = Math.round(tr + (ar - tr) * mix);
            const g = Math.round(tg + (ag - tg) * mix);
            const bl = Math.round(tb + (ab - tb) * mix);
            ctx.strokeStyle = `rgba(${r},${g},${bl},${(f * 0.85).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Spokes from the pointer to the closest few dots.
      if (pointer.strength > 0.05) {
        const spokes = near.filter((n) => n.f > 0.55 * pointer.strength).slice(0, 14);
        ctx.lineWidth = 0.7;
        for (const n of spokes) {
          ctx.strokeStyle = `rgba(${ar},${ag},${ab},${(n.f * 0.5).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Bright nodes on top.
      for (const n of near) {
        const mix = Math.min(1, n.f * 1.5);
        const r = Math.round(tr + (ar - tr) * mix);
        const g = Math.round(tg + (ag - tg) * mix);
        const b = Math.round(tb + (ab - tb) * mix);
        ctx.fillStyle = `rgba(${r},${g},${b},${(0.35 + n.f * 0.65).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.1 + n.f * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.real = inside;
      if (inside) {
        pointer.tx = x;
        pointer.ty = y;
        pointer.lastMove = performance.now();
        pointer.targetStrength = 1;
      }
    };

    build();
    pointer.x = pointer.tx = width * 0.3;
    pointer.y = pointer.ty = height * 0.5;
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      build();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) startLoop();
      else stopLoop();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (visible) {
        t0 = performance.now() - 1;
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Re-read colours when the theme flips.
    const mo = new MutationObserver(() => {
      palette = readPalette();
      if (!running) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        // Strongest on the left (behind the copy); the code streams own the right side.
        maskImage: "radial-gradient(ellipse 75% 85% at 28% 50%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 85% at 28% 50%, #000 40%, transparent 100%)",
      }}
    />
  );
}
