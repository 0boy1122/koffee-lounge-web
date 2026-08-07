import Link from "next/link";
import type { ReactNode } from "react";

export function ArrowButton({
  href,
  children,
  variant = "amber",
  className = "",
  onClick,
  type = "link",
}: {
  href?: string;
  children: ReactNode;
  variant?: "amber" | "espresso" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "link" | "button" | "submit";
}) {
  const styles = {
    amber: "bg-amber text-espresso-deep",
    espresso: "bg-espresso text-cream",
    outline: "bg-transparent text-espresso border-2 border-espresso",
  }[variant];

  const arrowBg = {
    amber: "bg-espresso-deep text-amber",
    espresso: "bg-amber text-espresso-deep",
    outline: "bg-espresso text-amber",
  }[variant];

  const content = (
    <>
      <span className="pl-5 pr-2 text-sm font-bold tracking-wide">{children}</span>
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${arrowBg}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  const baseClass = `inline-flex items-center rounded-full py-1 transition-transform hover:-translate-y-0.5 ${styles} ${className}`;

  if (type === "button" || type === "submit") {
    return (
      <button type={type === "submit" ? "submit" : "button"} onClick={onClick} className={baseClass}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={baseClass} onClick={onClick}>
      {content}
    </Link>
  );
}
