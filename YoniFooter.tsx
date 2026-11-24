/**
 * YoniFooter: dark footer that closes the page with a call to action.
 * Top: heading + short line + phone / WhatsApp buttons + trust row (right), and a white lead-form card (left).
 * Bottom: brand, page links, service areas, contact details, copyright and the accessibility-statement link.
 * Visual mirror of the footer in "תצוגה - הדר והירו.html".
 *
 * Lead form: validates name + phone, then shows a thank-you state. onSubmit is where Lovable wires the real
 * delivery (e.g. insert into a leads table and email Yoni); nothing is sent in this component yet.
 * Tokens and fonts: see YoniHero.tsx. GridLines: see YoniServices.tsx.
 */
import { useState, type FormEvent } from "react";
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
  check:
    "M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.03,8.2-4.67,4.66a.71.71,0,0,1-.53.22.742.742,0,0,1-.53-.22L7.97,12.53a.75.75,0,0,1,1.06-1.06l1.8,1.8,4.14-4.13a.737.737,0,0,1,1.06,0A.754.754,0,0,1,16.03,10.2Z",
  send: "M18.446,3.063,5.333,6.341a3.08,3.08,0,0,0,.042,5.987l4.078.96a.3.3,0,0,0,.281-.08L14.472,8.47a.75.75,0,0,1,1.061,1.06l-4.74,4.74a.3.3,0,0,0-.08.281l.959,4.074a3.08,3.08,0,0,0,5.987.042L20.937,5.554A2.054,2.054,0,0,0,18.446,3.063Z",
  pin: "M12,2.5A8.51,8.51,0,0,0,3.5,11c0,4.983,4.629,8.041,7.692,10.064l.531.352a.5.5,0,0,0,.554,0l.531-.352C15.871,19.041,20.5,15.983,20.5,11A8.51,8.51,0,0,0,12,2.5Zm0,11A2.5,2.5,0,1,1,14.5,11,2.5,2.5,0,0,1,12,13.5Z",
};

const SERVICES = ["התקנת מחמם מים על גז", "החלפת מחמם ישן", "תשתית גז", "העתקת נקודת גז", "חידוש תשתית", "משהו אחר"];
const NAV = [
  ["#services", "שירותים"],
  ["#why", "למה יוני"],
  ["#gallery", "עבודות"],
  ["#process", "איך זה עובד"],
  ["#faq", "שאלות נפוצות"],
];

const btnGas =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] transition-[background,box-shadow] duration-[350ms] hover:bg-[#F2B600]";
const field =
  "h-[60px] w-full rounded-xl border-0 bg-[#F1F4F9] px-[18px] text-right text-[17px] font-medium text-background outline-none placeholder:text-background/50 focus-visible:shadow-[0_0_0_2px_hsl(var(--brand))]";

export default function YoniFooter() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    name.setCustomValidity(name.value.trim() ? "" : "נא למלא שם");
    phone.setCustomValidity(phone.value.replace(/[^0-9]/g, "").length >= 9 ? "" : "נא למלא מספר טלפון תקין");
    if (!form.reportValidity()) return;
    // TODO (Lovable): save the lead and notify Yoni, then show the thank-you state.
    setSent(true);
  };

  return (
    <footer id="contact" aria-labelledby="foot-title" className="relative scroll-mt-20 overflow-hidden bg-background pb-[110px] pt-[84px] text-foreground min-[1025px]:pb-10 min-[1025px]:pt-[8.5vw]">
      <GridLines tone="dark" />
      <div className="relative z-[1] mx-auto w-full max-w-[1520px] px-5 min-[1025px]:px-[5vw]">
        <div className="min-[1025px]:grid min-[1025px]:grid-cols-12 min-[1025px]:items-center min-[1025px]:gap-x-[15px]">
          <div className="min-[1025px]:col-span-6">
            <p className="mb-2 inline-block rounded-xl bg-brand px-4 py-2 text-base font-bold text-foreground">דברו עם יוני</p>
            <h2 id="foot-title" className="text-balance font-head text-4xl font-bold leading-none min-[1025px]:text-[72px]">
              צריכים מחמם מים על גז? <span className="text-primary">יוני כאן.</span>
            </h2>
            <p className="mt-[15px] max-w-[480px] text-pretty text-[17px] leading-[1.6] text-foreground/90 min-[1025px]:mt-5 min-[1025px]:text-lg">
              השאירו פרטים ויוני יחזור אליכם, או התקשרו עכשיו ודברו איתו ישירות. בלי מוקד ובלי מתווכים.
            </p>
            <div className="mt-6 flex flex-col gap-3 min-[1025px]:mt-8 min-[1025px]:flex-row min-[1025px]:flex-wrap">
              <a href={PHONE_TEL} className={btnGas}>
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
            <ul className="mt-7 flex list-none flex-wrap gap-x-7 gap-y-2.5 text-base text-foreground/90">
              {["טכנאי גז מוסמך", "אחריות על העבודה", "חיפה, הקריות והצפון"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  {t}
                  <Svg d={ICONS.check} className="h-5 w-5 text-brand-light" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 rounded-xl bg-[#FEFEFE] px-5 py-7 text-background min-[1025px]:col-start-8 min-[1025px]:col-end-13 min-[1025px]:mt-0 min-[1025px]:p-10">
            {sent ? (
              <div role="status" aria-live="polite" className="py-8 text-center">
                <Svg d={ICONS.check} className="mx-auto mb-4 h-14 w-14 text-brand" />
                <b className="block font-head text-[32px] leading-[1.1]">תודה, קיבלנו!</b>
                <p className="mt-2 text-[17px] text-background/75">יוני יחזור אליכם בהקדם.</p>
              </div>
            ) : (
              <>
                <h3 className="font-head text-[28px] font-bold leading-[1.05] min-[1025px]:text-4xl">השאירו פרטים</h3>
                <p className="mt-2 text-[17px] leading-normal text-background/75">יוני יחזור אליכם בהקדם.</p>
                <form noValidate onSubmit={onSubmit} className="mt-6 grid gap-3">
                  <label className="grid gap-1.5 text-[15px] font-bold">
                    שם מלא
                    <input name="name" type="text" autoComplete="name" placeholder="איך קוראים לכם?" required className={field} onInput={(e) => e.currentTarget.setCustomValidity("")} />
                  </label>
                  <label className="grid gap-1.5 text-[15px] font-bold">
                    טלפון
                    <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="050-0000000" required className={field} onInput={(e) => e.currentTarget.setCustomValidity("")} />
                  </label>
                  <label className="grid gap-1.5 text-[15px] font-bold">
                    במה אפשר לעזור?
                    <select name="service" className={`${field} cursor-pointer appearance-none bg-[length:20px] bg-[left_18px_center] bg-no-repeat [background-image:url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_viewBox='0_0_24_24'_fill='%230E1624'%3E%3Cpath_d='M12,17a1,1,0,0,1-.707-.293l-7-7A1,1,0,0,1,5.707,8.293L12,14.586l6.293-6.293a1,1,0,0,1,1.414,1.414l-7,7A1,1,0,0,1,12,17Z'/%3E%3C/svg%3E")]`}>
                      {SERVICES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className={`${btnGas} mt-2 w-full`}>
                    שלחו ויוני יחזור אליכם
                    <Svg d={ICONS.send} className="h-6 w-6" />
                  </button>
                </form>
                <p className="mt-3 text-sm text-background/60">הפרטים משמשים רק כדי לחזור אליכם.</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-[15px] gap-y-8 min-[1025px]:mt-24 min-[1025px]:grid-cols-12 min-[1025px]:gap-y-10">
          <div className="col-span-2 min-[1025px]:col-span-4">
            <a href="#top" aria-label="יוני גל, לראש הדף" className="flex items-center gap-3.5">
              <img src="/logo-yoni-white.png" alt="" width={46} height={46} className="h-[46px] w-auto" />
              <span className="flex flex-col leading-[1.1]">
                <b className="font-head text-2xl font-bold">יוני גל</b>
                <span className="text-sm text-foreground/90">התקנות גז ומחממי מים</span>
              </span>
            </a>
            <p className="mt-4 max-w-[320px] text-base leading-[1.6] text-foreground/90">
              טכנאי גז מוסמך מטעם משרד האנרגיה. התקנת מחממי מים על גז, תשתיות גז והעתקת נקודות, בחיפה, בקריות ובצפון.
            </p>
          </div>
          <nav aria-label="ניווט בתחתית הדף" className="min-[1025px]:col-span-2">
            <h4 className="mb-3.5 font-head text-[22px] font-bold">בדף</h4>
            <ul className="grid list-none gap-2.5 text-base text-foreground/90">
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors duration-200 hover:text-primary">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-[1025px]:col-span-2">
            <h4 className="mb-3.5 font-head text-[22px] font-bold">אזורי שירות</h4>
            <ul className="grid list-none gap-2.5 text-base text-foreground/90">
              {["חיפה", "הקריות", "משגב", "הגליל והצפון"].map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 min-[1025px]:col-span-3">
            <h4 className="mb-3.5 font-head text-[22px] font-bold">יצירת קשר</h4>
            <ul className="grid list-none gap-2.5 text-base text-foreground/90">
              <li className="flex items-center gap-2">
                <a href={PHONE_TEL} dir="ltr" className="transition-colors duration-200 hover:text-primary">052-622-3016</a>
                <Svg d={ICONS.phone} className="h-5 w-5 text-brand-light" />
              </li>
              <li className="flex items-center gap-2">
                <a href={WA_LINK} target="_blank" rel="noopener" className="transition-colors duration-200 hover:text-primary">וואטסאפ ליוני</a>
                <Svg d={ICONS.whatsapp} className="h-5 w-5 text-brand-light" />
              </li>
              <li className="flex items-center gap-2">
                חיפה והצפון
                <Svg d={ICONS.pin} className="h-5 w-5 text-brand-light" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 text-sm text-foreground/60 min-[1025px]:mt-[72px] min-[1025px]:flex-row min-[1025px]:flex-wrap">
          <span>© 2026 יוני גל, התקנות גז ומחממי מים. כל הזכויות שמורות.</span>
          {/* TODO (Lovable): point to the accessibility statement page */}
          <a href="#" className="underline underline-offset-[3px] hover:text-foreground">הצהרת נגישות</a>
        </div>
      </div>
    </footer>
  );
}
