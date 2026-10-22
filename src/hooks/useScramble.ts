import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/_-=+*#";

interface Options {
  /** Milliseconds per character to settle. */
  speed?: number;
  /** Start delay in ms. */
  delay?: number;
  /** Skip the effect and write the final text immediately. */
  instant?: boolean;
  onDone?: () => void;
}

/**
 * Decodes `text` into the element's textContent, character by character.
 * Writes straight to the DOM in a rAF loop so React never re-renders per frame.
 */
export function useScramble<T extends HTMLElement>(text: string, { speed = 28, delay = 0, instant = false, onDone }: Options = {}) {
  const ref = useRef<T>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (instant) {
      el.textContent = text;
      doneRef.current?.();
      return;
    }

    const from = el.textContent ?? "";
    const length = Math.max(from.length, text.length);
    const queue = Array.from({ length }, (_, i) => {
      const start = Math.floor(Math.random() * 6);
      return { from: from[i] ?? "", to: text[i] ?? "", start, end: start + 4 + Math.floor((i * speed) / 16) };
    });

    let raf = 0;
    let timer = 0;
    let t0 = 0;

    // Time-based (not frame-counted) so it settles on time on 120Hz screens and after throttled background tabs.
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const frame = Math.floor((now - t0) / 16.67);
      let out = "";
      let settled = 0;
      for (const q of queue) {
        if (frame >= q.end) {
          settled++;
          out += q.to;
        } else if (frame >= q.start) {
          out += q.to === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          out += q.from;
        }
      }
      el.textContent = out;
      if (settled === queue.length) {
        doneRef.current?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, speed, delay, instant]);

  return ref;
}
