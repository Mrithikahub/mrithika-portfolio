import { useEffect, useRef, useState, type ReactNode } from "react";
import { DiscordLogoIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { siGmail } from "simple-icons";
import { BrandIcon } from "../ui/BrandIcon";
import { contact, socials } from "../../data/content";
import { copyText } from "../../lib/clipboard";
import { useToast } from "../../providers/ToastProvider";

/*
 * "Say Hey" social card.
 * Mechanic adapted from a Uiverse card by dovatgabriel: two halves split up and down
 * to reveal four icon links, and each icon bounces on hover.
 * Reveal triggers: hover (real hover devices only), keyboard focus inside the card,
 * or a first tap on touch screens (data-open). Styles live in index.css under .say-card.
 */

const icons: Record<(typeof socials)[number]["id"], ReactNode> = {
  github: <GithubLogoIcon size={24} weight="fill" />,
  linkedin: <LinkedinLogoIcon size={24} weight="fill" />,
  discord: <DiscordLogoIcon size={24} weight="fill" />,
  gmail: <BrandIcon icon={siGmail} size={22} />,
};

export function SocialCard() {
  const ref = useRef<HTMLDivElement>(null);
  const lastInput = useRef<"mouse" | "touch" | "keyboard">("mouse");
  const [open, setOpen] = useState(false);
  const { show } = useToast();

  // Close the touch reveal when tapping anywhere else.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    lastInput.current = e.pointerType === "mouse" ? "mouse" : "touch";
  };

  // First tap on a touch screen only reveals the icons; it never activates a link.
  const onClickCapture = (e: React.MouseEvent) => {
    if (lastInput.current === "touch" && !open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  };

  const copyDiscord = async (username: string) => {
    const ok = await copyText(username);
    show(ok ? contact.card.copiedDiscord : contact.copyFailed, ok ? "success" : "error");
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={contact.card.groupLabel}
      data-open={open}
      onPointerDown={onPointerDown}
      onKeyDown={() => (lastInput.current = "keyboard")}
      onClickCapture={onClickCapture}
      className="say-card relative h-16 w-[272px] rounded-full shadow-soft transition-shadow duration-300"
    >
      {/* Base with the four links */}
      <ul className="relative flex h-full items-stretch rounded-full bg-ink text-bg">
        {socials.map((s) => {
          const inner = (
            <>
              <span className="say-card__pill" aria-hidden="true" />
              <span className="say-card__icon relative" aria-hidden="true">
                {icons[s.id]}
              </span>
              <span className="say-card__tip" aria-hidden="true">
                {s.label}
              </span>
            </>
          );
          return (
            <li key={s.id} className="relative flex flex-1">
              {"copy" in s ? (
                <button type="button" className="say-card__link" aria-label={s.ariaLabel} onClick={() => copyDiscord(s.copy)}>
                  {inner}
                </button>
              ) : (
                <a
                  className="say-card__link"
                  href={s.href}
                  aria-label={s.ariaLabel}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {/* Cover: two orange halves plus the label */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
        <span className="say-card__half say-card__half--top" />
        <span className="say-card__half say-card__half--bottom" />
        <span className="say-card__label">{contact.card.label}</span>
      </div>
    </div>
  );
}
