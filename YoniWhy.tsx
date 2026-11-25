/**
 * YoniWhy: "למה יוני" – dark band with Yoni's line, his portrait and 4 trust cards.
 * Visual mirror of the #why section in "תצוגה - הדר והירו.html".
 * Cards reveal once (staggered 70ms) when they enter the viewport; visible without JS and under reduced motion.
 *
 * Assets (/public): yoni-pro.jpg (ChatGPT edit of Yoni's real portrait, face kept; Yoni to approve before launch)
 * Tokens and fonts: see YoniHero.tsx. GridLines: see YoniServices.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GridLines } from "./YoniServices";

const PHONE_TEL = "tel:0526223016";

type IconProps = { className?: string };
const Svg = ({ d, className }: { d: string } & IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
);

/* Magicoon Filled */
const ICONS = {
  phone:
    "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
  certificate:
    "M12.68,15.4a2.946,2.946,0,0,1-.01-4.12,2.995,2.995,0,0,1,2.94-2.94,2.934,2.934,0,0,1,4.11,0A.16.16,0,0,0,20,8.231V6a2.652,2.652,0,0,0-3-3H5A2.652,2.652,0,0,0,2,6v8a2.652,2.652,0,0,0,3,3h7.672a.294.294,0,0,0,.275-.411A2.813,2.813,0,0,1,12.68,15.4ZM6,7.25h6a.75.75,0,0,1,0,1.5H6a.75.75,0,0,1,0-1.5Zm3,5.5H6a.75.75,0,0,1,0-1.5H9a.75.75,0,0,1,0,1.5Zm12.576-.437a1.02,1.02,0,0,1-.424-1.023A1.5,1.5,0,0,0,19.41,9.847a1,1,0,0,1-.723-.424,1.444,1.444,0,0,0-2.042,0,.993.993,0,0,1-.723.424,1.523,1.523,0,0,0-1.743,1.742,1,1,0,0,1-.424.724,1.444,1.444,0,0,0,0,2.041,1.015,1.015,0,0,1,.424,1.022,1.44,1.44,0,0,0,1.348,1.434h0v0L14.333,21l1.847-.74a4.019,4.019,0,0,1,2.973,0L21,21l-1.194-4.19a1.439,1.439,0,0,0,1.346-1.434.992.992,0,0,1,.212-.809A1.5,1.5,0,0,0,21.576,12.313ZM17.667,15a1.667,1.667,0,1,1,1.666-1.667A1.667,1.667,0,0,1,17.667,15Z",
  calendar:
    "M20.7,9.75H3.3a.3.3,0,0,0-.3.3V18a2.652,2.652,0,0,0,3,3H18a2.652,2.652,0,0,0,3-3V10.05A.3.3,0,0,0,20.7,9.75Zm-5.67,4.114L11.7,17.2a.748.748,0,0,1-1.06,0L8.97,15.53a.75.75,0,0,1,1.06-1.06l1.137,1.136,2.8-2.8a.75.75,0,0,1,1.06,1.061ZM21,7.5v.45a.3.3,0,0,1-.3.3H3.3a.3.3,0,0,1-.3-.3V7.5a2.652,2.652,0,0,1,3-3H7.25V3a.75.75,0,0,1,1.5,0V4.5h6.5V3a.75.75,0,0,1,1.5,0V4.5H18A2.652,2.652,0,0,1,21,7.5Z",
  shield:
    "M12.018,2A29.748,29.748,0,0,1,3,5v5.889c0,6.667,5.667,10,9,11.111,3.333-1.111,9-4.444,9-11.111V5A29.069,29.069,0,0,1,12.018,2Zm3.524,8.53-4,4a.75.75,0,0,1-1.061,0l-2-2a.75.75,0,0,1,1.061-1.06l1.47,1.469L14.481,9.47a.75.75,0,0,1,1.061,1.06Z",
  user:
    "M6.009,6.5a4,4,0,1,1,4,4A4,4,0,0,1,6.009,6.5ZM12.6,18.05a4.527,4.527,0,0,1,.8-3.76,3.358,3.358,0,0,1,.99-.81.839.839,0,0,0,.11-.07.272.272,0,0,0,.09-.21.332.332,0,0,0-.23-.29A6.39,6.39,0,0,0,12,12.5H8c-4.06,0-5.5,2.97-5.5,5.52C2.5,20.3,3.710,21.5,6,21.5h7.96a.3.3,0,0,0,.3-.3.312.312,0,0,0-.09-.21A6.123,6.123,0,0,1,12.6,18.05Zm7.172-3.55A1.959,1.959,0,0,0,18,15.806,1.957,1.957,0,0,0,16.236,14.5c-1.778.008-2.477,1.64-2.157,3.262C14.6,20.406,18,21.929,18,21.929s3.4-1.523,3.925-4.167C22.249,16.14,21.553,14.508,19.772,14.5Z",
};

const CARDS = [
  { icon: ICONS.certificate, title: "רישיון משרד האנרגיה", text: 'טכנאי גז מוסמך, מתקין גפ"מ רמה 1.' },
  { icon: ICONS.calendar, title: "5 שנות ניסיון", text: "התקנות גז בבתים ובפרויקטים, בחיפה, בקריות ובצפון." },
  { icon: ICONS.shield, title: "אחריות על העבודה", text: "עבודה לפי התקן, עם אחריות על ההתקנה." },
  { icon: ICONS.user, title: "יחס אישי", text: "מדברים ישירות איתי, מהשיחה הראשונה ועד סוף העבודה." },
];

const easeOut = "ease-[cubic-bezier(.22,1,.36,1)]";

export default function YoniWhy() {
  const listRef = useRef<HTMLUListElement>(null);
  const [armed, setArmed] = useState(false); // hidden state only once JS runs
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = listRef.current;
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

  return (
    <section id="why" aria-labelledby="why-title" className="relative scroll-mt-20 overflow-hidden bg-background py-[84px] text-foreground min-[1025px]:py-[8.5vw]">
      <GridLines tone="dark" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <div className="min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:items-center min-[1025px]:gap-x-[15px]">
          <div className="col-span-7">
            <p className="mb-2 inline-block rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">למה יוני</p>
            <h2 id="why-title" className="text-balance font-head text-4xl font-bold leading-[1.02] min-[1025px]:text-[72px]">
              אני תמיד עומד <span className="block text-brand-light">מאחורי העבודה שלי.</span>
            </h2>
            <p className="mt-5 max-w-[560px] text-pretty text-lg leading-[1.6] text-foreground/90">
              כשמדובר בגז, אין מקום לקיצורי דרך. כל התקנה נעשית לפי התקן, עם רישיון של משרד האנרגיה ו-5 שנות ניסיון.
            </p>
            <a
              href={PHONE_TEL}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] transition-[background,box-shadow] duration-[350ms] hover:bg-[#F2B600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground min-[1025px]:w-auto"
            >
              לשיחה עם יוני
              <Svg d={ICONS.phone} className="h-6 w-6" />
            </a>
          </div>

          <figure className="relative col-start-9 col-end-13 mt-10 aspect-[4/5] overflow-hidden rounded-xl bg-[#16203a] min-[1025px]:mt-0">
            <img src="/yoni-pro.jpg" alt="יוני גל, טכנאי גז מוסמך" width={800} height={1000} loading="lazy" className="h-full w-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-[linear-gradient(0deg,rgba(14,22,36,.92)_0%,rgba(14,22,36,0)_100%)] p-6">
              <b className="font-head text-[26px] font-bold leading-[1.1]">יוני גל</b>
              <span className="text-base text-foreground/90">טכנאי גז מוסמך</span>
            </figcaption>
          </figure>
        </div>

        <ul ref={listRef} className="mt-10 grid gap-3 min-[1025px]:mt-16 min-[1025px]:grid-cols-4 min-[1025px]:gap-[15px]">
          {CARDS.map((c, i) => (
            <li
              key={c.title}
              style={{ transitionDelay: shown ? `${i * 70}ms, ${i * 70}ms, 0ms` : undefined }}
              className={cn(
                "rounded-xl bg-foreground/5 px-5 py-6 min-[1025px]:p-7",
                "transition-[opacity,transform,background-color] duration-700 motion-reduce:transition-none",
                "[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.08]",
                easeOut,
                armed && !shown && "translate-y-4 opacity-0",
              )}
            >
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-brand-light/[.14] text-brand-light">
                <Svg d={c.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-head text-2xl font-bold leading-[1.1]">{c.title}</h3>
              <p className="mt-2.5 text-pretty text-lg leading-normal text-foreground/90">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
