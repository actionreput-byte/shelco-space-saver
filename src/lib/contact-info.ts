/** Single source of truth for Shelco contact details. */

export type PhoneEntry = { display: string; tel: string; wa: string };

export const PHONES: PhoneEntry[] = [
  { display: "+255 652 808 809", tel: "+255652808809", wa: "255652808809" },
  { display: "+255 749 809 809", tel: "+255749809809", wa: "255749809809" },
];

export const PRIMARY_PHONE: PhoneEntry = PHONES[0]!;
export const WHATSAPP = PRIMARY_PHONE.wa;

export const EMAILS = ["sales1.shelcosystems@gmail.com", "sales2.shelcosystems@gmail.com"];
export const PRIMARY_EMAIL = EMAILS[0];

export const COMPANY_NAME = "Shelco Storage Systems Ltd";

/** Street address. */
export const ADDRESS = {
  street: "Plot 2386, 12 Nnamdi Azikiwe Ave",
  poBox: "P.O. Box 100053",
  city: "Dar es Salaam 11101",
  country: "Tanzania",
  countryCode: "TZ",
  lat: -6.8157868,
  lng: 39.2887259,
};

export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.country}`;

export const MAPS_URL = "https://maps.app.goo.gl/2NY7xyPYGJxKTGoU8";

/** Official Shelco WhatsApp short link. */
export const WHATSAPP_SHORT_LINK = "https://wa.me/message/BS26NQP3L5SHI1";

/**
 * Number-based link: opens the installed WhatsApp app directly on mobile
 * (and WhatsApp Desktop / Web on computers) instead of a landing page.
 */
export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const WHATSAPP_LINK = waLink();

/** Native app deep link, used first on mobile devices. */
export const waAppLink = (text?: string) =>
  `whatsapp://send?phone=${WHATSAPP}${text ? `&text=${encodeURIComponent(text)}` : ""}`;

/**
 * Click handler for WhatsApp buttons: tries the native app scheme on mobile
 * and falls back to the normal wa.me link if the app is not installed.
 */
export function openWhatsApp(event: { preventDefault: () => void }, text?: string) {
  if (typeof window === "undefined") return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
  if (!isMobile) return; // let the default wa.me href open WhatsApp Desktop/Web
  event.preventDefault();
  const fallback = window.setTimeout(() => {
    window.location.href = waLink(text);
  }, 1200);
  const clear = () => window.clearTimeout(fallback);
  window.addEventListener("pagehide", clear, { once: true });
  window.location.href = waAppLink(text);
}
