"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll video of a sample design, laid over the still image of its frame (the image stays as poster
 * and fallback). Nothing loads until the frame is on screen, it pauses off screen, and it stays a still
 * image with reduced motion, Save-Data or when the browser blocks autoplay (e.g. iPhone power saving).
 */
export function SampleVideo({ sources }: { sources: { src: string; type: string }[] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true; // set as property too: muted autoplay is what browsers allow without a tap
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
