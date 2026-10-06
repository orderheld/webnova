import Image from "next/image";

/**
 * The Webnova logo (lime mark + wordmark), vectorised from the original logo file.
 * tone "light" = white wordmark for dark backgrounds, "dark" = black wordmark for light backgrounds.
 */
export function Logo({ tone = "light", className = "h-8" }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <Image
      src={tone === "light" ? "/logo-light.svg" : "/logo-dark.svg"}
      alt="Webnova"
      width={2964}
      height={551}
      priority
      className={`w-auto ${className}`}
    />
  );
}
