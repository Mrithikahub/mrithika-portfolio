import { startTransition, useEffect, useState, type ReactNode } from "react";
import { About } from "./components/about/About";
import { Work } from "./components/work/Work";
import { Experience } from "./components/experience/Experience";
import { Stack } from "./components/stack/Stack";
import { Certs } from "./components/certs/Certs";
import { Community } from "./components/community/Community";
import { Contact } from "./components/contact/Contact";
import { SectionTransition } from "./components/transition/SectionTransition";
import { transitions } from "./data/content";

/** Fired (by SmoothScroll) when something needs a section that has not mounted yet. */
export const MOUNT_ALL_EVENT = "portfolio:mount-all";

const blocks: ReactNode[] = [
  <>
    <SectionTransition {...transitions.about} />
    <About />
  </>,
  <>
    <SectionTransition {...transitions.work} />
    <Work />
  </>,
  <>
    <SectionTransition {...transitions.experience} />
    <Experience />
  </>,
  <Stack />,
  <Certs />,
  <Community />,
  <>
    <SectionTransition {...transitions.contact} />
    <Contact />
  </>,
];

// Safari has no requestIdleCallback; a short timeout is a fine stand-in.
const hasIdle = typeof window.requestIdleCallback === "function";
const idle = (cb: () => void): number => (hasIdle ? window.requestIdleCallback(cb, { timeout: 500 }) : window.setTimeout(cb, 50));
const cancelIdle = (id: number) => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));

/**
 * Everything below the hero, in its own chunk (see App.tsx). Sections mount one per idle
 * frame as interruptible transitions, so a phone never sees one huge blocking task.
 */
export default function Sections() {
  const [count, setCount] = useState(1);
  const done = count >= blocks.length;

  useEffect(() => {
    if (done) return;
    const id = idle(() => startTransition(() => setCount((c) => c + 1)));
    return () => cancelIdle(id);
  }, [count, done]);

  // A nav click or deep link that needs a section before it exists mounts the rest at once.
  useEffect(() => {
    const all = () => setCount(blocks.length);
    window.addEventListener(MOUNT_ALL_EVENT, all);
    if (window.location.hash) all();
    return () => window.removeEventListener(MOUNT_ALL_EVENT, all);
  }, []);

  // Honour /#section once everything is in place.
  useEffect(() => {
    if (!done) return;
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [done]);

  return (
    <>
      {blocks.slice(0, count).map((b, i) => (
        <div key={i} className="contents">
          {b}
        </div>
      ))}
    </>
  );
}
