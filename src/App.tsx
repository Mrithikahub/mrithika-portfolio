import { lazy, Suspense, useEffect, useState } from "react";
import { useIntro } from "./providers/IntroProvider";
import { Header } from "./components/layout/Header";
import { Loader } from "./components/layout/Loader";
import { Cursor } from "./components/layout/Cursor";
import { Ambient } from "./components/layout/Ambient";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/hero/Hero";
import { Z } from "./lib/layers";

// Below-the-fold sections ship in a separate chunk. Its download starts once the hero is up
// (so it never competes with the hero for bandwidth), and it mounts when the browser is idle.
const loadSections = () => import("./Sections");
const Sections = lazy(loadSections);

export default function App() {
  // The chunk downloads immediately, but mounting thousands of nodes and GSAP pins waits until
  // the intro has finished and the browser is idle, so the hero's entrance stays smooth.
  const { ready } = useIntro();
  const [showSections, setShowSections] = useState(false);
  useEffect(() => {
    if (!ready) return;
    loadSections();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setShowSections(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setShowSections(true), 300);
    return () => clearTimeout(t);
  }, [ready]);

  const placeholder = <div className="min-h-[100dvh]" aria-hidden="true" />;
  return (
    <>
      <Loader />
      <Ambient />
      <Header />
      <main id="main" className="relative" style={{ zIndex: Z.content }}>
        <Hero />
        {showSections ? <Suspense fallback={placeholder}>{<Sections />}</Suspense> : placeholder}
      </main>
      <div className="relative" style={{ zIndex: Z.content }}>
        <Footer />
      </div>
      <Cursor />
    </>
  );
}
