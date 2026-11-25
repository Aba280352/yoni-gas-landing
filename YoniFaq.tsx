/**
 * YoniFaq: "שאלות נפוצות" – light band. One side: tag, heading, short intro and phone + WhatsApp CTAs (sticky on desktop).
 * Other side: an accordion of questions that answer the usual objections (price, gas vs electric, safety, warranty,
 * Rinnai, contractors, areas, payment). One answer open at a time; the first is open by default.
 * Visual mirror of the #faq section in "תצוגה - הדר והירו.html".
 * Answers are drafts built from the questionnaire and the page (no prices are shown, by Yoni's choice): Yoni to approve.
 *
 * Tokens and fonts: see YoniHero.tsx. GridLines: see YoniServices.tsx.
 */
import { useState } from "react";
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
  plus: "M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z",
  phone:
    "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
  whatsapp:
    "m12,3C7.03,3,3,7.03,3,12c0,1.67.46,3.24,1.26,4.59l-1.26,4.41,4.41-1.26c1.35.8,2.92,1.26,4.59,1.26,4.97,0,9-4.03,9-9S16.97,3,12,3Zm4.825,12.442c-.21.585-1.212,1.129-1.662,1.179-.451.051-.872.212-2.955-.614-2.504-.998-4.086-3.578-4.206-3.739-.12-.161-1.002-1.34-1.002-2.559s.631-1.814.861-2.066c.23-.252.5-.312.661-.312.17,0,.33,0,.481.01.17,0,.371.01.551.423.22.494.691,1.713.751,1.824.06.12.1.272.02.433-.091.161-.13.272-.25.413-.12.141-.261.323-.371.433-.13.121-.25.252-.11.504.151.242.641,1.058,1.372,1.713.942.847,1.733,1.109,1.983,1.229.24.121.39.101.531-.06.15-.161.621-.715.781-.967.16-.242.321-.202.551-.121.231.081,1.432.685,1.683.806.24.131.411.191.471.292.06.101.06.605-.14,1.179Z",
};

const Rinnai = () => <bdi>Rinnai</bdi>;

const FAQ: { q: React.ReactNode; a: React.ReactNode }[] = [
  {
    q: "כמה עולה התקנת מחמם מים על גז?",
    a: "המחיר תלוי בסוג המחמם, במיקום ההתקנה ובמצב התשתית שכבר יש לכם. בשיחה קצרה אני מבין מה צריך ונותן לכם מחיר ברור לפני שמתחילים, כדי שתדעו בדיוק על מה אתם משלמים.",
  },
  {
    q: "למה מחמם על גז ולא דוד חשמלי?",
    a: "במחמם על גז המים מתחממים בזמן אמת, כך שיש מים חמים תמיד, גם בבית עם הרבה נפשות. לא מחכים שהדוד יתחמם ולא נגמרים המים החמים באמצע המקלחת.",
  },
  {
    q: "האם ההתקנה בטוחה?",
    a: "אני טכנאי גז מוסמך מטעם משרד האנרגיה, וכל התקנה נעשית לפי התקן. לפני שפותחים את הגז אני בודק כל חיבור לדליפות, ובסיום מוודא שהמחמם והתשתית עובדים כמו שצריך.",
  },
  {
    q: "יש אחריות על העבודה?",
    a: "כן. כל התקנה מגיעה עם אחריות על העבודה, ואם עולה שאלה גם אחרי, מתקשרים ישר אליי. אין מוקד ואין מתווכים.",
  },
  {
    q: (
      <>
        אתה עובד עם מחממי <Rinnai />?
      </>
    ),
    a: (
      <>
        כן. אני מתקין מחממי <Rinnai /> חדשים ומחליף מחממים ישנים. לא בטוחים איזה דגם מתאים לבית שלכם? אעזור לכם לבחור.
      </>
    ),
  },
  {
    q: "אני קבלן או משפץ. אתה עושה גם תשתיות?",
    a: "כן. אני מבצע תשתיות גז לבתים חדשים ולפרויקטים, מעתיק נקודות גז בזמן שיפוץ, ומתאם ישירות מול הקבלן כדי שהעבודה תתקדם בלי עיכובים.",
  },
  { q: "לאילו אזורים אתה מגיע?", a: "חיפה, הקריות, משגב וכל הצפון. לא בטוחים אם אתם באזור? תתקשרו, ואגיד לכם מיד." },
  { q: "מתי משלמים?", a: "התשלום בסיום העבודה, אחרי שהכל הותקן ונבדק." },
];

const easeIO = "ease-[cubic-bezier(.65,0,.35,1)]";
const easeOut = "ease-[cubic-bezier(.22,1,.36,1)]";

export default function YoniFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative scroll-mt-20 bg-[#FEFEFE] py-[84px] text-background min-[1025px]:py-[8.5vw]">
      <GridLines tone="light" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <div className="min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:items-start min-[1025px]:gap-x-[15px]">
          {/* Intro + CTAs */}
          <div className="min-[1025px]:sticky min-[1025px]:top-[120px] min-[1025px]:col-span-5">
            <p className="mb-2 inline-block rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">שאלות נפוצות</p>
            <h2 id="faq-title" className="text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
              שאלות שכדאי לשאול לפני שמתקינים.
            </h2>
            <p className="mt-[15px] max-w-[440px] text-pretty text-[17px] leading-[1.6] min-[1025px]:mt-5 min-[1025px]:text-lg">
              ריכזתי את מה ששואלים אותי הכי הרבה. לא מצאתם תשובה? מתקשרים או שולחים הודעה, ואני עונה לכם ישירות.
            </p>
            <div className="mt-6 flex flex-col gap-3 min-[1025px]:mt-8 min-[1025px]:flex-row min-[1025px]:flex-wrap">
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
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl border border-background px-7 py-3.5 text-lg font-medium text-background transition-colors duration-[350ms] hover:bg-background hover:text-foreground"
              >
                שלחו הודעה בוואטסאפ
                <Svg d={ICONS.whatsapp} className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Accordion */}
          <ul className="mt-10 grid list-none gap-3 min-[1025px]:col-start-7 min-[1025px]:col-end-13 min-[1025px]:mt-0">
            {FAQ.map((item, i) => {
              const on = open === i;
              return (
                <li
                  key={i}
                  className={cn(
                    "rounded-xl transition-colors duration-300",
                    easeOut,
                    on ? "bg-[#E8EDF6]" : "bg-[#F1F4F9] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#E8EDF6]",
                  )}
                >
                  <button
                    id={`faq-q${i}`}
                    aria-expanded={on}
                    aria-controls={`faq-a${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-center justify-between gap-3.5 rounded-xl p-5 text-right font-head text-[22px] font-bold leading-[1.15] text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-background min-[1025px]:gap-5 min-[1025px]:px-7 min-[1025px]:py-6 min-[1025px]:text-[26px]"
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground transition-[transform,background-color] duration-300 motion-reduce:transition-none min-[1025px]:h-10 min-[1025px]:w-10",
                        easeIO,
                        on ? "rotate-45 bg-background" : "bg-brand",
                      )}
                    >
                      <Svg d={ICONS.plus} className="h-[22px] w-[22px]" />
                    </span>
                  </button>
                  <div
                    id={`faq-a${i}`}
                    role="region"
                    aria-labelledby={`faq-q${i}`}
                    className={cn("grid transition-[grid-template-rows] duration-[400ms] motion-reduce:transition-none", easeIO, on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        className={cn(
                          "max-w-[600px] text-pretty px-5 pb-[22px] text-[17px] leading-[1.6] transition-[opacity,transform] duration-[250ms] motion-reduce:transition-none min-[1025px]:px-7 min-[1025px]:pb-[26px] min-[1025px]:text-lg",
                          easeOut,
                          on ? "translate-y-0 opacity-100 delay-[120ms]" : "-translate-y-1.5 opacity-0",
                        )}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
