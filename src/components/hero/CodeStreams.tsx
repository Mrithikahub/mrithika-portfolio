import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { hero } from "../../data/content";
import { useMediaQuery, usePrefersReducedMotion } from "../../hooks/useMediaQuery";

/*
 * "Code streams": tilted lanes of real project code drifting sideways behind the avatar card.
 * Pure texture: low-opacity text, CSS transform animations only (compositor-friendly),
 * paused off screen and in hidden tabs. Depth comes from size, blur and opacity per lane.
 * Every few seconds a front-lane line "executes" (orange glow) and a line types itself in.
 * Styles live under "Code streams" in index.css.
 */

type Depth = "front" | "mid" | "back";

interface Lane {
  depth: Depth;
  /** Seconds for one full loop. */
  duration: number;
  reverse: boolean;
}

const DESKTOP: Lane[] = [
  { depth: "back", duration: 95, reverse: false },
  { depth: "front", duration: 52, reverse: true },
  { depth: "mid", duration: 70, reverse: false },
  { depth: "back", duration: 100, reverse: true },
  { depth: "front", duration: 58, reverse: false },
  { depth: "mid", duration: 76, reverse: true },
  { depth: "back", duration: 90, reverse: false },
];

const MOBILE: Lane[] = [
  { depth: "mid", duration: 120, reverse: false },
  { depth: "front", duration: 95, reverse: true },
  { depth: "back", duration: 140, reverse: false },
  { depth: "front", duration: 105, reverse: true },
];

const TOKEN = /(#.*$|\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(def|return|import|from|const|let|await|async|for|in|if|else|class|with|as|lambda|None|True|False|new|export|default|function|try|except|while|not|and|or)\b/g;

/** Tiny highlighter: comments, strings and keywords. Everything else stays base colour. */
function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? "cs-c" : m[2] ? "cs-s" : "cs-k";
    out.push(
      <span key={m.index} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/** Deterministic shuffle so lanes differ but render identically every load. */
function shuffled<T>(items: T[], seed: number): T[] {
  const a = [...items];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CodeStreams({ sx, sy, live }: { sx: MotionValue<number>; sy: MotionValue<number>; live: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const typer = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const mobile = !useMediaQuery("(min-width: 1024px)");
  const lanes = mobile ? MOBILE : DESKTOP;

  // Moves opposite to the card's own pointer shift.
  const x = useTransform(sx, [-1, 1], [18, -18]);
  const y = useTransform(sy, [-1, 1], [12, -12]);

  const rows = useMemo(
    () =>
      lanes.map((_, i) => {
        // ~9 snippets per lane is wider than any screen; the copy makes the loop seamless.
        const picks = shuffled(hero.codeStream, 17 + i * 31).slice(0, 9);
        return picks.map((code, k) => (
          <span key={k} className="cs-snip">
            {highlight(code)}
          </span>
        ));
      }),
    [lanes],
  );

  // Play/pause with visibility; "execute" glow and the typed line run on timers that respect it.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let playing = true;
    const setPlay = (on: boolean) => {
      playing = on;
      el.dataset.play = String(on);
    };
    let inView = true;
    const sync = () => setPlay(inView && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    if (reduce) {
      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
      };
    }

    // Execute glow on a random visible snippet in a front lane.
    const box = () => el.getBoundingClientRect();
    const glow = window.setInterval(() => {
      if (!playing) return;
      const b = box();
      const candidates = Array.from(el.querySelectorAll<HTMLElement>(".cs-lane[data-depth='front'] .cs-snip")).filter((s) => {
        const r = s.getBoundingClientRect();
        return r.left > b.left + b.width * 0.3 && r.right < b.right - b.width * 0.1;
      });
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if (!pick) return;
      pick.classList.add("cs-run");
      window.setTimeout(() => pick.classList.remove("cs-run"), 1400);
    }, 2600);

    // A line that types itself in, holds, then fades.
    let typeTimer = 0;
    const lines = hero.codeStream;
    const typeOne = () => {
      const t = typer.current;
      if (!t) return;
      if (!playing) {
        typeTimer = window.setTimeout(typeOne, 2000);
        return;
      }
      const text = lines[Math.floor(Math.random() * lines.length)];
      let i = 0;
      t.parentElement!.dataset.state = "typing";
      const step = () => {
        t.textContent = text.slice(0, ++i);
        if (i < text.length) typeTimer = window.setTimeout(step, 38 + Math.random() * 40);
        else {
          typeTimer = window.setTimeout(() => {
            t.parentElement!.dataset.state = "fade";
            typeTimer = window.setTimeout(() => {
              t.textContent = "";
              t.parentElement!.dataset.state = "idle";
              typeTimer = window.setTimeout(typeOne, 3500 + Math.random() * 3000);
            }, 600);
          }, 1800);
        }
      };
      step();
    };
    typeTimer = window.setTimeout(typeOne, 2400);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(glow);
      window.clearTimeout(typeTimer);
    };
  }, [reduce]);

  return (
    <div
      ref={wrap}
      data-play="true"
      aria-hidden="true"
      className="cs pointer-events-none absolute inset-y-[-22%] left-[-12%] right-[-12%] select-none lg:left-[-48%] lg:right-[-18%]"
    >
      <motion.div className="absolute inset-0" style={live ? { x, y } : undefined}>
        {/* Lanes spread over the full height so they show above, below and beside the card. */}
        <div className="absolute inset-x-[-10%] inset-y-[4%] flex -rotate-[8deg] flex-col justify-between">
          {lanes.map((lane, i) => (
            <div key={i} className="cs-lane" data-depth={lane.depth}>
              <div
                className="cs-track"
                style={{ animationDuration: `${lane.duration}s`, animationDirection: lane.reverse ? "reverse" : "normal" }}
              >
                <div className="cs-run-set">{rows[i]}</div>
                <div className="cs-run-set">{rows[i]}</div>
              </div>
              {/* The typed line lives in the second front lane's slot, above the moving code. */}
              {i === 1 && !reduce && (
                <div className="cs-typer" data-state="idle">
                  <span ref={typer} />
                  <span className="cs-caret" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
