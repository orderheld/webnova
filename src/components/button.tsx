import Link from "next/link";
import { Icon } from "./icons";

type Variant = "primary" | "accent" | "dark" | "ghost" | "ghostLight" | "light";

const styles: Record<Variant, string> = {
  /** Main call to action on light backgrounds: Schieferblau, deepens to night on hover. */
  primary: "bg-accent text-white shadow-xs hover:bg-night hover:shadow-card",
  /** White button for dark (night / Schieferblau) sections: the one strong accent there. */
  accent: "bg-white text-accent shadow-xs hover:bg-bright-soft",
  dark: "bg-night text-white hover:bg-accent",
  ghost: "border border-line bg-white text-ink shadow-xs hover:border-accent/40 hover:text-accent",
  ghostLight: "border border-white/25 text-white hover:border-white/60 hover:bg-white/[0.06]",
  light: "bg-white text-night hover:bg-bright-soft",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  icon,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  /** Optional leading icon (e.g. "phone"). */
  icon?: string;
  className?: string;
}) {
  const external = /^(tel:|mailto:|https?:)/.test(href);
  const cls = `group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium transition-[background-color,border-color,color,box-shadow] duration-200 ${styles[variant]} ${className}`;
  const inner = (
    <>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
      {arrow && <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );
  if (external) {
    const blank = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
