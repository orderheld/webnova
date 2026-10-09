import { site } from "@/lib/site";
import { Icon } from "./icons";

/** Round icon links to the social profiles in site.social: under the contact lists and in the footer. */
export function SocialIcons({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  if (site.social.length === 0) return null;
  return (
    <div className={`flex gap-3 ${className}`}>
      {site.social.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.name}
          className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
            dark ? "border-white/20 text-white/85 hover:border-white/50 hover:text-white" : "border-line bg-white text-accent hover:border-accent hover:text-bright"
          }`}
        >
          <Icon name={s.icon} className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
