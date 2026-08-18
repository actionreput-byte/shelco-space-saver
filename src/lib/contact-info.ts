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

/** Street address — update here when the new location is confirmed. */
export const ADDRESS = {
  street: "Changombe, Mwakalinga Road",
  poBox: "P.O. Box 100053",
  city: "Dar es Salaam",
  country: "Tanzania",
  countryCode: "TZ",
};

export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.country}`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ADDRESS.street} ${ADDRESS.city} ${ADDRESS.country}`,
)}`;

export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
