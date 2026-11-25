/**
 * YoniGallery: "עבודות" – Yoni's real work photos.
 * Visual mirror of the #gallery section in "תצוגה - הדר והירו.html".
 * Desktop: 4 columns × 3 rows of 280px; one tall tile (2 rows) and two wide tiles (2 columns), so 9 photos fill
 * the grid with no gaps. Mobile (≤1024): horizontal scroll-snap strip, 78% wide cards at 3:4.
 *
 * Assets (/public/work): g-01.jpg … g-09.jpg (Yoni's own photos from WhatsApp)
 * Header uses the same tag + H2 + paragraph layout as YoniServices.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GridLines } from "./YoniServices";

const PHONE_TEL = "tel:0526223016";
const waFor = (caption: string) =>
  "https://wa.me/972526223016?text=" + encodeURIComponent(`היי יוני, ראיתי באתר את העבודה "${caption}" ואשמח לפרטים`);

/* Magicoon Filled */
const P = {
  times: "M13.414,12l5.293-5.293a1,1,0,1,0-1.414-1.414L12,10.586,6.707,5.293A1,1,0,0,0,5.293,6.707L10.586,12,5.293,17.293a1,1,0,1,0,1.414,1.414L12,13.414l5.293,5.293a1,1,0,0,0,1.414-1.414Z",
  angleRight: "M9,20a1,1,0,0,1-.707-1.707L14.586,12,8.293,5.707A1,1,0,0,1,9.707,4.293l7,7a1,1,0,0,1,0,1.414l-7,7A1,1,0,0,1,9,20Z",
  angleLeft: "M15,20a1,1,0,0,1-.707-.293l-7-7a1,1,0,0,1,0-1.414l7-7a1,1,0,1,1,1.414,1.414L9.414,12l6.293,6.293A1,1,0,0,1,15,20Z",
  phone: "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
  whatsapp: "m12,3C7.03,3,3,7.03,3,12c0,1.67.46,3.24,1.26,4.59l-1.26,4.41,4.41-1.26c1.35.8,2.92,1.26,4.59,1.26,4.97,0,9-4.03,9-9S16.97,3,12,3Zm4.825,12.442c-.21.585-1.212,1.129-1.662,1.179-.451.051-.872.212-2.955-.614-2.504-.998-4.086-3.578-4.206-3.739-.12-.161-1.002-1.34-1.002-2.559s.631-1.814.861-2.066c.23-.252.5-.312.661-.312.17,0,.33,0,.481.01.17,0,.371.01.551.423.22.494.691,1.713.751,1.824.06.12.1.272.02.433-.091.161-.13.272-.25.413-.12.141-.261.323-.371.433-.13.121-.25.252-.11.504.151.242.641,1.058,1.372,1.713.942.847,1.733,1.109,1.983,1.229.24.121.39.101.531-.06.15-.161.621-.715.781-.967.16-.242.321-.202.551-.121.231.081,1.432.685,1.683.806.24.131.411.191.471.292.06.101.06.605-.14,1.179Z",
};
const Icon = ({ d, className = "h-6 w-6" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
);
const lbBtn =
  "absolute grid h-12 w-12 place-items-center rounded-xl border border-foreground/40 bg-transparent text-foreground transition-colors hover:bg-foreground hover:text-background min-[1025px]:h-14 min-[1025px]:w-14";

type Shot = { src: string; w: number; h: number; alt: string; caption: string; span?: "tall" | "wide" };

/* DOM order matters: it fills the 4×3 grid row by row with no holes */
const SHOTS: Shot[] = [
  { src: "/work/g-01.jpg", w: 949, h: 1657, alt: "מחמם מים על גז של Rinnai מותקן על קיר", caption: "התקנת מחמם Rinnai", span: "tall" },
  { src: "/work/g-06.jpg", w: 1600, h: 900, alt: "ברז גז וצנרת נחושת על קיר אבן", caption: "ברז גז בקיר אבן", span: "wide" },
  { src: "/work/g-02.jpg", w: 720, h: 1600, alt: "נקודות גז חדשות על קיר חיצוני", caption: "נקודות גז חדשות" },
  { src: "/work/g-04.jpg", w: 1125, h: 1500, alt: "וסת גז וצנרת צהובה על קיר", caption: "וסת וצנרת על קיר" },
  { src: "/work/g-05.jpg", w: 1125, h: 1500, alt: "מחלק גז עם צנרת נחושת על עמוד עץ", caption: "מחלק נחושת" },
  { src: "/work/g-07.jpg", w: 777, h: 1600, alt: "קו גז צהוב לאורך קיר חיצוני של בניין", caption: "קו גז לאורך הבניין" },
  { src: "/work/g-08.jpg", w: 777, h: 1600, alt: "קו גז צהוב צמוד לבסיס הקיר", caption: "קו גז צמוד לקיר" },
  { src: "/work/g-03.jpg", w: 1600, h: 720, alt: "מיכל גז מחובר בצנרת נחושת", caption: "חיבור מיכל גז", span: "wide" },
  { src: "/work/g-09.jpg", w: 777, h: 1600, alt: "קו גז צהוב לאורך מרפסת", caption: "קו גז במרפסת" },
];

export default function YoniGallery() {
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLLIElement | null>(null);
  const [cur, setCur] = useState<number | null>(null);
  const go = (i: number) => setCur((i + SHOTS.length) % SHOTS.length);

  const open = (i: number, el: HTMLLIElement) => {
    opener.current = el;
    setCur(i);
    dlg.current?.showModal();
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => {
      document.body.style.overflow = "";
      opener.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const shot = cur === null ? null : SHOTS[cur];

  return (
    <section id="gallery" aria-labelledby="gal-title" className="relative scroll-mt-20 bg-[#FEFEFE] py-[84px] text-background min-[1025px]:py-[8.5vw]">
      <GridLines tone="light" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <header className="mb-10 min-[1025px]:mb-16 min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:items-end min-[1025px]:gap-x-[15px]">
          <p className="col-span-12 mb-2 inline-block justify-self-start rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">עבודות</p>
          <h2 id="gal-title" className="col-span-6 text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
            עבודות אמיתיות, מהשטח.
          </h2>
          <p className="col-start-7 col-end-13 mt-[15px] text-pretty text-lg leading-[1.6] min-[1025px]:mt-0 min-[1025px]:max-w-[460px] min-[1025px]:ps-6">
            כל התמונות כאן מעבודות שביצעתי בעצמי: מחממי מים, תשתיות ונקודות גז.
          </p>
        </header>

        <ul
          className={cn(
            "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "min-[1025px]:mx-0 min-[1025px]:grid min-[1025px]:auto-rows-[280px] min-[1025px]:grid-cols-4 min-[1025px]:gap-[15px] min-[1025px]:overflow-visible min-[1025px]:px-0",
          )}
        >
          {SHOTS.map((s, i) => (
            <li
              key={s.src}
              role="button"
              tabIndex={0}
              aria-label={`הגדלת תמונה: ${s.caption}`}
              onClick={(e) => open(i, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(i, e.currentTarget);
                }
              }}
              className={cn(
                "group relative aspect-[3/4] shrink-0 basis-[78%] cursor-zoom-in snap-start overflow-hidden rounded-xl bg-[#e9edf3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-background",
                "min-[1025px]:aspect-auto min-[1025px]:basis-auto",
                s.span === "tall" && "min-[1025px]:row-span-2",
                s.span === "wide" && "min-[1025px]:col-span-2",
              )}
            >
              <figure className="m-0 h-full">
                <img
                  src={s.src}
                  alt={s.alt}
                  width={s.w}
                  height={s.h}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(14,22,36,.85)_0%,rgba(14,22,36,0)_100%)] px-5 pb-[18px] pt-10 text-lg font-bold text-foreground">
                  {s.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      {/* Lightbox: large photo + call to action. RTL: left arrow = next. */}
      <dialog
        ref={dlg}
        aria-label="תמונה מוגדלת"
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (t === dlg.current || t.dataset.backdrop) dlg.current?.close();
        }}
        onKeyDown={(e) => {
          if (cur === null) return;
          if (e.key === "ArrowLeft") go(cur + 1);
          if (e.key === "ArrowRight") go(cur - 1);
        }}
        className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-foreground backdrop:bg-background/[.94]"
      >
        <div
          data-backdrop="1"
          className="relative grid h-full grid-rows-[minmax(0,1fr)_auto] items-center justify-items-center gap-4 px-5 pb-5 pt-[76px] min-[1025px]:gap-6 min-[1025px]:px-[5vw] min-[1025px]:pb-8 min-[1025px]:pt-20"
        >
          <button type="button" aria-label="סגירה" onClick={() => dlg.current?.close()} className={cn(lbBtn, "left-3 top-3 min-[1025px]:left-5 min-[1025px]:top-5")}>
            <Icon d={P.times} />
          </button>
          <button type="button" aria-label="התמונה הקודמת" onClick={() => cur !== null && go(cur - 1)} className={cn(lbBtn, "right-3 top-3 min-[1025px]:right-5 min-[1025px]:top-1/2 min-[1025px]:-translate-y-1/2")}>
            <Icon d={P.angleRight} />
          </button>
          <button type="button" aria-label="התמונה הבאה" onClick={() => cur !== null && go(cur + 1)} className={cn(lbBtn, "left-[72px] top-3 min-[1025px]:left-5 min-[1025px]:top-1/2 min-[1025px]:-translate-y-1/2")}>
            <Icon d={P.angleLeft} />
          </button>

          {shot && (
            <figure className="m-0 flex max-h-full min-h-0 flex-col items-center">
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                className="block max-h-[calc(100dvh-330px)] max-w-[min(1100px,100%)] animate-in fade-in zoom-in-[.97] rounded-xl object-contain duration-300 min-[1025px]:max-h-[calc(100dvh-280px)]"
              />
              <figcaption className="mt-3 text-lg font-bold">{shot.caption}</figcaption>
            </figure>
          )}

          <div className="flex w-full flex-col items-center justify-center gap-[15px] min-[1025px]:w-auto min-[1025px]:flex-row min-[1025px]:flex-wrap">
            <p className="font-head text-2xl font-bold min-[1025px]:me-2.5 min-[1025px]:text-[28px]">רוצים עבודה כזאת גם אצלכם?</p>
            <a
              href={PHONE_TEL}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] hover:bg-[#F2B600] min-[1025px]:w-auto"
            >
              לשיחה עם יוני
              <Icon d={P.phone} />
            </a>
            {shot && (
              <a
                href={waFor(shot.caption)}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl border border-foreground bg-transparent px-7 py-3.5 text-lg font-medium text-foreground hover:bg-foreground hover:text-background min-[1025px]:w-auto"
              >
                שלחו הודעה בוואטסאפ
                <Icon d={P.whatsapp} />
              </a>
            )}
          </div>
        </div>
      </dialog>
    </section>
  );
}
