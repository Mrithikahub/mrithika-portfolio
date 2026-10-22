import { AnimatePresence, motion } from "motion/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "../../providers/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor-snap=""
      className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line-strong text-ink transition-colors duration-300 hover:border-ink hover:bg-accent-soft ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {dark ? <SunIcon size={18} weight="bold" /> : <MoonIcon size={18} weight="bold" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
