/**
 * YoniAreas: "אזורי שירות" – dark band, centered: heading, a large map of the north with a pin and a white
 * label chip for every town Yoni covers, a note and two CTAs.
 * Visual mirror of the #areas section in "תצוגה - הדר והירו.html".
 * Landscape on desktop so heading, map and CTAs fit one screen; sides and bottom fade into the section.
 * Map: smoothed outline of northern Israel incl. the Golan and the Metula finger (x = (lon − 34.6) × 838, y = (33.4 − lat) × 1000),
 * soft blue land gradient, the Kinneret, a yellow glow around Haifa (home base, yellow pin), fading out at the bottom.
 * Pins drop in once (50ms stagger). Hover (fine pointer) or tap a pin to light it up; Haifa by default.
 * Chips are sized to their text after the font loads. Mobile crops the sea so the labels stay readable.
 * The map is aria-hidden; a visually hidden list carries the town names.
 * Towns: the questionnaire says חיפה, הקריות, משגב and "הצפון"; the other towns spell out "הצפון" (Yoni to approve).
 *
 * Tokens and fonts: see YoniHero.tsx. GridLines: see YoniServices.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GridLines } from "./YoniServices";

const PHONE_TEL = "tel:0526223016";
const WA_LINK = "https://wa.me/972526223016?text=" + encodeURIComponent("היי יוני, הגעתי מהאתר ואשמח לפרטים על התקנת מחמם מים על גז");

const Svg = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
);

/* Magicoon Filled */
const ICONS = {
  phone:
    "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
  whatsapp:
    "m12,3C7.03,3,3,7.03,3,12c0,1.67.46,3.24,1.26,4.59l-1.26,4.41,4.41-1.26c1.35.8,2.92,1.26,4.59,1.26,4.97,0,9-4.03,9-9S16.97,3,12,3Zm4.825,12.442c-.21.585-1.212,1.129-1.662,1.179-.451.051-.872.212-2.955-.614-2.504-.998-4.086-3.578-4.206-3.739-.12-.161-1.002-1.34-1.002-2.559s.631-1.814.861-2.066c.23-.252.5-.312.661-.312.17,0,.33,0,.481.01.17,0,.371.01.551.423.22.494.691,1.713.751,1.824.06.12.1.272.02.433-.091.161-.13.272-.25.413-.12.141-.261.323-.371.433-.13.121-.25.252-.11.504.151.242.641,1.058,1.372,1.713.942.847,1.733,1.109,1.983,1.229.24.121.39.101.531-.06.15-.161.621-.715.781-.967.16-.242.321-.202.551-.121.231.081,1.432.685,1.683.806.24.131.411.191.471.292.06.101.06.605-.14,1.179Z",
  /* location-pin outline only (the hole is drawn as a dark dot) */
  pin: "M12,2.5A8.51,8.51,0,0,0,3.5,11c0,4.983,4.629,8.041,7.692,10.064l.531.352a.5.5,0,0,0,.554,0l.531-.352C15.871,19.041,20.5,15.983,20.5,11A8.51,8.51,0,0,0,12,2.5Z",
};

/* side: where the label chip sits relative to its pin (l = left, r = right, b = below); dy nudges a chip up/down to keep labels apart */
const TOWNS = [
  { key: "haifa", name: "חיפה", x: 326, y: 606, side: "b" },
  { key: "krayot", name: "הקריות", x: 402.2, y: 560, side: "l", dy: -14 },
  { key: "akko", name: "עכו", x: 405.6, y: 473, side: "l" },
  { key: "nahariya", name: "נהריה", x: 414.8, y: 394, side: "l" },
  { key: "maalot", name: "מעלות", x: 561.5, y: 384, side: "r" },
  { key: "karmiel", name: "כרמיאל", x: 583.2, y: 481, side: "r", dy: -12 },
  { key: "misgav", name: "משגב", x: 540.5, y: 538, side: "r", dy: 10 },
  { key: "shfaram", name: "שפרעם", x: 477.7, y: 594, side: "b" },
  { key: "yokneam", name: "יקנעם", x: 427.4, y: 740, side: "l" },
  { key: "nazareth", name: "נצרת", x: 586.6, y: 700, side: "r" },
  { key: "afula", name: "עפולה", x: 577.4, y: 793, side: "r" },
  { key: "safed", name: "צפת", x: 750.8, y: 435, side: "r" },
  { key: "tiberias", name: "טבריה", x: 779.3, y: 610, side: "l", dy: 14 },
  { key: "kiryatshmona", name: "קריית שמונה", x: 813.7, y: 193, side: "l" },
] as const;
const LAND = "M423.2,307C414.5,312.0 419.1,335.5 417.3,350C415.5,364.5 414.8,379.0 412.3,394C409.8,409.0 405.8,426.5 402.2,440C398.6,453.5 391.3,465.0 390.5,475C389.7,485.0 395.7,490.8 397.2,500C398.7,509.2 400.8,520.8 399.7,530C398.6,539.2 395.0,547.0 390.5,555C386.0,563.0 379.3,572.5 372.9,578C366.5,583.5 358.3,587.3 352,588C345.7,588.7 341.2,584.7 335.2,582C329.2,579.3 321.9,574.0 315.9,572C309.9,570.0 302.7,565.3 299.2,570C295.7,574.7 296.3,586.7 295,600C293.7,613.3 294.1,631.7 291.6,650C289.1,668.3 284.5,686.7 279.9,710C275.3,733.3 270.1,758.3 264,790C257.9,821.7 249.3,868.3 243,900C236.7,931.7 231.9,951.7 226.3,980C220.7,1008.3 219.3,1033.3 209.5,1070C199.7,1106.7 181.6,1153.3 167.6,1200C153.6,1246.7 132.7,1316.7 125.7,1350C118.7,1383.3 15.4,1391.7 125.7,1400C236.0,1408.3 676.0,1425.0 787.7,1400C899.4,1375.0 793.3,1300.0 796.1,1250C798.9,1200.0 802.4,1150.0 804.5,1100C806.6,1050.0 807.3,1000.0 808.7,950C810.1,900.0 808.0,835.0 812.9,800C817.8,765.0 822.6,755.0 838,740C853.4,725.0 878.5,721.7 905,710C931.5,698.3 972.1,696.7 997.2,670C1022.4,643.3 1044.7,595.0 1055.9,550C1067.1,505.0 1067.1,446.7 1064.3,400C1061.5,353.3 1048.9,311.7 1039.1,270C1029.3,228.3 1016.8,180.0 1005.6,150C994.4,120.0 988.9,101.7 972.1,90C955.3,78.3 924.5,76.7 905,80C885.5,83.3 869.4,104.2 854.8,110C840.1,115.8 826.2,103.3 817.1,115C808.0,126.7 808.0,154.2 800.3,180C792.6,205.8 787.1,250.8 771,270C754.9,289.2 729.0,289.2 703.9,295C678.8,300.8 648.0,301.2 620.1,305C592.2,308.8 561.4,315.5 536.3,318C511.2,320.5 488.1,321.8 469.3,320C450.5,318.2 431.9,302.0 423.2,307Z";
const KINNERET = "M817.1,515C827.6,511.7 845.0,520.8 854.8,530C864.6,539.2 872.9,553.3 875.7,570C878.5,586.7 877.8,611.7 871.5,630C865.2,648.3 847.4,669.2 838,680C828.6,690.8 822.4,700.0 815.4,695C808.4,690.0 802.1,665.8 796.1,650C790.1,634.2 780.0,616.7 779.3,600C778.6,583.3 785.6,564.2 791.9,550C798.2,535.8 806.6,518.3 817.1,515Z";
const PIN_S = 1.7;

const easeOut = "ease-[cubic-bezier(.22,1,.36,1)]";
const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function YoniAreas() {
  const [active, setActive] = useState("haifa");
  const [mob, setMob] = useState(false);
  const [widths, setWidths] = useState<Record<string, number>>({});
  const mapRef = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false); // hidden state only once JS runs
  const [shown, setShown] = useState(false);

  // Breakpoint + chip widths measured from the rendered text
  useEffect(() => {
    const mq = window.matchMedia("(max-width:1024px)");
    const measure = () => {
      setMob(mq.matches);
      requestAnimationFrame(() => {
        const w: Record<string, number> = {};
        mapRef.current?.querySelectorAll<SVGTextElement>("text[data-town]").forEach((t) => (w[t.dataset.town!] = t.getBBox().width));
        setWidths(w);
      });
    };
    measure();
    mq.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    return () => mq.removeEventListener("change", measure);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = armed && !shown;
  const fsz = mob ? 32 : 27;

  return (
    <section id="areas" aria-labelledby="area-title" className="relative scroll-mt-20 overflow-hidden bg-background py-[84px] text-foreground min-[1025px]:py-[8.5vw]">
      <GridLines tone="dark" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <header className="mb-8 flex flex-col items-center text-center min-[1025px]:mb-6">
          <p className="mb-2 inline-block rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">אזורי שירות</p>
          <h2 id="area-title" className="max-w-[900px] text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
            חיפה, הקריות והצפון.
          </h2>
          <p className="mt-[15px] max-w-[560px] text-pretty text-lg leading-[1.6] text-foreground/90 min-[1025px]:mt-5">
            אני מגיע אליכם הביתה או לאתר העבודה, בכל האזורים האלה.
          </p>
        </header>

        <ul className="sr-only">
          {TOWNS.map((t) => (
            <li key={t.key}>{t.name}</li>
          ))}
        </ul>

        <figure
          ref={mapRef}
          aria-hidden="true"
          className="relative mx-auto max-w-[1100px] [mask-image:linear-gradient(to_bottom,#000_70%,transparent_98%)] min-[1025px]:[mask-composite:intersect] min-[1025px]:[mask-image:linear-gradient(to_right,transparent_0%,#000_22%,#000_78%,transparent_100%),linear-gradient(to_bottom,#000_74%,transparent_100%)]"
        >
          <svg viewBox={mob ? "262 60 830 790" : "-130 62 1570 768"} className="block h-auto w-full overflow-visible">
            <defs>
              <linearGradient id="amLand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#9DB4EC" stopOpacity=".16" />
                <stop offset="1" stopColor="#9DB4EC" stopOpacity=".05" />
              </linearGradient>
              <radialGradient id="amCov">
                <stop offset="0" stopColor="#FFC20E" stopOpacity=".16" />
                <stop offset="1" stopColor="#FFC20E" stopOpacity="0" />
              </radialGradient>
              <clipPath id="amClip">
                <path d={LAND} />
              </clipPath>
            </defs>
            <path d={LAND} fill="url(#amLand)" stroke="rgba(157,180,236,.45)" strokeWidth={1.5} strokeLinejoin="round" />
            <circle cx={366} cy={566} r={260} fill="url(#amCov)" clipPath="url(#amClip)" className={cn("transition-opacity duration-[1200ms]", easeOut, hidden && "opacity-0")} />
            <path d={KINNERET} stroke="rgba(157,180,236,.45)" strokeWidth={1.5} className="fill-background" />
            <text x={170} y={470} textAnchor="middle" className="hidden fill-[rgba(157,180,236,.55)] font-main text-[26px] font-medium min-[1025px]:inline">
              הים התיכון
            </text>

            {[...TOWNS].reverse().map((t) => {
              const i = TOWNS.findIndex((x) => x.key === t.key);
              const on = t.key === active;
              const yellow = on || t.key === "haifa";
              const w = (widths[t.key] ?? t.name.length * fsz * 0.5) + fsz * 1.3;
              const h = fsz * 1.85;
              const head = t.y - 18.6 + ("dy" in t ? t.dy : 0); // centre of the pin head, nudged where labels would crowd
              const rx = t.side === "l" ? t.x - 16 - w : t.side === "r" ? t.x + 16 : t.x - w / 2;
              const ry = t.side === "b" ? t.y + 8 : head - h / 2;
              return (
                <g
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  onMouseEnter={() => fine() && setActive(t.key)}
                  style={{ transitionDelay: shown ? `${i * 50}ms` : undefined }}
                  className={cn("cursor-pointer transition-[opacity,transform] duration-[600ms]", easeOut, hidden && "-translate-y-4 opacity-0")}
                >
                  <g className={cn("transition-transform duration-200", easeOut, on && "-translate-y-1")}>
                    <path
                      d={ICONS.pin}
                      transform={`translate(${t.x - 12 * PIN_S} ${t.y - 21.95 * PIN_S}) scale(${PIN_S})`}
                      className={cn("transition-[fill] duration-200", easeOut, yellow ? "fill-primary" : "fill-brand-light")}
                    />
                    <circle cx={t.x} cy={t.y - 10.95 * PIN_S} r={4.2} className="fill-background" />
                    <rect x={rx} y={ry} width={w} height={h} rx={8} className={cn("transition-[fill] duration-200", easeOut, on ? "fill-primary" : "fill-[#FEFEFE]")} />
                    <text
                      data-town={t.key}
                      x={rx + w / 2}
                      y={ry + h / 2 + fsz * 0.36}
                      textAnchor="middle"
                      style={{ fontSize: fsz }}
                      className="fill-background font-head font-bold"
                    >
                      {t.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </figure>

        <p className="mx-auto mt-2 max-w-[460px] text-pretty text-center text-[17px] leading-[1.6] text-foreground/90 min-[1025px]:text-lg">
          לא בטוחים אם אתם באזור? תתקשרו, ואגיד לכם מיד.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 min-[1025px]:flex-row min-[1025px]:flex-wrap">
          <a
            href={PHONE_TEL}
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] transition-[background,box-shadow] duration-[350ms] hover:bg-[#F2B600]"
          >
            חייגו ליוני: <span dir="ltr">052-622-3016</span>
            <Svg d={ICONS.phone} className="h-6 w-6" />
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl border border-foreground px-7 py-3.5 text-lg font-medium text-foreground transition-colors duration-[350ms] hover:bg-foreground hover:text-background"
          >
            שלחו הודעה בוואטסאפ
            <Svg d={ICONS.whatsapp} className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
