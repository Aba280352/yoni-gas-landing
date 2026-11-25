/**
 * YoniCtaStrip: brand-blue band between sections with a heading, one short line and two filled buttons
 * (phone in yellow, WhatsApp in white). Visual mirror of .cta-strip in "תצוגה - הדר והירו.html".
 *
 * Used twice on the page:
 *   between the gallery and "איך זה עובד":
 *     <YoniCtaStrip id="cta1" title="רוצים עבודה כזאת גם אצלכם?" text="ספרו לי מה צריך, ותקבלו הסבר ישיר והצעת מחיר ברורה לפני שמתחילים." />
 *   between "בטיחות ואחריות" and "אזורי שירות":
 *     <YoniCtaStrip id="cta2" title="מים חמים תמיד, בהתקנה בטוחה." text="טכנאי גז מוסמך, עבודה לפי התקן ואחריות על העבודה. דברו איתי עוד היום." />
 *
 * Tokens and fonts: see YoniHero.tsx.
 */

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
};

const GRID = "rgba(254,254,254,.08)";
const FADE = "linear-gradient(to bottom,transparent 0%,#000 20%,#000 80%,transparent 100%)";

export default function YoniCtaStrip({ id, title, text }: { id: string; title: string; text: string }) {
  return (
    <aside aria-labelledby={id} className="relative overflow-hidden bg-brand py-14 text-foreground min-[1025px]:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[length:96px_96px] bg-center min-[1025px]:bg-[length:136px_136px]"
        style={{
          backgroundImage: `linear-gradient(to right,${GRID} 1px,transparent 1px),linear-gradient(to bottom,${GRID} 1px,transparent 1px)`,
          WebkitMaskImage: FADE,
          maskImage: FADE,
        }}
      />
      <div className="relative z-[1] mx-auto flex w-full max-w-[1520px] flex-col items-stretch gap-6 px-5 min-[1025px]:flex-row min-[1025px]:items-center min-[1025px]:justify-between min-[1025px]:gap-12 min-[1025px]:px-[5vw]">
        <div>
          <h2 id={id} className="text-balance font-head text-[32px] font-bold leading-[1.05] min-[1025px]:text-5xl">
            {title}
          </h2>
          <p className="mt-2.5 max-w-[560px] text-pretty text-[17px] leading-[1.55] text-foreground/90 min-[1025px]:text-lg">{text}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 min-[1025px]:flex-row min-[1025px]:flex-wrap">
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
            className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-[#FEFEFE] px-7 py-3.5 text-lg font-bold text-background transition-colors duration-[350ms] hover:bg-[#E8EDF6]"
          >
            שלחו הודעה בוואטסאפ
            <Svg d={ICONS.whatsapp} className="h-6 w-6" />
          </a>
        </div>
      </div>
    </aside>
  );
}
