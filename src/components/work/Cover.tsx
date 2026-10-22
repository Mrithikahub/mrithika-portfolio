import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CoverKind, Project } from "../../data/content";

/*
 * Generated cover art for each project, drawn in SVG from the site palette.
 * Animations are CSS keyframes (see "Project covers" in index.css) and only run while
 * the cover is on screen. To use a real screenshot instead, set `image` on the project
 * in content.ts (e.g. "/images/projects/solarsite.webp").
 */

const W = 400;
const H = 260;

/** Small deterministic PRNG so covers look the same on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const mono = { fontFamily: "var(--font-mono)", fontSize: 10 } as const;

function Label({ x, y, children, fill = "var(--ink-soft)", anchor = "start" }: { x: number; y: number; children: ReactNode; fill?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fill={fill} textAnchor={anchor} style={mono}>
      {children}
    </text>
  );
}

function Heatmap() {
  const r = rng(7);
  const cols = 20;
  const rows = 13;
  const cw = W / cols;
  const ch = H / rows;
  const hot = [
    { x: 0.68, y: 0.38 },
    { x: 0.3, y: 0.62 },
    { x: 0.82, y: 0.75 },
  ];
  const cells: ReactNode[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const u = (i + 0.5) / cols;
      const v = (j + 0.5) / rows;
      let val = 0;
      for (const h of hot) val += Math.exp(-((u - h.x) ** 2 + (v - h.y) ** 2) / 0.03);
      val = Math.min(1, val * 0.9 + r() * 0.12);
      const color = val > 0.62 ? "var(--accent)" : "var(--teal)";
      const opacity = val > 0.62 ? 0.25 + (val - 0.62) * 1.6 : 0.08 + val * 0.55;
      cells.push(<rect key={`${i}-${j}`} x={i * cw + 1} y={j * ch + 1} width={cw - 2} height={ch - 2} rx={3} fill={color} opacity={opacity} />);
    }
  }
  return (
    <>
      {cells}
      {hot.map((h, i) => (
        <g key={i} transform={`translate(${h.x * W} ${h.y * H})`}>
          {[46, 30, 16].map((rad, k) => (
            <ellipse key={k} rx={rad * 1.3} ry={rad} fill="none" stroke="var(--ink)" strokeOpacity={0.25} strokeDasharray="3 4" />
          ))}
          <circle r={7} fill="var(--accent)" className="cv-pulse" style={{ animationDelay: `${i * 0.7}s` }} />
        </g>
      ))}
      <g transform={`translate(${0.68 * W + 16} ${0.38 * H - 26})`}>
        <rect width={92} height={22} rx={11} fill="var(--bg-elev)" stroke="var(--line-strong)" />
        <Label x={10} y={15} fill="var(--ink)">
          ROC-AUC 0.89
        </Label>
      </g>
    </>
  );
}

function Tracking() {
  const cars = [
    { id: "a", lane: 0, cls: "cv-drive-a", w: 70, h: 44, flag: false },
    { id: "b", lane: 1, cls: "cv-drive-b", w: 84, h: 52, flag: true },
    { id: "c", lane: 2, cls: "cv-drive-c", w: 64, h: 40, flag: false },
  ];
  return (
    <>
      {/* Road in perspective */}
      <path d={`M${W * 0.38} 0 L${W * 0.02} ${H} M${W * 0.62} 0 L${W * 0.98} ${H}`} stroke="var(--ink)" strokeOpacity={0.25} strokeWidth={2} />
      {[0.46, 0.54].map((x, i) => (
        <path key={i} d={`M${W * x} 0 L${W * (x < 0.5 ? 0.34 : 0.66)} ${H}`} stroke="var(--ink)" strokeOpacity={0.18} strokeDasharray="10 12" className="cv-road" />
      ))}
      <path d={`M0 ${H * 0.55} H${W}`} stroke="var(--accent)" strokeOpacity={0.5} strokeDasharray="4 6" />
      <Label x={8} y={H * 0.55 - 6} fill="var(--accent-ink)">
        speed line
      </Label>
      {cars.map((c) => (
        <g key={c.id} className={c.cls} transform={`translate(${[110, 200, 290][c.lane]} ${[200, 120, 170][c.lane]})`}>
          <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} rx={6} fill="var(--ink)" opacity={0.1} />
          <rect
            x={-c.w / 2 - 6}
            y={-c.h / 2 - 6}
            width={c.w + 12}
            height={c.h + 12}
            rx={4}
            fill="none"
            stroke={c.flag ? "var(--accent)" : "var(--teal)"}
            strokeWidth={2}
          />
          <rect x={-c.w / 2 - 7} y={-c.h / 2 - 24} width={30} height={16} rx={3} fill={c.flag ? "var(--accent)" : "var(--teal)"} />
          <text x={-c.w / 2 - 2} y={-c.h / 2 - 12.5} fill="#22201d" style={{ ...mono, fontSize: 9.5 }}>
            car
          </text>
          {/* Licence plate detection box */}
          <rect x={-14} y={c.h / 2 - 14} width={28} height={10} rx={2} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
          {c.flag && (
            <text x={18} y={c.h / 2 - 6} fill="var(--accent-ink)" style={{ ...mono, fontSize: 9 }}>
              plate
            </text>
          )}
        </g>
      ))}
    </>
  );
}

function Graph({ seed = 3, hot = 2 }: { seed?: number; hot?: number }) {
  const r = rng(seed);
  const nodes = Array.from({ length: 14 }, () => ({ x: 30 + r() * (W - 60), y: 26 + r() * (H - 52), s: 4 + r() * 6 }));
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const sorted = nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    sorted.forEach(({ j }) => {
      if (!edges.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) edges.push([i, j]);
    });
  });
  return (
    <>
      {edges.map(([i, j], k) => (
        <g key={k}>
          <line x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} stroke="var(--ink)" strokeOpacity={0.2} />
          <line
            x1={nodes[i].x}
            y1={nodes[i].y}
            x2={nodes[j].x}
            y2={nodes[j].y}
            stroke={k % 3 === 0 ? "var(--accent)" : "var(--teal)"}
            strokeWidth={2}
            pathLength={100}
            className="cv-dash"
            style={{ animationDelay: `${(k * 0.37) % 2.2}s` }}
          />
        </g>
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.s}
          fill={i < hot ? "var(--accent)" : "var(--bg-elev)"}
          stroke={i < hot ? "none" : "var(--teal)"}
          strokeWidth={2}
          className={i < hot ? "cv-pulse" : undefined}
        />
      ))}
    </>
  );
}

function Finance() {
  const segs = [
    { v: 0.38, c: "var(--accent)" },
    { v: 0.24, c: "var(--teal)" },
    { v: 0.18, c: "var(--ink)" },
    { v: 0.2, c: "var(--line-strong)" },
  ];
  let offset = 0;
  const bars = [0.45, 0.7, 0.5, 0.82, 0.62, 0.38, 0.74];
  return (
    <>
      <g transform="translate(110 130) rotate(-90)" className="cv-spin-slow">
        {segs.map((s, i) => {
          const el = (
            <circle
              key={i}
              r={62}
              fill="none"
              stroke={s.c}
              strokeOpacity={i === 2 ? 0.8 : 1}
              strokeWidth={22}
              pathLength={100}
              strokeDasharray={`${s.v * 100 - 1.5} ${100 - s.v * 100 + 1.5}`}
              strokeDashoffset={-offset * 100}
            />
          );
          offset += s.v;
          return el;
        })}
      </g>
      <Label x={110} y={134} anchor="middle" fill="var(--ink)">
        budget
      </Label>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={226 + i * 22}
          y={200 - b * 130}
          width={14}
          height={b * 130}
          rx={4}
          fill={i === 3 ? "var(--accent)" : "var(--teal)"}
          className="cv-grow"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <line x1={220} x2={384} y1={200} y2={200} stroke="var(--ink)" strokeOpacity={0.3} />
      <Label x={226} y={220}>
        M T W T F S S
      </Label>
    </>
  );
}

function Insurance() {
  const r = rng(11);
  const pts = Array.from({ length: 16 }, (_, i) => {
    const base = i < 9 ? 40 + r() * 30 : 95 + r() * 60;
    return [20 + i * 24, H - 40 - base] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <>
      {Array.from({ length: 26 }, (_, i) => (
        <line key={i} x1={(i * 37) % W} y1={-20} x2={(i * 37) % W - 8} y2={0} stroke="var(--teal)" strokeOpacity={0.45} strokeWidth={1.5} className="cv-rain" style={{ animationDelay: `${(i * 0.13) % 1.2}s` }} />
      ))}
      <line x1={0} x2={W} y1={H - 150} y2={H - 150} stroke="var(--accent)" strokeDasharray="6 5" />
      <Label x={W - 8} y={H - 156} anchor="end" fill="var(--accent-ink)">
        rainfall trigger
      </Label>
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth={2.5} pathLength={1} className="cv-draw" />
      <g transform={`translate(${pts[11][0]} ${pts[11][1]})`}>
        <circle r={7} fill="var(--accent)" className="cv-pulse" />
        <rect x={10} y={-26} width={92} height={20} rx={10} fill="var(--accent)" />
        <text x={20} y={-12} fill="#22201d" style={mono}>
          payout
        </text>
      </g>
    </>
  );
}

function Goals() {
  const rings = [
    { r: 92, v: 0.72, c: "var(--accent)" },
    { r: 70, v: 0.5, c: "var(--teal)" },
    { r: 48, v: 0.86, c: "var(--ink)" },
  ];
  return (
    <>
      <g transform={`translate(${W / 2 - 60} ${H / 2}) rotate(-90)`}>
        {rings.map((g, i) => (
          <g key={i}>
            <circle r={g.r} fill="none" stroke="var(--line)" strokeWidth={14} />
            <circle r={g.r} fill="none" stroke={g.c} strokeWidth={14} strokeLinecap="round" pathLength={100} strokeDasharray={`${g.v * 100} 100`} className="cv-ring" style={{ animationDelay: `${i * 0.2}s` }} />
          </g>
        ))}
      </g>
      {["goal", "milestone", "streak"].map((t, i) => (
        <g key={t} transform={`translate(${W / 2 + 60} ${H / 2 - 30 + i * 28})`}>
          <rect width={10} height={10} rx={3} fill={rings[i].c} />
          <Label x={18} y={9} fill="var(--ink)">
            {t}
          </Label>
        </g>
      ))}
    </>
  );
}

function Molecule() {
  const cx = W / 2 - 40;
  const cy = H / 2;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + Math.cos(a) * 52, cy + Math.sin(a) * 52] as const;
  });
  const tails = [
    [hex[1], [hex[1][0] + 56, hex[1][1] - 26]],
    [hex[3], [hex[3][0] + 10, hex[3][1] + 58]],
    [hex[5], [hex[5][0] - 54, hex[5][1] - 28]],
  ] as const;
  return (
    <>
      <polygon points={hex.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeOpacity={0.6} strokeWidth={2.5} />
      {tails.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ink)" strokeOpacity={0.6} strokeWidth={2.5} />
      ))}
      {hex.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={8} fill="var(--bg-elev)" stroke="var(--teal)" strokeWidth={2.5} />
      ))}
      {tails.map(([, b], i) => (
        <circle key={i} cx={b[0]} cy={b[1]} r={i === 0 ? 11 : 8} fill={i === 0 ? "var(--accent)" : "var(--teal)"} className={i === 0 ? "cv-pulse" : undefined} />
      ))}
      <g transform={`translate(${W - 150} ${H / 2 - 44})`}>
        <rect width={130} height={88} rx={12} fill="var(--bg-elev)" stroke="var(--line-strong)" />
        <Label x={12} y={24} fill="var(--accent-ink)">
          interaction
        </Label>
        <Label x={12} y={46}>
          allergy
        </Label>
        <Label x={12} y={68}>
          contraindication
        </Label>
      </g>
    </>
  );
}

function Triage() {
  const buckets = ["access", "billing", "bug"];
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} transform={`translate(24 ${30 + i * 42})`}>
          <rect width={110} height={28} rx={8} fill="var(--bg-elev)" stroke="var(--line-strong)" />
          <rect x={10} y={10} width={50 + ((i * 17) % 34)} height={4} rx={2} fill="var(--ink)" opacity={0.35} />
          <rect x={10} y={18} width={30 + ((i * 11) % 30)} height={3} rx={1.5} fill="var(--ink)" opacity={0.2} />
        </g>
      ))}
      <g transform="translate(176 94)">
        <rect width={64} height={64} rx={16} fill="var(--accent)" />
        <text x={32} y={37} textAnchor="middle" fill="#22201d" style={{ ...mono, fontSize: 11, fontWeight: 700 }}>
          RAG
        </text>
      </g>
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M134 ${44 + i * 42} C 160 ${44 + i * 42}, 150 126, 176 126`} fill="none" stroke="var(--teal)" strokeWidth={1.5} pathLength={100} className="cv-dash" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {buckets.map((b, i) => (
        <g key={b}>
          <path d={`M240 126 C 270 126, 262 ${60 + i * 66}, 290 ${60 + i * 66}`} fill="none" stroke="var(--accent)" strokeWidth={1.5} pathLength={100} className="cv-dash" style={{ animationDelay: `${0.6 + i * 0.35}s` }} />
          <rect x={290} y={44 + i * 66} width={90} height={32} rx={10} fill="var(--bg-elev)" stroke="var(--teal)" strokeWidth={1.5} />
          <Label x={335} y={64 + i * 66} anchor="middle" fill="var(--ink)">
            {b}
          </Label>
        </g>
      ))}
    </>
  );
}

function Report() {
  return (
    <>
      <g transform="translate(118 18)">
        <rect width={164} height={224} rx={12} fill="var(--bg-elev)" stroke="var(--line-strong)" />
        <rect x={16} y={18} width={70} height={8} rx={4} fill="var(--accent)" />
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={16}
            y={42 + i * 19}
            width={[120, 132, 96, 128, 110, 70, 124, 102, 86][i]}
            height={6}
            rx={3}
            fill="var(--ink)"
            opacity={0.28}
            className="cv-type"
            style={{ animationDelay: `${i * 0.28}s` }}
          />
        ))}
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i === 1 ? 300 : 20} ${40 + i * 62})`}>
          <rect width={84} height={40} rx={8} fill="var(--teal)" opacity={0.2} />
          <rect x={10} y={12} width={52} height={4} rx={2} fill="var(--teal-deep)" />
          <rect x={10} y={22} width={36} height={4} rx={2} fill="var(--teal-deep)" opacity={0.6} />
        </g>
      ))}
      <Label x={24} y={238}>
        chunk
      </Label>
    </>
  );
}

function Sentiment() {
  const series = [
    { name: "GRU", c: "var(--teal)", pts: [0.42, 0.6, 0.7, 0.76, 0.8, 0.82, 0.83, 0.835] },
    { name: "LSTM", c: "var(--ink)", pts: [0.4, 0.57, 0.68, 0.74, 0.78, 0.81, 0.82, 0.825] },
    { name: "Bi-LSTM", c: "var(--accent)", pts: [0.45, 0.63, 0.73, 0.79, 0.83, 0.845, 0.848, 0.849] },
  ];
  // Curve shapes are illustrative; the only number shown is the real best accuracy.
  const x = (i: number) => 30 + i * 42;
  const y = (v: number) => H - 30 - (v - 0.35) * 380;
  return (
    <>
      {[0.5, 0.65, 0.8].map((v) => (
        <line key={v} x1={36} x2={W - 16} y1={y(v)} y2={y(v)} stroke="var(--line)" />
      ))}
      <Label x={x(7) + 8} y={y(0.849) + 4} fill="var(--accent-ink)">
        ~84.9%
      </Label>
      {series.map((s, k) => (
        <path
          key={s.name}
          d={s.pts.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ")}
          fill="none"
          stroke={s.c}
          strokeWidth={k === 2 ? 3 : 2}
          pathLength={1}
          className="cv-draw"
          style={{ animationDelay: `${k * 0.25}s` }}
        />
      ))}
      {series.map((s, k) => (
        <g key={s.name} transform={`translate(${46 + k * 96} 22)`}>
          <rect width={12} height={4} y={-4} rx={2} fill={s.c} />
          <Label x={18} y={0} fill="var(--ink)">
            {s.name}
          </Label>
        </g>
      ))}
    </>
  );
}

function Billing() {
  const widths = [
    [64, 18, 46],
    [52, 14, 40],
    [72, 18, 50],
  ];
  return (
    <g transform="translate(70 22)">
      <rect width={260} height={216} rx={14} fill="var(--bg-elev)" stroke="var(--line-strong)" />
      <rect x={18} y={18} width={84} height={10} rx={5} fill="var(--ink)" opacity={0.75} />
      <g transform="translate(18 56)">
        <Label x={0} y={0} fill="var(--ink-faint)">
          item
        </Label>
        <Label x={150} y={0} anchor="end" fill="var(--ink-faint)">
          qty
        </Label>
        <Label x={224} y={0} anchor="end" fill="var(--ink-faint)">
          amount
        </Label>
        <line x1={0} x2={224} y1={9} y2={9} stroke="var(--line)" />
      </g>
      {widths.map(([a, q, m], i) => (
        <g key={i} transform={`translate(18 ${82 + i * 26})`}>
          <rect x={0} y={-7} width={a} height={6} rx={3} fill="var(--ink)" opacity={0.3} />
          <rect x={150 - q} y={-7} width={q} height={6} rx={3} fill="var(--ink)" opacity={0.3} />
          <rect x={224 - m} y={-7} width={m} height={6} rx={3} fill="var(--ink)" opacity={0.3} />
          <line x1={0} x2={224} y1={9} y2={9} stroke="var(--line)" />
        </g>
      ))}
      <Label x={18} y={176} fill="var(--ink-soft)">
        GST
      </Label>
      <rect x={196} y={170} width={46} height={6} rx={3} fill="var(--ink)" opacity={0.3} />
      <rect x={140} y={186} width={102} height={22} rx={11} fill="var(--accent)" className="cv-pulse-soft" />
      <text x={191} y={201} textAnchor="middle" fill="#22201d" style={{ ...mono, fontWeight: 700 }}>
        total
      </text>
    </g>
  );
}

function Aquifer() {
  const band = (y: number, amp: number, phase: number) => {
    let d = `M0 ${y}`;
    for (let x = 0; x <= W; x += 20) d += ` L${x} ${y + Math.sin(x / 50 + phase) * amp}`;
    return d + ` L${W} ${H} L0 ${H} Z`;
  };
  return (
    <>
      <path d={band(70, 8, 0)} fill="var(--ink)" opacity={0.06} />
      <path d={band(120, 10, 1.4)} fill="var(--ink)" opacity={0.08} />
      <path d={band(150, 9, 2.1)} fill="var(--teal)" opacity={0.35} className="cv-water" />
      <path d={band(205, 7, 0.6)} fill="var(--ink)" opacity={0.12} />
      {[88, 196, 312].map((x, i) => (
        <g key={x}>
          <line x1={x} x2={x} y1={30} y2={i === 1 ? 168 : 140} stroke="var(--ink)" strokeOpacity={0.5} strokeWidth={2} strokeDasharray="4 3" />
          <circle cx={x} cy={i === 1 ? 168 : 140} r={i === 1 ? 7 : 5} fill={i === 1 ? "var(--accent)" : "var(--teal)"} className={i === 1 ? "cv-pulse" : undefined} />
          <path d={`M${x - 7} 30 L${x + 7} 30 L${x} 18 Z`} fill="var(--ink)" opacity={0.6} />
        </g>
      ))}
      <Label x={210} y={186} fill="var(--accent-ink)">
        aquifer
      </Label>
    </>
  );
}

function Review() {
  const items = [
    { t: "uses a data loader", ok: true },
    { t: "tests included", ok: true },
    { t: "docstrings", ok: false },
    { t: "error handling", ok: true },
  ];
  return (
    <>
      {items.map((it, i) => (
        <g key={it.t} transform={`translate(40 ${36 + i * 40})`} className="cv-row" style={{ animationDelay: `${i * 0.35}s` }}>
          <rect width={220} height={30} rx={10} fill="var(--bg-elev)" stroke="var(--line-strong)" />
          <circle cx={18} cy={15} r={8} fill={it.ok ? "var(--teal)" : "var(--accent)"} />
          <text x={18} y={19} textAnchor="middle" fill="#22201d" style={{ ...mono, fontWeight: 700 }}>
            {it.ok ? "✓" : "!"}
          </text>
          <Label x={34} y={19} fill="var(--ink)">
            {it.t}
          </Label>
        </g>
      ))}
      <g transform="translate(336 104)">
        <circle r={42} fill="none" stroke="var(--line)" strokeWidth={10} />
        <circle r={42} fill="none" stroke="var(--accent)" strokeWidth={10} strokeLinecap="round" pathLength={100} strokeDasharray="75 100" transform="rotate(-90)" className="cv-ring" />
        <text x={0} y={4} textAnchor="middle" fill="var(--ink)" style={{ ...mono, fontSize: 12, fontWeight: 700 }}>
          rubric
        </text>
      </g>
    </>
  );
}

function Hand() {
  // 21 MediaPipe-style landmarks for an open palm (approximate, normalised to the cover).
  const p: [number, number][] = [
    [200, 228], [168, 210], [146, 186], [132, 162], [120, 140],
    [176, 150], [170, 112], [166, 88], [163, 66],
    [200, 146], [200, 104], [200, 76], [200, 52],
    [224, 150], [230, 112], [234, 88], [237, 68],
    [246, 162], [258, 132], [266, 112], [272, 94],
  ];
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  return (
    <>
      <g className="cv-sway">
        {links.map(([a, b], i) => (
          <line key={i} x1={p[a][0]} y1={p[a][1]} x2={p[b][0]} y2={p[b][1]} stroke="var(--teal)" strokeWidth={3} strokeLinecap="round" />
        ))}
        {p.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={[4, 8, 12, 16, 20].includes(i) ? 6 : 4.5} fill={[4, 8, 12, 16, 20].includes(i) ? "var(--accent)" : "var(--bg-elev)"} stroke="var(--ink)" strokeOpacity={0.6} strokeWidth={1.5} />
        ))}
      </g>
      <g transform="translate(300 40)">
        <rect width={74} height={74} rx={16} fill="var(--bg-elev)" stroke="var(--line-strong)" />
        <text x={37} y={50} textAnchor="middle" fill="var(--ink)" style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 700 }}>
          B
        </text>
      </g>
      <Label x={337} y={134} anchor="middle" fill="var(--accent-ink)">
        letter
      </Label>
    </>
  );
}

const scenes: Record<CoverKind, () => ReactNode> = {
  heatmap: () => <Heatmap />,
  tracking: () => <Tracking />,
  graph: () => <Graph seed={3} hot={2} />,
  finance: () => <Finance />,
  insurance: () => <Insurance />,
  goals: () => <Goals />,
  molecule: () => <Molecule />,
  triage: () => <Triage />,
  report: () => <Report />,
  sentiment: () => <Sentiment />,
  billing: () => <Billing />,
  aquifer: () => <Aquifer />,
  review: () => <Review />,
  hand: () => <Hand />,
};

export function Cover({ project, className = "" }: { project: Project; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-play={play} className={`cover dot-grid relative overflow-hidden bg-sunk ${className}`}>
      {project.image ? (
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={`Illustration for ${project.title}`}>
          {scenes[project.cover]()}
        </svg>
      )}
    </div>
  );
}
