/**
 * YoniServices: "אז במה אני יכול לעזור?" – 4 services as a horizontal accordion on a strict grid.
 * Visual mirror of the services section in "תצוגה - הדר והירו.html".
 * Desktop: the active card widens (flex-grow 1 → 3.2); hover (fine pointer), tap or focus opens a card.
 * Mobile (≤1024): vertical stack, collapsed strips 112px, active card 460px. Opening a card scrolls it to just
 * under the sticky header (80px + 12px), so the whole card is visible.
 * CTA in every card is a phone call: Yoni's preferred contact in the questionnaire ("action: שיחת טלפון").
 *
 * Assets (/public/work): svc-heater.jpg, svc-infra.jpg, svc-points.jpg, svc-renew.jpg
 * Tokens and fonts: see YoniHero.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Luxury grid: faint square grid (136px, 96px on mobile) that fades out at the top and bottom of
 * each section, so sections blend into each other. Place as the first child of a `relative`
 * section; content above it with z-[1]. Shared with YoniHero (tone="dark").
 */
export function GridLines({ tone }: { tone: "light" | "dark" }) {
  const c = tone === "light" ? "rgba(14,22,36,.06)" : "rgba(254,254,254,.06)";
  const fade = "linear-gradient(to bottom,transparent 0%,#000 20%,#000 80%,transparent 100%)";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-[length:96px_96px] bg-center min-[1025px]:bg-[length:136px_136px]",
        tone === "dark" ? "-z-10" : "z-0",
      )}
      style={{
        backgroundImage: `linear-gradient(to right,${c} 1px,transparent 1px),linear-gradient(to bottom,${c} 1px,transparent 1px)`,
        WebkitMaskImage: fade,
        maskImage: fade,
      }}
    />
  );
}

const PHONE_TEL = "tel:0526223016";

const SERVICES = [
  {
    title: "מחממי מים על גז",
    img: "/work/svc-heater.jpg",
    alt: "מחמם מים על גז של Rinnai מותקן על קיר",
    items: ["התקנת מחמם מים חדש", "החלפת מחמם ישן", "מחממי Rinnai", "מים חמים תמיד, גם בבית עם הרבה נפשות"],
  },
  {
    title: "תשתיות גז",
    img: "/work/svc-infra.jpg",
    alt: "קו גז צהוב לאורך קיר חיצוני של בניין",
    items: ["תשתית גז לבית חדש", "תשתיות לקבלנים ולפרויקטים", "עבודה לפי התקן"],
  },
  {
    title: "העתקת נקודות גז",
    img: "/work/svc-points.jpg",
    alt: "נקודות גז חדשות על קיר חיצוני",
    items: ["העתקת נקודה בזמן שיפוץ", "נקודה חדשה למחמם המים", "תיאום עם הקבלן והמשפץ"],
  },
  {
    title: "חידוש תשתית",
    img: "/work/svc-renew.jpg",
    alt: "צנרת נחושת חדשה במחלק גז",
    items: ["החלפת צנרת גז ישנה", "בדיקה של תשתית קיימת", "התאמה לדרישות התקן"],
  },
];

/** Magicoon Filled phone. */
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z" />
  </svg>
);

const easeIO = "ease-[cubic-bezier(.65,0,.35,1)]";
const easeOut = "ease-[cubic-bezier(.22,1,.36,1)]";

export default function YoniServices() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const prevRef = useRef(0);

  // Mobile: bring the opening card's top just under the sticky header, so the whole card shows.
  // Runs right after the class change, before the height transition moves anything: a card above that
  // collapses will shrink to 112px, so that shift is subtracted from the target in advance.
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = active;
    if (prev === active || !window.matchMedia("(max-width: 1024px)").matches) return;
    const items = listRef.current?.children;
    const el = items?.[active] as HTMLElement | undefined;
    const prevEl = items?.[prev] as HTMLElement | undefined;
    if (!el) return;
    const shift = prevEl && prev < active ? prevEl.offsetHeight - 112 : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - shift - 92;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  }, [active]);

  const hoverOpen = (i: number) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setActive(i);
  };

  return (
    <section
      id="services"
      aria-labelledby="svc-title"
      className="relative scroll-mt-20 bg-[#FEFEFE] py-[84px] text-background min-[1025px]:py-[8.5vw]"
    >
      <GridLines tone="light" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">

        <header className="mb-10 min-[1025px]:mb-16 min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:items-end min-[1025px]:gap-x-[15px]">
          <p className="col-span-12 mb-2 inline-block justify-self-start rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">שירותים</p>
          <h2 id="svc-title" className="col-span-6 text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
            אז במה אני יכול לעזור?
          </h2>
          <p className="col-start-7 col-end-13 mt-[15px] text-pretty text-lg leading-[1.6] min-[1025px]:mt-0 min-[1025px]:max-w-[460px] min-[1025px]:ps-6">
            בעלי בתים שרוצים מים חמים תמיד, וקבלנים ומשפצים שצריכים תשתית או נקודת גז חדשה. כל עבודה נעשית לפי התקן.
          </p>
        </header>

        <ul ref={listRef} className="flex flex-col gap-3 min-[1025px]:h-[620px] min-[1025px]:flex-row min-[1025px]:gap-[15px]">
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.title}
                tabIndex={0}
                aria-expanded={on}
                onMouseEnter={() => hoverOpen(i)}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "group relative min-w-0 overflow-hidden rounded-xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-background",
                  "transition-[height,flex-grow] duration-[600ms] motion-reduce:transition-none",
                  easeIO,
                  on ? "h-[460px] cursor-default min-[1025px]:grow-[3.2]" : "h-28 cursor-pointer min-[1025px]:grow",
                  "min-[1025px]:h-auto min-[1025px]:basis-0",
                )}
              >
                {/* Media sits in its own frame; motion is on the frame, never baked into the file */}
                <div className="absolute inset-0">
                  <img
                    src={s.img}
                    alt={s.alt}
                    width={720}
                    height={960}
                    loading="lazy"
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-[800ms] motion-reduce:transition-none",
                      easeIO,
                      on ? "scale-[1.06]" : "scale-[1.02]",
                    )}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(14,22,36,.94)_0%,rgba(14,22,36,.62)_42%,rgba(14,22,36,.18)_100%)]" />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start px-5 py-[22px] text-foreground min-[1025px]:p-8">
                  <span className="mb-1.5 font-head text-[22px] font-bold leading-none text-foreground/90 min-[1025px]:mb-2 min-[1025px]:text-[28px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={cn(
                      "text-balance font-head font-bold leading-[1.05] transition-[font-size] duration-[600ms] motion-reduce:transition-none",
                      easeIO,
                      on ? "text-[32px] min-[1025px]:text-[44px]" : "text-2xl min-[1025px]:text-[26px]",
                    )}
                  >
                    {s.title}
                  </h3>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity,transform] motion-reduce:transition-none",
                      on
                        ? cn("grid-rows-[1fr] translate-y-0 opacity-100 duration-500 [transition-delay:0s,250ms,250ms]", easeOut)
                        : cn("grid-rows-[0fr] translate-y-3 opacity-0 duration-[240ms]", easeOut),
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ul className="mt-[15px] grid gap-2">
                        {s.items.map((t) => (
                          <li key={t} className="flex items-center gap-2.5 text-lg text-foreground/90">
                            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-light" />
                            {t}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={PHONE_TEL}
                        tabIndex={on ? 0 : -1}
                        className={cn(
                          "mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground min-[1025px]:w-auto",
                          "shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] transition-[background,box-shadow] duration-[350ms] hover:bg-[#F2B600]",
                        )}
                      >
                        לשיחה עם יוני
                        <PhoneIcon className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
