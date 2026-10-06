import Link from "next/link";
import { Icon } from "./icons";

type Variant = "primary" | "dark" | "ghost" | "ghostLight" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-night hover:shadow-[0_0_0_6px_rgba(210,255,40,0.25),0_18px_40px_-12px_rgba(210,255,40,0.6)]",
  dark: "bg-night text-white hover:bg-accent hover:text-night",
  ghost: "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white",
  ghostLight: "border border-white/20 text-white hover:border-white hover:bg-white hover:text-night",
  light: "bg-white text-night hover:bg-accent",
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
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  );
}
