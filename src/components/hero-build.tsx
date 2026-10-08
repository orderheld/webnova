import type { Locale } from "@/content/types";

const t = {
  de: { button: "Projekt anfragen", toast: "Neue Anfrage", toastSub: "gerade eben", url: "ihre-firma.ch" },
  fr: { button: "Demander un devis", toast: "Nouvelle demande", toastSub: "à l'instant", url: "votre-entreprise.ch" },
};

/**
 * Home hero intro: a website wireframe that builds itself (layout guides draw in, blocks and
 * text fill in, the cursor clicks the request button and a new enquiry arrives). Pure SVG + CSS,
 * plays once in about 2.5 s, decorative only. With reduced motion it shows the end state.
 */
export function HeroBuild({ locale }: { locale: Locale }) {
  const c = t[locale];
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
  return (
    <div className="wf overflow-hidden rounded-2xl border border-line bg-white shadow-lift" aria-hidden="true">
      <svg viewBox="0 0 480 300" className="block h-auto w-full" fontFamily="var(--font-inter), ui-sans-serif, system-ui, sans-serif">
        {/* browser chrome */}
        <rect width="480" height="30" fill="#f3f6f9" />
        <line x1="0" y1="30" x2="480" y2="30" stroke="#e3e8ee" />
        <circle cx="16" cy="15" r="3.5" fill="#d5dde6" />
        <circle cx="28" cy="15" r="3.5" fill="#d5dde6" />
        <circle cx="40" cy="15" r="3.5" fill="#d5dde6" />
        <rect x="150" y="8" width="180" height="14" rx="7" fill="#ffffff" stroke="#e3e8ee" />
        <text x="240" y="18.5" textAnchor="middle" fontSize="8.5" fill="#646b73">{c.url}</text>

        {/* layout guides draw in */}
        <g stroke="#3b6385" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 4">
          {[24, 168, 312, 456].map((x, i) => (
            <line key={x} className="wf-v" style={d(i * 70)} x1={x} y1="30" x2={x} y2="300" />
          ))}
          <line className="wf-h" style={d(150)} x1="0" y1="62" x2="480" y2="62" />
          <line className="wf-h" style={d(250)} x1="0" y1="200" x2="480" y2="200" />
        </g>

        {/* nav */}
        <g className="wf-fade" style={d(350)}>
          <rect x="24" y="40" width="14" height="12" rx="3" fill="#24405a" />
          <rect x="42" y="43" width="34" height="6" rx="3" fill="#24405a" />
          <rect x="262" y="43" width="26" height="6" rx="3" fill="#d5dde6" />
          <rect x="296" y="43" width="26" height="6" rx="3" fill="#d5dde6" />
          <rect x="330" y="43" width="26" height="6" rx="3" fill="#d5dde6" />
          <rect x="398" y="38" width="58" height="16" rx="8" fill="#24405a" />
        </g>

        {/* hero copy */}
        <rect className="wf-grow" style={d(550)} x="24" y="80" width="196" height="15" rx="4" fill="#1c232b" />
        <rect className="wf-grow" style={d(700)} x="24" y="101" width="148" height="15" rx="4" fill="#3b6385" />
        <rect className="wf-grow" style={d(900)} x="24" y="128" width="190" height="6" rx="3" fill="#d5dde6" />
        <rect className="wf-grow" style={d(960)} x="24" y="140" width="172" height="6" rx="3" fill="#d5dde6" />
        <rect className="wf-grow" style={d(1020)} x="24" y="152" width="120" height="6" rx="3" fill="#d5dde6" />

        {/* request button */}
        <g className="wf-pop" style={d(1250)}>
          <rect x="24" y="168" width="112" height="24" rx="12" fill="#24405a" />
          <text x="80" y="183.5" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#ffffff">
            {c.button}
          </text>
        </g>
        <circle className="wf-ripple" style={d(2050)} cx="118" cy="181" r="10" fill="none" stroke="#3b6385" strokeWidth="2" />

        {/* image block */}
        <g className="wf-fade" style={d(1000)}>
          <rect x="248" y="74" width="208" height="118" rx="10" fill="#e8f0f9" />
          <circle cx="420" cy="102" r="11" fill="#b4c6d6" />
          <path d="M248 172 l52 -46 l38 32 l26 -20 l92 74 v-6 a10 10 0 0 1 -10 10 h-188 a10 10 0 0 1 -10 -10 z" fill="#3b6385" fillOpacity="0.22" />
          <path d="M248 182 l70 -40 l60 34 l78 -28 v34 a10 10 0 0 1 -10 10 h-188 a10 10 0 0 1 -10 -10 z" fill="#24405a" fillOpacity="0.35" />
        </g>

        {/* cards */}
        {[24, 168, 312].map((x, i) => (
          <g key={x} className="wf-fade" style={d(1350 + i * 110)}>
            <rect x={x} y="212" width="136" height="76" rx="9" fill="#ffffff" stroke="#e3e8ee" />
            <rect x={x + 12} y="224" width="20" height="20" rx="6" fill="#e8f0f9" />
            <rect x={x + 12} y="252" width="84" height="6" rx="3" fill="#1c232b" fillOpacity="0.75" />
            <rect x={x + 12} y="264" width="104" height="5" rx="2.5" fill="#d5dde6" />
            <rect x={x + 12} y="274" width="70" height="5" rx="2.5" fill="#d5dde6" />
          </g>
        ))}

        {/* cursor glides to the button and clicks */}
        <g className="wf-cursor" style={d(1500)}>
          <g className="wf-click" style={d(2000)}>
            <path d="M118 181 l0 19 l5 -4.5 l3.6 8 l3.4 -1.5 l-3.6 -7.8 l6.8 -0.4 z" fill="#1c232b" stroke="#ffffff" strokeWidth="1.4" strokeLinejoin="round" />
          </g>
        </g>

        {/* the enquiry arrives */}
        <g className="wf-toast" style={d(2250)}>
          <rect x="300" y="148" width="160" height="44" rx="11" fill="#ffffff" stroke="#e3e8ee" />
          <circle cx="322" cy="170" r="10" fill="#3b6385" />
          <path d="m317.5 170 3 3 6 -6" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="340" y="167" fontSize="10.5" fontWeight="600" fill="#1c232b">{c.toast}</text>
          <text x="340" y="180" fontSize="8.5" fill="#646b73">{c.toastSub}</text>
        </g>
      </svg>
    </div>
  );
}
