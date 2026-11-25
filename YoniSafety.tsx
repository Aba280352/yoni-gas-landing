/**
 * YoniSafety: "בטיחות ואחריות" – light band: 3 safety checks (right) + a blue warranty card (left).
 * Visual mirror of the #safety section in "תצוגה - הדר והירו.html".
 * Rows and card reveal once (staggered 70ms) when they enter the viewport; visible without JS and under reduced motion.
 * Copy is a draft built from the package scope (leak check, function check, standard, warranty): Yoni to approve.
 *
 * Tokens and fonts: see YoniHero.tsx. GridLines: see YoniServices.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GridLines } from "./YoniServices";

const PHONE_TEL = "tel:0526223016";

const Svg = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
);

/* Magicoon Filled */
const ICONS = {
  search: "M21.53,20.47,17.161,16.1a7.991,7.991,0,1,0-1.059,1.06L20.47,21.53a.748.748,0,0,0,1.06,0A.754.754,0,0,0,21.53,20.47Z",
  clipboard:
    "M8,5.5v-1A1.326,1.326,0,0,1,9.5,3h5A1.326,1.326,0,0,1,16,4.5v1A1.326,1.326,0,0,1,14.5,7h-5A1.326,1.326,0,0,1,8,5.5ZM20,8V18a2.652,2.652,0,0,1-3,3H7a2.652,2.652,0,0,1-3-3V8c0-1.742.752-2.723,2.265-2.943a.211.211,0,0,1,.235.2V5.5a2.814,2.814,0,0,0,3,3h5a2.814,2.814,0,0,0,3-3V5.262a.211.211,0,0,1,.235-.2C19.248,5.277,20,6.258,20,8Zm-4.97,3.136a.751.751,0,0,0-1.06,0l-2.8,2.8L10.03,12.8a.75.75,0,1,0-1.06,1.061l1.667,1.666a.748.748,0,0,0,1.06,0L15.03,12.2A.75.75,0,0,0,15.03,11.136Z",
  award:
    "M17.5,21l-2.77-1.11a6.03,6.03,0,0,0-4.46,0L7.5,21l1.37-4.82c.12.02.23.03.35.04.07,0,.14.01.22.01h.27l.2.2a3.67,3.67,0,0,0,5.18,0l.2-.2h.27c.08,0,.15-.01.22-.01.12-.01.23-.02.35-.04Zm.866-9.969-.319.319a1.085,1.085,0,0,0-.318.766v.448A2.16,2.16,0,0,1,15.66,14.72c-.033,0-.063.01-.1.01h-.448a1.084,1.084,0,0,0-.766.317l-.319.319a2.166,2.166,0,0,1-3.062,0l-.319-.319a1.084,1.084,0,0,0-.766-.317H9.436c-.033,0-.063-.009-.1-.01a2.16,2.16,0,0,1-2.069-2.156v-.448a1.085,1.085,0,0,0-.318-.766l-.319-.319a2.166,2.166,0,0,1,0-3.062l.319-.319a1.085,1.085,0,0,0,.318-.766V6.436A2.165,2.165,0,0,1,9.436,4.27h.448a1.084,1.084,0,0,0,.766-.317l.319-.319a2.166,2.166,0,0,1,3.062,0l.319.319a1.084,1.084,0,0,0,.766.317h.448a2.165,2.165,0,0,1,2.165,2.166v.448a1.085,1.085,0,0,0,.318.766l.319.319A2.166,2.166,0,0,1,18.366,11.031Zm-3.336-3.4a.749.749,0,0,0-1.06,0L11.833,9.773l-.8-.8a.75.75,0,0,0-1.06,1.06L11.3,11.364a.751.751,0,0,0,1.06,0L15.03,8.7A.75.75,0,0,0,15.03,7.636Z",
  shield:
    "M12.018,2A29.748,29.748,0,0,1,3,5v5.889c0,6.667,5.667,10,9,11.111,3.333-1.111,9-4.444,9-11.111V5A29.069,29.069,0,0,1,12.018,2Zm3.524,8.53-4,4a.75.75,0,0,1-1.061,0l-2-2a.75.75,0,0,1,1.061-1.06l1.47,1.469L14.481,9.47a.75.75,0,0,1,1.061,1.06Z",
  phone:
    "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
};

const CHECKS = [
  { icon: ICONS.search, title: "בדיקת אטימות", text: "כל חיבור נבדק לדליפות לפני שפותחים את הגז." },
  { icon: ICONS.clipboard, title: "בדיקת תקינות", text: "בסיום בודקים שהמחמם והתשתית עובדים כמו שצריך." },
  { icon: ICONS.award, title: "עבודה לפי התקן", text: "התקנה לפי דרישות התקן, על ידי טכנאי גז מוסמך מטעם משרד האנרגיה." },
];

const reveal = "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

export default function YoniSafety() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false); // hidden state only once JS runs
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = armed && !shown && "translate-y-4 opacity-0";
  const delay = (i: number) => (shown ? { transitionDelay: `${i * 70}ms` } : undefined);

  return (
    <section id="safety" aria-labelledby="safe-title" className="relative scroll-mt-20 bg-[#FEFEFE] py-[84px] text-background min-[1025px]:py-[8.5vw]">
      <GridLines tone="light" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <header className="mb-10 min-[1025px]:mb-16 min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:items-end min-[1025px]:gap-x-[15px]">
          <p className="col-span-12 mb-2 inline-block justify-self-start rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">בטיחות ואחריות</p>
          <h2 id="safe-title" className="col-span-6 text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
            בגז, בטיחות קודם כל.
          </h2>
          <p className="col-start-7 col-end-13 mt-[15px] text-pretty text-lg leading-[1.6] min-[1025px]:mt-0 min-[1025px]:max-w-[460px] min-[1025px]:ps-6">
            בכל התקנה, גדולה או קטנה, אני עובר על אותן בדיקות לפני שאני מסיים את העבודה.
          </p>
        </header>

        <div ref={gridRef} className="min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:gap-[15px]">
          <ul className="grid list-none gap-[15px] min-[1025px]:col-span-7">
            {CHECKS.map((c, i) => (
              <li
                key={c.title}
                style={delay(i)}
                className={cn(
                  "grid grid-cols-[48px_1fr] items-start gap-x-4 rounded-xl bg-[#F1F4F9] px-5 py-6 min-[1025px]:grid-cols-[56px_1fr] min-[1025px]:gap-x-6 min-[1025px]:p-8",
                  reveal,
                  hidden,
                )}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-foreground min-[1025px]:h-14 min-[1025px]:w-14">
                  <Svg d={c.icon} className="h-[26px] w-[26px]" />
                </span>
                <div>
                  <h3 className="pt-1.5 font-head text-2xl font-bold leading-[1.1] min-[1025px]:pt-1 min-[1025px]:text-[30px]">{c.title}</h3>
                  <p className="mt-2 text-pretty text-[17px] leading-[1.55] min-[1025px]:text-lg">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div
            style={delay(CHECKS.length)}
            className={cn(
              "mt-[15px] flex flex-col items-start rounded-xl bg-brand px-6 py-8 text-foreground min-[1025px]:col-span-5 min-[1025px]:mt-0 min-[1025px]:px-10 min-[1025px]:py-12",
              reveal,
              hidden,
            )}
          >
            <Svg d={ICONS.shield} className="mb-auto h-[72px] w-[72px] text-brand-light" />
            <h3 className="mt-7 text-balance font-head text-4xl font-bold leading-none min-[1025px]:mt-10 min-[1025px]:text-[56px]">אחריות על העבודה.</h3>
            <p className="mt-4 max-w-[420px] text-pretty text-[17px] leading-[1.55] text-foreground/90 min-[1025px]:text-[19px]">
              כל התקנה מגיעה עם אחריות. ואם עולה שאלה גם אחרי, מתקשרים ישר אליי.
            </p>
            <a
              href={PHONE_TEL}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] transition-[background,box-shadow] duration-[350ms] hover:bg-[#F2B600] min-[1025px]:w-auto"
            >
              לשיחה עם יוני
              <Svg d={ICONS.phone} className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
