"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

export interface DesignCard {
  href: string;
  label: string;
  src: string;
  alt: string;
}

/**
 * Tall portrait cards of the sample designs (nordpixel look). On computers a row with round arrow buttons
 * that slides sideways; on phones and tablets a plain grid, so nothing has to be swiped.
 */
export function DesignTrack({ cards, prevLabel, nextLabel }: { cards: DesignCard[]; prevLabel: string; nextLabel: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // first measurement after layout, from the browser's frame callback (not during render)
    const raf = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : 300;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={track}
        className="container-x grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:flex lg:max-w-none lg:snap-x lg:snap-mandatory lg:gap-6 lg:overflow-x-auto lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pb-4 lg:[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] lg:[scroll-padding-inline:max(2rem,calc((100vw-1240px)/2+2rem))] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
      >
        {cards.map((c) => (
          <li key={c.href} className="lg:w-[250px] lg:shrink-0 lg:snap-start xl:w-[270px]">
            <Link href={c.href} className="group block">
              <span className="relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-bg-2 shadow-[0_24px_48px_-28px_rgb(27_45_62/0.45)] ring-1 ring-line transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5 lg:aspect-[5/8] lg:rounded-[1.75rem]">
                <Image src={c.src} alt={c.alt} fill sizes="(min-width: 1280px) 270px, (min-width: 1024px) 250px, (min-width: 768px) 30vw, 45vw" className="object-cover object-top" />
              </span>
              <span className="mt-4 flex items-center justify-between gap-3">
                <span className="text-[11.5px] font-semibold uppercase leading-snug tracking-[0.2em] text-ink sm:text-[12.5px] sm:tracking-[0.24em]">{c.label}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink ring-1 ring-line transition-colors group-hover:bg-accent group-hover:text-white group-hover:ring-accent">
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Arrows only where the row slides (computers). */}
      <button
        type="button"
        onClick={() => slide(-1)}
        disabled={edge.start}
        aria-label={prevLabel}
        className="absolute left-6 top-[38%] hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_12px_30px_-12px_rgb(27_45_62/0.45)] ring-1 ring-line transition-opacity hover:text-accent disabled:pointer-events-none disabled:opacity-0 lg:grid"
      >
        <Icon name="arrow" className="h-5 w-5 rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => slide(1)}
        disabled={edge.end}
        aria-label={nextLabel}
        className="absolute right-6 top-[38%] hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_12px_30px_-12px_rgb(27_45_62/0.45)] ring-1 ring-line transition-opacity hover:text-accent disabled:pointer-events-none disabled:opacity-0 lg:grid"
      >
        <Icon name="arrow" className="h-5 w-5" />
      </button>
    </div>
  );
}
