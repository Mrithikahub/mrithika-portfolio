import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, WarningIcon } from "@phosphor-icons/react";
import { Z } from "../lib/layers";

type Tone = "success" | "error";

interface ToastCtx {
  show: (message: string, tone?: Tone) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

/** One transient toast at a time, announced politely to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: Tone } | null>(null);
  const timer = useRef<number>(0);

  const show = useCallback((message: string, tone: Tone = "success") => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center px-4 md:bottom-8"
        style={{ zIndex: Z.toast }}
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              className="flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-3 pr-4 font-mono text-[13px] text-bg shadow-lift"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full ${toast.tone === "success" ? "bg-accent text-[#22201d]" : "bg-bg text-ink"}`}
                aria-hidden="true"
              >
                {toast.tone === "success" ? <CheckIcon size={12} weight="bold" /> : <WarningIcon size={12} weight="bold" />}
              </span>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  return useContext(Ctx);
}
