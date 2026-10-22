import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useIsDesktopPointer, usePrefersReducedMotion } from "../../hooks/useMediaQuery";

type Variant = "primary" | "outline" | "ghost";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  /** Show the sliding arrow. */
  arrow?: boolean;
  icon?: ReactNode;
  strength?: number;
  className?: string;
}

type AnchorProps = BaseProps & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps> & { href: string };
type ButtonProps = BaseProps & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-[#22201d] shadow-[0_10px_30px_-12px_rgb(242_98_46/0.7)] hover:shadow-[0_16px_40px_-14px_rgb(242_98_46/0.85)]",
  outline: "border border-line-strong text-ink hover:border-ink bg-transparent",
  ghost: "text-ink hover:bg-accent-soft",
};

/** Pill button with a subtle magnetic pull toward the cursor and an arrow that slides through on hover. */
export function MagneticButton(props: AnchorProps | ButtonProps) {
  const { children, variant = "primary", arrow = false, icon, strength = 0.28, className = "", ...rest } = props;
  const ref = useRef<HTMLElement>(null);
  const desktop = useIsDesktopPointer();
  const reduce = usePrefersReducedMotion();
  const live = desktop && !reduce;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!live || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = `group relative inline-flex h-12 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-6 font-sans text-[15px] font-medium transition-[box-shadow,border-color,background-color] duration-300 active:scale-[0.98] ${variants[variant]} ${className}`;

  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <span className="relative -mr-1 inline-flex h-4 w-4 overflow-hidden" aria-hidden="true">
          <ArrowRightIcon
            size={16}
            weight="bold"
            className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-5"
          />
          <ArrowRightIcon
            size={16}
            weight="bold"
            className="absolute inset-0 -translate-x-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0"
          />
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    const anchorRest = rest as Omit<AnchorProps, keyof BaseProps>;
    return (
      <motion.a
        {...(anchorRest as object)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        data-cursor-snap=""
        style={{ x, y }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={classes}
      >
        {inner}
      </motion.a>
    );
  }

  const buttonRest = rest as Omit<ButtonProps, keyof BaseProps>;
  return (
    <motion.button
      type="button"
      {...(buttonRest as object)}
      ref={ref as React.Ref<HTMLButtonElement>}
      data-cursor-snap=""
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}
