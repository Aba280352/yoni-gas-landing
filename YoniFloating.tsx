/**
 * YoniFloating: fixed buttons that stay on screen.
 * Left: phone (brand blue) above WhatsApp (yellow). On desktop they fade in once the hero is behind you; always on mobile.
 * Right (RTL start): accessibility button that opens a small menu: bigger / smaller text, high contrast,
 * highlighted links, stop motion (also pauses the hero video), readable font, reset, and the accessibility-statement link.
 * Settings are saved per visitor in localStorage (wrapped in try/catch). Escape closes the menu.
 * Visual mirror of .fab-contact / .fab-a11y in "תצוגה - הדר והירו.html".
 *
 * Add to the global CSS (index.css) so the modes reach the whole page:
 *   html.a11y-contrast main, html.a11y-contrast footer, html.a11y-contrast header { filter: contrast(1.35); }
 *   html.a11y-links a { text-decoration: underline !important; text-underline-offset: 3px; outline: 2px dashed hsl(var(--primary)); outline-offset: 2px; }
 *   html.a11y-font * { font-family: Arial, "Segoe UI", sans-serif !important; }
 *   html.a11y-still *, html.a11y-still *::before, html.a11y-still *::after { animation: none !important; transition: none !important; }
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PHONE_TEL = "tel:0526223016";
const WA_LINK = "https://wa.me/972526223016?text=" + encodeURIComponent("היי יוני, הגעתי מהאתר ואשמח לפרטים על התקנת מחמם מים על גז");

const Svg = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
);

/* Magicoon Filled (a11y: the standard accessibility figure) */
const ICONS = {
  phone:
    "M17.625,14.174l2.642,1.576a1.5,1.5,0,0,1,.7,1.583h0a4.526,4.526,0,0,1-5.6,3.508A17.44,17.44,0,0,1,3.159,8.635a4.526,4.526,0,0,1,3.507-5.6l.016,0a1.5,1.5,0,0,1,1.587.707l1.564,2.64A2.051,2.051,0,0,1,9.2,9.128L7.543,10.233a11.6,11.6,0,0,0,6.211,6.226l1.115-1.665A2.052,2.052,0,0,1,17.625,14.174Z",
  whatsapp:
    "m12,3C7.03,3,3,7.03,3,12c0,1.67.46,3.24,1.26,4.59l-1.26,4.41,4.41-1.26c1.35.8,2.92,1.26,4.59,1.26,4.97,0,9-4.03,9-9S16.97,3,12,3Zm4.825,12.442c-.21.585-1.212,1.129-1.662,1.179-.451.051-.872.212-2.955-.614-2.504-.998-4.086-3.578-4.206-3.739-.12-.161-1.002-1.34-1.002-2.559s.631-1.814.861-2.066c.23-.252.5-.312.661-.312.17,0,.33,0,.481.01.17,0,.371.01.551.423.22.494.691,1.713.751,1.824.06.12.1.272.02.433-.091.161-.13.272-.25.413-.12.141-.261.323-.371.433-.13.121-.25.252-.11.504.151.242.641,1.058,1.372,1.713.942.847,1.733,1.109,1.983,1.229.24.121.39.101.531-.06.15-.161.621-.715.781-.967.16-.242.321-.202.551-.121.231.081,1.432.685,1.683.806.24.131.411.191.471.292.06.101.06.605-.14,1.179Z",
  a11y: "M12,2a2,2,0,1,1-2,2A2,2,0,0,1,12,2Zm8.5,4.06-.5-1.94A44.5,44.5,0,0,1,12,5a44.5,44.5,0,0,1-8-.88L3.5,6.06A42.6,42.6,0,0,0,9,7v4.6L7.1,20.79a1,1,0,0,0,1.96.42L10.88,14h2.24l1.82,7.21a1,1,0,0,0,1.96-.42L15,11.6V7A42.6,42.6,0,0,0,20.5,6.06Z",
  times:
    "M13.414,12l5.293-5.293a1,1,0,1,0-1.414-1.414L12,10.586,6.707,5.293A1,1,0,0,0,5.293,6.707L10.586,12,5.293,17.293a1,1,0,1,0,1.414,1.414L12,13.414l5.293,5.293a1,1,0,0,0,1.414-1.414Z",
  plus: "M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z",
  minus: "M19,13H5a1,1,0,0,1,0-2H19a1,1,0,0,1,0,2Z",
  contrast: "M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,16.08a.551.551,0,0,1-.58.56,6.665,6.665,0,0,1,0-13.28.551.551,0,0,1,.58.56Z",
  link: "M17.565,14.546a1,1,0,0,1-.709-1.7l1.968-1.978a4.028,4.028,0,0,0,0-5.687,4.025,4.025,0,0,0-5.686,0L11.174,7.152A1,1,0,1,1,9.756,5.741l1.968-1.978A6.017,6.017,0,0,1,22,8.023a5.935,5.935,0,0,1-1.764,4.256l-1.962,1.973A1,1,0,0,1,17.565,14.546ZM12.274,20.24l1.979-1.968a1,1,0,0,0-1.41-1.418l-1.981,1.97a4.02,4.02,0,0,1-5.688-5.683l1.978-1.968a1,1,0,1,0-1.41-1.418l-1.98,1.97a6.02,6.02,0,0,0,8.512,8.515ZM9.707,15.707l6.026-6.025a1,1,0,0,0-1.414-1.414L8.293,14.293a1,1,0,1,0,1.414,1.414Z",
  pause:
    "M5,19.5V4.5A1.326,1.326,0,0,1,6.5,3h2A1.326,1.326,0,0,1,10,4.5v15A1.326,1.326,0,0,1,8.5,21h-2A1.326,1.326,0,0,1,5,19.5ZM15.5,21h2A1.326,1.326,0,0,0,19,19.5V4.5A1.326,1.326,0,0,0,17.5,3h-2A1.326,1.326,0,0,0,14,4.5v15A1.326,1.326,0,0,0,15.5,21Z",
  reset: "M22,12A10,10,0,0,1,3.045,16.445a1,1,0,1,1,1.791-.89A8.015,8.015,0,1,0,5.09,8H8a1,1,0,0,1,0,2H3A1,1,0,0,1,2,9V4A1,1,0,0,1,4,4V6.008A10,10,0,0,1,22,12Z",
};

type Settings = { size: number; contrast: boolean; links: boolean; still: boolean; font: boolean };
const DEFAULTS: Settings = { size: 0, contrast: false, links: false, still: false, font: false };
const KEY = "yoni-a11y";
const ease = "ease-[cubic-bezier(.22,1,.36,1)]";
const fab = "grid h-[54px] w-[54px] place-items-center rounded-full shadow-[0_10px_26px_-8px_rgba(0,0,0,.45)] transition-[transform,background-color] duration-150 active:scale-95 min-[1025px]:h-[60px] min-[1025px]:w-[60px]";

export default function YoniFloating() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [st, setSt] = useState<Settings>(DEFAULTS);
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  // Contact buttons: appear after the hero on desktop
  useEffect(() => {
    const onS = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onS();
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);

  // Load saved accessibility settings
  useEffect(() => {
    try {
      setSt({ ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") });
    } catch {
      /* storage blocked: keep defaults */
    }
  }, []);

  // Apply settings to the page
  useEffect(() => {
    const root = document.documentElement;
    document.body.style.zoom = st.size ? String(1 + st.size * 0.1) : "";
    (["contrast", "links", "still", "font"] as const).forEach((k) => root.classList.toggle(`a11y-${k}`, st[k]));
    const v = document.querySelector<HTMLVideoElement>("#top video");
    if (v) (st.still ? v.pause() : v.play().catch(() => {}));
    try {
      localStorage.setItem(KEY, JSON.stringify(st));
    } catch {
      /* ignore */
    }
  }, [st]);

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (k: "contrast" | "links" | "still" | "font") => setSt((s) => ({ ...s, [k]: !s[k] }));
  const tile =
    "flex min-h-[78px] flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-center text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background";
  const tileState = (on: boolean) => (on ? "bg-brand text-foreground" : "bg-[#F1F4F9] text-background hover:bg-[#E3E9F4]");

  return (
    <>
      {/* Contact: phone above WhatsApp */}
      <div
        className={cn(
          "fixed bottom-4 left-4 z-[60] flex flex-col gap-3 transition-[opacity,transform] duration-300 motion-reduce:transition-none min-[1025px]:bottom-5 min-[1025px]:left-5",
          ease,
          show ? "min-[1025px]:translate-y-0 min-[1025px]:opacity-100" : "min-[1025px]:pointer-events-none min-[1025px]:translate-y-3 min-[1025px]:opacity-0",
        )}
      >
        <a href={PHONE_TEL} aria-label="חיוג ליוני, 052-622-3016" className={cn(fab, "bg-brand text-foreground hover:bg-[#2F4C8C]")}>
          <Svg d={ICONS.phone} className="h-[26px] w-[26px]" />
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener"
          aria-label="שליחת הודעה ליוני בוואטסאפ"
          className={cn(fab, "bg-primary text-primary-foreground !shadow-[0_10px_28px_-8px_rgba(255,170,0,.6),0_0_44px_-12px_rgba(255,194,14,.75)] hover:bg-[#F2B600]")}
        >
          <Svg d={ICONS.whatsapp} className="h-7 w-7" />
        </a>
      </div>

      {/* Accessibility */}
      <div className="fixed bottom-4 right-4 z-[60] min-[1025px]:bottom-5 min-[1025px]:right-5">
        <div
          id="a11yPanel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="a11yTitle"
          className={cn(
            "absolute bottom-[66px] right-0 w-[calc(100vw-32px)] origin-bottom-right rounded-xl bg-[#FEFEFE] p-5 text-background shadow-[0_24px_60px_-20px_rgba(0,0,0,.5)] transition-[opacity,transform] duration-200 motion-reduce:transition-none min-[1025px]:bottom-[72px] min-[1025px]:w-[300px]",
            ease,
            open ? "scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-[.98] opacity-0",
          )}
        >
          <div className="mb-3.5 flex items-center justify-between">
            <b id="a11yTitle" className="font-head text-[26px]">נגישות</b>
            <button
              type="button"
              aria-label="סגירת תפריט הנגישות"
              onClick={() => {
                setOpen(false);
                btnRef.current?.focus();
              }}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#F1F4F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
            >
              <Svg d={ICONS.times} className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button ref={firstRef} type="button" className={cn(tile, tileState(false))} onClick={() => setSt((s) => ({ ...s, size: Math.min(3, s.size + 1) }))}>
              <Svg d={ICONS.plus} className="h-[22px] w-[22px]" />
              הגדלת טקסט
            </button>
            <button type="button" className={cn(tile, tileState(false))} onClick={() => setSt((s) => ({ ...s, size: Math.max(0, s.size - 1) }))}>
              <Svg d={ICONS.minus} className="h-[22px] w-[22px]" />
              הקטנת טקסט
            </button>
            <button type="button" aria-pressed={st.contrast} className={cn(tile, tileState(st.contrast))} onClick={() => toggle("contrast")}>
              <Svg d={ICONS.contrast} className="h-[22px] w-[22px]" />
              ניגודיות גבוהה
            </button>
            <button type="button" aria-pressed={st.links} className={cn(tile, tileState(st.links))} onClick={() => toggle("links")}>
              <Svg d={ICONS.link} className="h-[22px] w-[22px]" />
              הדגשת קישורים
            </button>
            <button type="button" aria-pressed={st.still} className={cn(tile, tileState(st.still))} onClick={() => toggle("still")}>
              <Svg d={ICONS.pause} className="h-[22px] w-[22px]" />
              עצירת אנימציות
            </button>
            <button type="button" aria-pressed={st.font} className={cn(tile, tileState(st.font))} onClick={() => toggle("font")}>
              <span className="font-[Arial,sans-serif] text-xl leading-none">אב</span>
              גופן קריא
            </button>
            <button type="button" className={cn(tile, tileState(false), "col-span-2 min-h-[52px] flex-row")} onClick={() => setSt(DEFAULTS)}>
              איפוס הגדרות
              <Svg d={ICONS.reset} className="h-5 w-5" />
            </button>
          </div>
          {/* TODO (Lovable): point to the accessibility statement page */}
          <a href="#" className="mt-3 block text-center text-sm underline underline-offset-[3px]">הצהרת נגישות</a>
        </div>
        <button
          ref={btnRef}
          type="button"
          aria-label="תפריט נגישות"
          aria-expanded={open}
          aria-controls="a11yPanel"
          onClick={() => setOpen((o) => !o)}
          className={cn(fab, "bg-brand text-foreground hover:bg-[#2F4C8C]")}
        >
          <Svg d={ICONS.a11y} className="h-[30px] w-[30px]" />
        </button>
      </div>
    </>
  );
}
