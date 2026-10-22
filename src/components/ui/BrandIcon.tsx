import type { SimpleIcon } from "simple-icons";

interface Props {
  icon: SimpleIcon;
  size?: number;
  /** Use the brand's own colour instead of currentColor. */
  brand?: boolean;
  className?: string;
  title?: string;
}

/** Renders a Simple Icons glyph. Paths come from the simple-icons package, never hand-drawn. */
export function BrandIcon({ icon, size = 20, brand = false, className = "", title }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={brand ? `#${icon.hex}` : "currentColor"}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={icon.path} />
    </svg>
  );
}
