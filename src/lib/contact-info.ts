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

/** Official Shelco WhatsApp short link — all WhatsApp buttons use this. */
export const WHATSAPP_LINK = "https://wa.me/message/BS26NQP3L5SHI1";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const waLink = (_text?: string) => WHATSAPP_LINK;
