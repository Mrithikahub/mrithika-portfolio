import { useEffect, useState } from "react";
import { hero } from "../../data/content";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

const CHAR_MS = 26;
const ROW_GAP_MS = 140;

/**
 * Contents of the hero's glass panel: a little terminal "whoami" whose rows type in
 * one by one once the intro has finished, then a blinking ready line.
 * Screen readers get every row in full immediately; the typing is visual only.
 */
export function WhoamiPanel({ start, delayMs = 1100 }: { start: boolean; delayMs?: number }) {
  const reduce = usePrefersReducedMotion();
  const rows = hero.panel.rows;
  // row index being typed and how many characters of its value are showing
  const [row, setRow] = useState(reduce ? rows.length : -1);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (reduce) {
      setRow(rows.length);
      return;
    }
    if (!start) return;
    const timers: number[] = [];
    let t = delayMs;
    rows.forEach(([, value], r) => {
      timers.push(window.setTimeout(() => (setRow(r), setChars(0)), t));
      for (let c = 1; c <= value.length; c++) {
        t += CHAR_MS;
        timers.push(window.setTimeout(() => setChars(c), t));
      }
      t += ROW_GAP_MS;
    });
    timers.push(window.setTimeout(() => setRow(rows.length), t));
    return () => timers.forEach(clearTimeout);
  }, [start, reduce, rows, delayMs]);

  const done = row >= rows.length;

  return (
    <>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-accent-ink">{hero.panel.title}</span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
        </span>
      </div>

      <dl className="space-y-1.5 font-mono text-[10.5px] sm:text-[11px]">
        {rows.map(([k, v], i) => {
          const visible = i < row || done ? v : i === row ? v.slice(0, chars) : "";
          const shown = i <= row || done;
          const typing = i === row && !done;
          return (
            <div key={k} className={`flex items-center justify-between gap-3 transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}>
              <dt className="text-ink-faint">{k}</dt>
              <dd className="flex min-h-[1.4em] items-center gap-1.5 whitespace-nowrap text-ink">
                <span className="sr-only">{v}</span>
                {k === "status" && shown && (
                  <span className="relative grid h-2 w-2 place-items-center" aria-hidden="true">
                    <span className="status-ping absolute inset-0 rounded-full bg-ok" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-ok" />
                  </span>
                )}
                <span aria-hidden="true">{visible}</span>
                {typing && <span className="caret inline-block h-[1em] w-[0.5em] bg-accent" aria-hidden="true" />}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className={`mt-3 border-t border-line pt-2.5 font-mono text-[10.5px] text-ink-soft transition-opacity duration-300 sm:text-[11px] ${done ? "opacity-100" : "opacity-0"}`}>
        <span className="text-accent-ink">&gt;</span> {hero.panel.footer.key} = <span className="text-teal-deep">{hero.panel.footer.value}</span>
        <span className="caret ml-1 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-accent" aria-hidden="true" />
      </p>
    </>
  );
}
