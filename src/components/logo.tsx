import Image from "next/image";

/**
 * The Webnova logo (lime mark + wordmark), vectorised from the original logo file.
 * tone "light" = white wordmark for dark backgrounds, "dark" = black wordmark for light backgrounds.
 */
export function Logo({ tone = "light", className = "h-8", priority = false }: { tone?: "light" | "dark"; className?: string; priority?: boolean }) {
  return (
    <Image
      src={tone === "light" ? "/logo-light.svg" : "/logo-dark.svg"}
      alt="Webnova"
      width={2964}
      height={551}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}
