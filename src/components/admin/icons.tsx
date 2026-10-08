import type { SVGProps } from "react";

/** Admin-only icon set (independent of the public site icons). 24px grid, stroke icons. */
const paths: Record<string, React.ReactNode> = {
  home: (<><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></>),
  inbox: (<><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z" /></>),
  kanban: (<><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  file: (<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>),
  receipt: (<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" /><path d="M9 8h6M9 12h6" /></>),
  calc: (<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4" /></>),
  folder: (<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></>),
  check: (<><path d="m5 12 5 5L20 7" /></>),
  checkSquare: (<><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m8 12 3 3 5-6" /></>),
  square: (<><rect x="3.5" y="3.5" width="17" height="17" rx="3" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  repeat: (<><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>),
  wallet: (<><path d="M3 7a2 2 0 0 1 2-2h13v4" /><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z" /><path d="M16 14h.01" /></>),
  chart: (<><path d="M3 3v18h18" /><path d="M7 15v3M12 10v8M17 6v12" /></>),
  tag: (<><path d="M20 12 12 20l-9-9V3h8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>),
  layers: (<><path d="m12 3 9 5-9 5-9-5Z" /><path d="m3 13 9 5 9-5" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  plus: (<><path d="M12 5v14M5 12h14" /></>),
  menu: (<><path d="M4 7h16M4 12h16M4 17h16" /></>),
  close: (<><path d="M6 6l12 12M18 6 6 18" /></>),
  trash: (<><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></>),
  send: (<><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" /></>),
  download: (<><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>),
  copy: (<><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>),
  edit: (<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>),
  link: (<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>),
  external: (<><path d="M14 4h6v6M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>),
  phone: (<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  chat: (<><path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12Z" /></>),
  note: (<><path d="M5 3h10l4 4v14H5Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>),
  bell: (<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 21a2 2 0 0 0 4 0" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  star: (<><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></>),
  flag: (<><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></>),
  arrowLeft: (<><path d="M19 12H5M11 18l-6-6 6-6" /></>),
  arrowRight: (<><path d="M5 12h14M13 6l6 6-6 6" /></>),
  up: (<><path d="m6 15 6-6 6 6" /></>),
  down: (<><path d="m6 9 6 6 6-6" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>),
  logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>),
  pause: (<><path d="M9 5v14M15 5v14" /></>),
  play: (<><path d="m7 4 13 8-13 8Z" /></>),
  stop: (<><rect x="5" y="5" width="14" height="14" rx="2" /></>),
  alert: (<><path d="M12 3 2 20h20Z" /><path d="M12 10v4M12 17h.01" /></>),
  list: (<><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></>),
  box: (<><path d="m12 3 9 4.5v9L12 21l-9-4.5v-9Z" /><path d="m3 7.5 9 4.5 9-4.5M12 12v9" /></>),
};

export function Icon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20" {...props}>
      {paths[name] ?? paths.box}
    </svg>
  );
}
