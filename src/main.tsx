import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/rubik/wght.css";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@fontsource/caveat/600.css";
import "./index.css";
import { MotionGlobalConfig } from "motion/react";
import App from "./App";
import { ThemeProvider } from "./providers/ThemeProvider";
import { IntroProvider } from "./providers/IntroProvider";
import { SmoothScroll } from "./providers/SmoothScroll";
import { ToastProvider } from "./providers/ToastProvider";

// Dev aid: open with ?still to skip Motion animations (used for layout screenshots).
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("still")) {
  MotionGlobalConfig.skipAnimations = true;
}

// The site is a single page. Any other path is the 404: on Vercel that path is served by
// 404.html (real 404 status), and in dev Vite falls back to index.html, so both land here.
const path = window.location.pathname.replace(/\/index\.html$/, "/");
const isHome = path === "/" || path === "";
const NotFound = lazy(() => import("./components/notfound/NotFound").then((m) => ({ default: m.NotFound })));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      {isHome ? (
        <SmoothScroll>
          <IntroProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </IntroProvider>
        </SmoothScroll>
      ) : (
        <Suspense fallback={null}>
          <NotFound />
        </Suspense>
      )}
    </ThemeProvider>
  </StrictMode>,
);
