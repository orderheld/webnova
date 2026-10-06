import Link from "next/link";
import { Icon } from "./icons";

type Variant = "primary" | "dark" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-ink",
  dark: "bg-ink text-white hover:bg-accent",
  ghost: "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white",
  light: "bg-white text-ink hover:bg-accent hover:text-white",
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
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  );
}
