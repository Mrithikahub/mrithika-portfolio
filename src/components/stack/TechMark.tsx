import { initials, techIcons } from "../../lib/techIcons";
import { BrandIcon } from "../ui/BrandIcon";

/** Logo for a skill, or a small mono initials badge when Simple Icons has no official mark. */
export function TechMark({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  const icon = techIcons[name];
  if (icon) return <BrandIcon icon={icon} size={size} className={className} />;
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-[5px] border border-current font-mono font-bold leading-none ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(7, size * 0.42) }}
    >
      {initials(name)}
    </span>
  );
}
