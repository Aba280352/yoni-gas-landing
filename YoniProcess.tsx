/**
 * YoniProcess: "איך זה עובד" – ANIMTD effect scroll-pin-steps-swap, adapted to Yoni's dark band.
 * Visual mirror of the #process section in "תצוגה - הדר והירו.html".
 *
 * Desktop (≥1025): steps scroll on the right; a giant Pompei digit stays pinned on the left (sticky under the
 * 80px header) and rolls 640ms to the active step; a thin rail between them fills with gas yellow by scroll
 * progress, dots fill as it reaches them. Active step = last step whose top passed the middle of the stage.
 * Mobile (≤1024): no pinned digit; every step has its own digit, the rail runs along the right side.
 * Reduced motion: digit cross fades (150ms), the rail jumps to the active dot, no dot pop.
 * No overflow:hidden on any parent of the sticky columns (overflow-x: clip on the section).
 *
 * Tokens and fonts: see YoniHero.tsx. GridLines: see YoniServices.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GridLines } from "./YoniServices";

const PHONE_TEL = "tel:0526223016";
const HDR = 80;

/* Magicoon Filled */
const ICONS = {
  phone:
    "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
  calendar:
    "M20.7,9.75H3.3a.3.3,0,0,0-.3.3V18a2.652,2.652,0,0,0,3,3H18a2.652,2.652,0,0,0,3-3V10.05A.3.3,0,0,0,20.7,9.75Zm-5.67,4.114L11.7,17.2a.748.748,0,0,1-1.06,0L8.97,15.53a.75.75,0,0,1,1.06-1.06l1.137,1.136,2.8-2.8a.75.75,0,0,1,1.06,1.061ZM21,7.5v.45a.3.3,0,0,1-.3.3H3.3a.3.3,0,0,1-.3-.3V7.5a2.652,2.652,0,0,1,3-3H7.25V3a.75.75,0,0,1,1.5,0V4.5h6.5V3a.75.75,0,0,1,1.5,0V4.5H18A2.652,2.652,0,0,1,21,7.5Z",
  tool:
    "M20.58,6.56,18.4,8.74a1.506,1.506,0,0,1-2.11-.01L15.27,7.71a1.485,1.485,0,0,1,0-2.1l2.17-2.19a5.807,5.807,0,0,0-5.21.44,5.146,5.146,0,0,0-1.76,1.71.567.567,0,0,0-.08.13,5.765,5.765,0,0,0-.81,3.86,1.428,1.428,0,0,1-.42,1.24L3.84,16.13a2.85,2.85,0,0,0,4.03,4.03l5.33-5.32a1.428,1.428,0,0,1,1.24-.42,5.775,5.775,0,0,0,3.85-.8,5.23,5.23,0,0,0,1.84-1.84A5.8,5.8,0,0,0,20.58,6.56ZM6.02,19a1,1,0,0,1-.01-2h.01a1,1,0,0,1,0,2Z",
};

const Svg = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
);

const STEPS = [
  { icon: ICONS.phone, title: "שיחה עם יוני", text: "מתקשרים, מספרים מה צריך ומקבלים הסבר ישיר." },
  { icon: ICONS.calendar, title: "קביעת עבודה", text: "מתאמים מועד להגעה ולביצוע העבודה." },
  { icon: ICONS.tool, title: "ביצוע ותשלום", text: "יוני מבצע את העבודה לפי התקן, והתשלום בסיום." },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeIO = "ease-[cubic-bezier(.65,0,.35,1)]";
const easeOut = "ease-[cubic-bezier(.22,1,.36,1)]";

export default function YoniProcess() {
  const n = STEPS.length;
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mnumRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [shown, setShown] = useState(0); // digit actually displayed (lags `active` during the reduced-motion fade)
  const [fading, setFading] = useState(false);
  const [rail, setRail] = useState<{ top: number; bottom: number; dots: number[] } | null>(null); // mobile geometry

  useEffect(() => {
    const mobile = window.matchMedia("(max-width:1024px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);
    let raf = 0;

    const layout = () => {
      const railEl = railRef.current;
      if (!mobile.matches || !railEl) return setRail(null);
      const rTop = railEl.getBoundingClientRect().top;
      const ys = mnumRefs.current.map((m) => (m ? m.getBoundingClientRect().top - rTop + m.offsetHeight / 2 : 0));
      setRail({ top: ys[0], bottom: railEl.offsetHeight - ys[n - 1], dots: ys.map((y) => y - ys[0]) });
    };

    const update = () => {
      raf = 0;
      const mob = mobile.matches;
      const mid = mob ? innerHeight / 2 : (HDR + innerHeight) / 2;
      let a = 0;
      bodyRefs.current.forEach((b, i) => {
        if (b && b.getBoundingClientRect().top <= mid) a = i;
      });
      setActive(a);
      let p = 0;
      if (mob && trackRef.current) {
        const t = trackRef.current.getBoundingClientRect();
        p = clamp((mid - t.top) / t.height);
      } else if (pinRef.current) {
        const r = pinRef.current.getBoundingClientRect();
        p = clamp((HDR - r.top) / (r.height - (innerHeight - HDR)));
      }
      setProgress(rm ? (n > 1 ? a / (n - 1) : 1) : p);
    };

    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const relayout = () => {
      layout();
      update();
    };
    relayout();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", relayout);
    mobile.addEventListener("change", relayout);
    document.fonts?.ready.then(relayout);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", relayout);
      mobile.removeEventListener("change", relayout);
    };
  }, [n]);

  // Digit: roll (640ms) or, under reduced motion, a 150ms cross fade
  useEffect(() => {
    if (!reduce) return setShown(active);
    setFading(true);
    const t = setTimeout(() => {
      setShown(active);
      setFading(false);
    }, 150);
    return () => clearTimeout(t);
  }, [active, reduce]);

  return (
    <section
      id="process"
      aria-labelledby="how-title"
      className="relative scroll-mt-20 overflow-x-clip bg-background py-[84px] text-foreground min-[1025px]:py-[8.5vw]"
    >
      <GridLines tone="dark" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <header className="mb-10 min-[1025px]:mb-16 min-[1025px]:flex min-[1025px]:flex-col min-[1025px]:items-center min-[1025px]:text-center">
          <p className="mb-2 inline-block rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">איך זה עובד</p>
          <h2 id="how-title" className="max-w-[900px] text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
            שלושה שלבים פשוטים.
          </h2>
          <p className="mt-[15px] text-pretty text-lg leading-[1.6] text-foreground/90 min-[1025px]:mt-5 min-[1025px]:max-w-[560px]">
            מהשיחה הראשונה ועד שהעבודה גמורה, אתם מדברים עם יוני.
          </p>
        </header>

        <div
          ref={pinRef}
          className="grid grid-cols-[2px_16px_minmax(0,1fr)] [--stage:calc(100vh-80px)] min-[1025px]:grid-cols-[minmax(0,1fr)_clamp(32px,5vw,72px)_2px_clamp(32px,5vw,72px)_minmax(0,1fr)]"
        >
          <ol className="col-start-3 row-start-1 list-none min-[1025px]:col-start-1">
            {STEPS.map((s, i) => (
              <li key={s.title} className="pb-24 last:pb-0 min-[1025px]:flex min-[1025px]:min-h-[var(--stage)] min-[1025px]:items-center min-[1025px]:pb-0">
                <div
                  ref={(el) => { bodyRefs.current[i] = el; }}
                  className={cn(
                    "transition-opacity print:opacity-100 forced-colors:opacity-100",
                    reduce ? "duration-150" : cn("duration-[400ms]", easeOut),
                    i === active ? "opacity-100" : "opacity-[.28]",
                  )}
                >
                  <span
                    ref={(el) => { mnumRefs.current[i] = el; }}
                    dir="ltr"
                    aria-hidden="true"
                    className="mb-3 block text-right font-head text-[96px] font-medium leading-[.9] [unicode-bidi:isolate] min-[1025px]:hidden"
                  >
                    {i + 1}
                  </span>
                  <Svg d={s.icon} className="h-7 w-7 text-primary min-[1025px]:h-8 min-[1025px]:w-8" />
                  <h3 className="mt-4 text-balance font-head text-[28px] font-bold leading-[1.1] min-[1025px]:text-[clamp(34px,3.4vw,48px)]">{s.title}</h3>
                  <p className="mt-3 max-w-[440px] text-pretty text-[17px] leading-normal text-foreground/90 min-[1025px]:text-xl">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Rail: sticky on desktop, along the steps on mobile */}
          <div
            ref={railRef}
            aria-hidden="true"
            className="relative col-start-1 row-start-1 self-stretch min-[1025px]:sticky min-[1025px]:top-20 min-[1025px]:col-start-3 min-[1025px]:h-[var(--stage)] min-[1025px]:self-start"
          >
            <span
              ref={trackRef}
              className="absolute inset-x-0 bg-foreground/[.14] min-[1025px]:inset-y-[16.7%]"
              style={rail ? { top: rail.top, bottom: rail.bottom } : undefined}
            >
              <span
                className={cn(
                  "absolute inset-0 origin-top bg-primary shadow-[0_0_14px_rgba(255,194,14,.55)]",
                  !reduce && cn("transition-transform duration-[400ms]", easeOut),
                )}
                style={{ transform: `scaleY(${progress})` }}
              />
              {STEPS.map((s, k) => {
                const on = progress >= (n > 1 ? k / (n - 1) : 0) - 0.001;
                return (
                  <i
                    key={s.title}
                    className={cn(
                      "absolute left-1/2 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full border-2 border-primary transition-colors duration-[260ms]",
                      on ? "bg-primary" : "bg-background",
                      on && !reduce && "animate-[pinpop_.26s_cubic-bezier(.34,1.56,.64,1)]",
                    )}
                    style={{ top: rail ? rail.dots[k] : `${n > 1 ? (k / (n - 1)) * 100 : 0}%` }}
                  />
                );
              })}
            </span>
          </div>

          {/* Pinned digit (desktop only) */}
          <div
            aria-hidden="true"
            className="hidden min-[1025px]:sticky min-[1025px]:top-20 min-[1025px]:col-start-5 min-[1025px]:row-start-1 min-[1025px]:flex min-[1025px]:h-[var(--stage)] min-[1025px]:flex-col min-[1025px]:items-center min-[1025px]:justify-center min-[1025px]:self-start"
          >
            <div dir="ltr" className="h-[calc(var(--d)*.9)] w-full overflow-hidden [--d:min(calc(var(--stage)*.58),34vw,520px)] [unicode-bidi:isolate]">
              <div
                className={cn(
                  reduce ? "transition-opacity duration-150" : cn("transition-transform duration-[640ms]", easeIO),
                  fading ? "opacity-0" : "opacity-100",
                )}
                style={{ transform: `translateY(${(-(reduce ? shown : active) * 100) / n}%)` }}
              >
                {STEPS.map((s, i) => (
                  <span key={s.title} className="flex h-[calc(var(--d)*.9)] items-center justify-center font-head text-[length:var(--d)] font-medium leading-[.9]">
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[15px] text-foreground/60">
              מתוך <span dir="ltr" className="[unicode-bidi:isolate]">{n}</span>
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center min-[1025px]:mt-14">
          <a
            href={PHONE_TEL}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] transition-[background,box-shadow] duration-[350ms] hover:bg-[#F2B600] min-[1025px]:w-auto"
          >
            חייגו ליוני: <span dir="ltr">052-622-3016</span>
            <Svg d={ICONS.phone} className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* Add to the global CSS (index.css) next to the font faces:
   @keyframes pinpop { 50% { transform: scale(1.3); } }
*/
