import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap";

const sizes = {
  md: "px-6 py-3",
  lg: "px-8 py-4 text-base",
  sm: "px-4 py-2 text-xs",
};

const variants: Record<Variant, string> = {
  primary: "btn-gradient text-white",
  secondary:
    "bg-white/80 text-plum border border-lavender-100 hover:border-lavender-300 hover:bg-white shadow-sm hover:shadow-md",
  ghost: "text-plum-soft hover:text-plum",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
