import Link from "next/link";
import { Icon } from "./icons";

type Variant = "primary" | "accent" | "dark" | "ghost" | "ghostLight" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-night",
  /** White button for dark (night) sections: the one strong accent there. */
  accent: "bg-white text-accent hover:bg-accent-soft",
  dark: "bg-night text-white hover:bg-accent",
  ghost: "border border-ink/15 bg-white text-ink hover:border-accent hover:text-accent",
  ghostLight: "border border-white/25 text-white hover:border-white hover:bg-white/10",
  light: "bg-white text-night hover:bg-white/90",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-[4px] px-6 py-3.5 text-[15px] font-medium transition-colors duration-200 ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  );
}
