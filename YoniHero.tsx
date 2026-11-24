/**
 * YoniHero: header (with anchor menu) + hero for Yoni Gal's gas water heater landing page.
 * Visual mirror of "תצוגה - הדר והירו.html". Follows web-design-rules:
 * no pill labels, buttons radius 12 / min 56px, fill OR outline, icon left of text, no dashes in copy.
 *
 * Assets (place in /public):
 *   hero-yoni-1080.mp4, hero-yoni-720.mp4, hero-yoni-poster.jpg, logo-yoni-white.png
 *   fonts/Pompei_FS-Medium.woff2, fonts/Pompei_FS-Bold.woff2,
 *   fonts/TalentFS-Light.woff2, fonts/TalentFS-Medium.woff2, fonts/TalentFS-Bold.woff2
 *
 * src/index.css:
 *   @font-face { font-family: "Pompei"; src: url("/fonts/Pompei_FS-Medium.woff2") format("woff2"); font-weight: 500; font-display: swap; }
 *   @font-face { font-family: "Pompei"; src: url("/fonts/Pompei_FS-Bold.woff2") format("woff2"); font-weight: 700; font-display: swap; }
 *   @font-face { font-family: "Talent"; src: url("/fonts/TalentFS-Light.woff2") format("woff2"); font-weight: 300; font-display: swap; }
 *   @font-face { font-family: "Talent"; src: url("/fonts/TalentFS-Medium.woff2") format("woff2"); font-weight: 500; font-display: swap; }
 *   @font-face { font-family: "Talent"; src: url("/fonts/TalentFS-Bold.woff2") format("woff2"); font-weight: 700; font-display: swap; }
 *   :root {
 *     --background: 218 44% 10%;        // dark  #0E1624
 *     --foreground: 0 0% 99%;           // white #FEFEFE
 *     --primary: 45 100% 53%;           // accent gas yellow #FFC20E (CTA only)
 *     --primary-foreground: 218 44% 10%;
 *     --brand: 222 48% 42%;             // logo blue #3858A0
 *     --brand-light: 223 68% 77%;       // #9DB4EC, brand tint on dark
 *     --whatsapp: 142 70% 49%;          // #25D366
 *   }
 *   body { font-family: "Talent", system-ui, sans-serif; font-weight: 500; }
 *
 * tailwind.config.ts → theme.extend:
 *   colors: { brand: { DEFAULT: "hsl(var(--brand))", light: "hsl(var(--brand-light))" }, whatsapp: "hsl(var(--whatsapp))" },
 *   fontFamily: { head: ['"Pompei"', "system-ui", "sans-serif"], main: ['"Talent"', "system-ui", "sans-serif"] },
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GridLines } from "./YoniServices";

/* Icons: Magicoon Filled (the only icon set for this project). Colour from currentColor. */
type IconProps = { className?: string };
const PhoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z" />
  </svg>
);
const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M9,18H9a1,1,0,0,1-.708-.3l-4-4.063a1,1,0,1,1,1.424-1.4L9.005,15.58l9.288-9.287a1,1,0,1,1,1.414,1.414l-10,10A1,1,0,0,1,9,18Z" />
  </svg>
);
const MenuIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M2,6A1,1,0,0,1,3,5H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,6Zm19,5H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm0,6H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z" />
  </svg>
);
const AngleDownIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12,17a1,1,0,0,1-.707-.293l-7-7A1,1,0,0,1,5.707,8.293L12,14.586l6.293-6.293a1,1,0,0,1,1.414,1.414l-7,7A1,1,0,0,1,12,17Z" />
  </svg>
);

const PHONE_DISPLAY = "052-622-3016";
const PHONE_TEL = "tel:0526223016";
const WHATSAPP_URL =
  "https://wa.me/972526223016?text=" +
  encodeURIComponent("היי יוני, הגעתי מהאתר ואשמח לפרטים על התקנת מחמם מים על גז");

/** Anchor menu, following the 1,500 package page structure. */
const NAV = [
  { href: "#services", label: "שירותים" },
  { href: "#why", label: "למה יוני" },
  { href: "#gallery", label: "עבודות" },
  { href: "#process", label: "איך זה עובד" },
  { href: "#safety", label: "בטיחות", mobileLabel: "בטיחות ואחריות" },
  { href: "#areas", label: "אזורי שירות" },
  { href: "#faq", label: "שאלות נפוצות" },
];
const SERVICES = ["מחממי מים על גז", "תשתיות גז", "העתקת נקודות גז", "חידוש תשתית"];
const TRUST = ['רישיון גפ"מ ממשרד האנרגיה', "5 שנות ניסיון", "אחריות על העבודה"];

/** Magicoon Filled whatsapp. */
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="m12,3C7.03,3,3,7.03,3,12c0,1.67.46,3.24,1.26,4.59l-1.26,4.41,4.41-1.26c1.35.8,2.92,1.26,4.59,1.26,4.97,0,9-4.03,9-9S16.97,3,12,3Zm4.825,12.442c-.21.585-1.212,1.129-1.662,1.179-.451.051-.872.212-2.955-.614-2.504-.998-4.086-3.578-4.206-3.739-.12-.161-1.002-1.34-1.002-2.559s.631-1.814.861-2.066c.23-.252.5-.312.661-.312.17,0,.33,0,.481.01.17,0,.371.01.551.423.22.494.691,1.713.751,1.824.06.12.1.272.02.433-.091.161-.13.272-.25.413-.12.141-.261.323-.371.433-.13.121-.25.252-.11.504.151.242.641,1.058,1.372,1.713.942.847,1.733,1.109,1.983,1.229.24.121.39.101.531-.06.15-.161.621-.715.781-.967.16-.242.321-.202.551-.121.231.081,1.432.685,1.683.806.24.131.411.191.471.292.06.101.06.605-.14,1.179Z" />
  </svg>
);

const ease = "ease-[cubic-bezier(.4,0,.2,1)] duration-[350ms]";
const btn = cn(
  "inline-flex min-h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-7 py-3.5 font-main text-lg font-medium transition-[background,color,box-shadow]",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground",
  ease,
);
/** Filled accent: glowing yellow gradient, dark text, no border. */
const btnGas = cn(
  "bg-primary font-bold text-primary-foreground",
  "shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)]",
  "hover:bg-[#F2B600] hover:shadow-[0_12px_34px_-8px_rgba(255,170,0,.7),0_0_56px_-10px_rgba(255,194,14,.85)]",
);
/** Outline WhatsApp in white: transparent, 1px border, same-colour text; hover swaps to fill. */
const btnWa = "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background";
const ltr = "[direction:ltr] [unicode-bidi:isolate]";

export function YoniHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        ease,
        solid
          ? "bg-background/95 py-3 shadow-[0_1px_0_rgba(254,254,254,.18)] backdrop-blur-md"
          : "py-3.5 min-[1025px]:py-5",
      )}
    >
      <div className="mx-auto grid w-full max-w-[1520px] grid-cols-[auto_auto] items-center justify-between gap-6 px-5 min-[1025px]:grid-cols-[auto_1fr_auto] min-[1025px]:gap-8 min-[1025px]:px-[5vw] min-[1281px]:gap-12">
        {/* Logo is an image, so it stays to the right of the name */}
        <a href="#top" className="flex items-center gap-3.5" aria-label="יוני גל, התקנות גז">
          <img src="/logo-yoni-white.png" alt="לוגו יוני גל" width={73} height={46} className="h-[38px] w-auto min-[1025px]:h-[46px]" />
          <div className="flex flex-col whitespace-nowrap leading-[1.1]">
            <b className="font-head text-2xl font-bold tracking-[.2px]">יוני גל</b>
            <span className="hidden text-sm text-foreground/90 min-[1281px]:block">התקנות גז ומחממי מים</span>
          </div>
        </a>

        <nav aria-label="ניווט בעמוד" className="hidden justify-self-center min-[1025px]:block">
          <ul className="flex items-center gap-[22px] min-[1281px]:gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "relative whitespace-nowrap py-1.5 text-[17px] text-foreground/90 transition-colors hover:text-foreground",
                    "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-brand-light after:transition-transform hover:after:scale-x-100",
                    ease,
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {/* Text first, icon after = icon on the left in RTL */}
          <a
            href={PHONE_TEL}
            aria-label={`חיוג ליוני ${PHONE_DISPLAY}`}
            className={cn(btn, btnGas, "w-12 min-h-12 px-0 min-[1025px]:w-14 min-[1025px]:min-h-14 min-[1441px]:w-auto min-[1441px]:px-7")}
          >
            <span className={cn("hidden min-[1441px]:inline", ltr)}>{PHONE_DISPLAY}</span>
            <PhoneIcon className="h-6 w-6" />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            aria-label="שליחת הודעה ליוני בוואטסאפ"
            className={cn(btn, btnWa, "w-12 min-h-12 px-0 min-[1025px]:w-14 min-[1025px]:min-h-14")}
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
          <button
            type="button"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className={cn(btn, "w-12 min-h-12 border border-foreground/20 bg-transparent px-0 text-foreground min-[1025px]:hidden")}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="ניווט בעמוד"
        className={cn("overflow-hidden transition-[max-height] min-[1025px]:hidden", ease, open ? "max-h-[480px]" : "max-h-0")}
      >
        <ul className="px-5 pb-1.5 pt-2.5">
          {NAV.map((item) => (
            <li key={item.href} className="border-b border-foreground/20 last:border-b-0">
              <a href={item.href} onClick={() => setOpen(false)} className="block py-3.5 text-lg">
                {item.mobileLabel ?? item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function YoniHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-background text-foreground"
    >
      <img src="/hero-yoni-poster.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover" />
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-yoni-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
      >
        <source src="/hero-yoni-720.mp4" type="video/mp4" media="(max-width: 1024px)" />
        <source src="/hero-yoni-1080.mp4" type="video/mp4" />
      </video>
      <GridLines tone="dark" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background:radial-gradient(120%_80%_at_50%_45%,rgba(14,22,36,.55)_0%,rgba(14,22,36,.82)_60%,rgba(14,22,36,.95)_100%),linear-gradient(180deg,rgba(14,22,36,.65)_0%,rgba(14,22,36,.35)_40%,rgba(14,22,36,.9)_100%)]"
      />

      <div className="mx-auto flex w-full max-w-[1300px] flex-col items-center px-5 pb-24 pt-[120px] text-center min-[1025px]:px-[5vw] min-[1025px]:pb-14 min-[1025px]:pt-28">
        {/* Kicker: plain text with a short brand line, no pill (rule 0.1) */}
        <p className="mb-5 text-[15px] font-medium text-foreground/90 min-[1025px]:text-base">
          טכנאי גז מוסמך מטעם משרד האנרגיה
        </p>

        <h1 id="hero-title" className="text-balance font-head text-[clamp(42px,7vw,110px)] font-bold leading-[1.02] tracking-[.3px]">
          התקנת מחמם מים על גז.
          <span className="block text-primary [text-shadow:0_0_26px_rgba(255,194,14,.35)]">
            בטוח, מדויק ועם אחריות.
          </span>
        </h1>

        <p className="mt-6 flex flex-wrap justify-center gap-x-[18px] gap-y-0.5 text-[clamp(18px,1.6vw,22px)] font-bold min-[1025px]:gap-x-0">
          {SERVICES.map((s, i) => (
            <span key={s} className="whitespace-nowrap">
              {s}
              {i < SERVICES.length - 1 && <span className="mx-2.5 hidden text-brand-light min-[1025px]:inline">·</span>}
            </span>
          ))}
        </p>

        <p className="mt-[15px] max-w-[720px] text-pretty text-lg leading-[1.6] text-foreground/90">
          5 שנות ניסיון בהתקנות גז בחיפה, בקריות ובצפון. יחס אישי ועבודה לפי התקן,{" "}
          <strong className="font-bold text-foreground">ואני תמיד עומד מאחורי העבודה שלי.</strong>
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-[15px] min-[1025px]:w-auto min-[1025px]:flex-row min-[1025px]:flex-wrap">
          <a href={PHONE_TEL} className={cn(btn, btnGas, "min-h-[58px] w-full min-[1025px]:min-h-[62px] min-[1025px]:w-auto min-[1025px]:px-8 min-[1025px]:text-[19px]")}>
            חייגו ליוני: <span className={ltr}>{PHONE_DISPLAY}</span>
            <PhoneIcon className="h-6 w-6" />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className={cn(btn, btnWa, "min-h-[58px] w-full min-[1025px]:min-h-[62px] min-[1025px]:w-auto min-[1025px]:px-8 min-[1025px]:text-[19px]")}
          >
            שלחו הודעה בוואטסאפ
            <WhatsAppIcon className="h-6 w-6" />
          </a>
        </div>

        <ul className="mt-7 flex flex-col items-center gap-2 text-base text-foreground/90 min-[1025px]:flex-row min-[1025px]:flex-wrap min-[1025px]:justify-center min-[1025px]:gap-x-7 min-[1025px]:gap-y-2.5">
          {TRUST.map((t) => (
            <li key={t} className="flex items-center gap-2">
              {t}
              <CheckIcon className="h-6 w-6 text-brand-light" />
            </li>
          ))}
        </ul>
      </div>

      <AngleDownIcon className="absolute bottom-[22px] left-1/2 hidden h-8 w-8 -translate-x-1/2 animate-bounce text-foreground/70 motion-reduce:animate-none min-[1025px]:block" />
    </section>
  );
}

export default function YoniHeaderHero() {
  return (
    <>
      <YoniHeader />
      <main id="top">
        <YoniHero />
      </main>
    </>
  );
}
