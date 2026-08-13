import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "sw";

const DICT = {
  en: {
    "nav.about": "About",
    "nav.services": "Services",
    "nav.roi": "ROI",
    "nav.projects": "Projects",
    "nav.insights": "Insights",
    "nav.contact": "Contact",
    "nav.getApp": "Get the app",
    "nav.allServices": "All services",
    "cta.call": "Call us",
    "cta.portal": "Client portal",
    "cta.dashboard": "My dashboard",
    "cta.staff": "Staff login",
    "cta.quote": "Request a free site visit",
    "cta.book": "Book my free site visit",
    "chat.title": "Shelco Assistant",
    "chat.subtitle": "Storage advice · Free site visits",
    "chat.open": "Chat with Shelco",
    "chat.placeholder": "Ask about racking, shelving or prices…",
    "chat.empty": "Habari! Ask me anything about racking, shelving or booking a free site visit.",
    "app.title": "Install the Shelco app",
    "app.subtitle":
      "Scan the QR code with your phone camera to install Shelco on your home screen — order, track deliveries, chat with us and get promotions.",
    "app.android": "Android (Chrome)",
    "app.ios": "iPhone (Safari)",
    "form.name": "Your name",
    "form.phone": "Phone number",
    "form.email": "Email (optional)",
    "form.company": "Company (optional)",
    "form.message": "Tell us about your space",
    "form.sent": "Thank you — our team will call you shortly.",
    "faq.title": "Frequently asked questions",
  },
  sw: {
    "nav.about": "Kuhusu",
    "nav.services": "Huduma",
    "nav.roi": "Faida",
    "nav.projects": "Miradi",
    "nav.insights": "Makala",
    "nav.contact": "Mawasiliano",
    "nav.getApp": "Pata app",
    "nav.allServices": "Huduma zote",
    "cta.call": "Tupigie simu",
    "cta.portal": "Lango la mteja",
    "cta.dashboard": "Dashibodi yangu",
    "cta.staff": "Ingia kama mfanyakazi",
    "cta.quote": "Omba ukaguzi bure",
    "cta.book": "Nataka ukaguzi bure",
    "chat.title": "Msaidizi wa Shelco",
    "chat.subtitle": "Ushauri wa hifadhi · Ukaguzi bure",
    "chat.open": "Ongea na Shelco",
    "chat.placeholder": "Uliza kuhusu rack, shelf au bei…",
    "chat.empty": "Habari! Niulize chochote kuhusu rack, shelf au kupanga ukaguzi bure.",
    "app.title": "Sakinisha app ya Shelco",
    "app.subtitle":
      "Scan QR code kwa kamera ya simu yako kusakinisha Shelco kwenye simu — agiza, fuatilia, ongea nasi na upate ofa.",
    "app.android": "Android (Chrome)",
    "app.ios": "iPhone (Safari)",
    "form.name": "Jina lako",
    "form.phone": "Namba ya simu",
    "form.email": "Barua pepe (hiari)",
    "form.company": "Kampuni (hiari)",
    "form.message": "Tueleze kuhusu eneo lako",
    "form.sent": "Asante — timu yetu itakupigia hivi karibuni.",
    "faq.title": "Maswali yanayoulizwa mara kwa mara",
  },
} as const;

export type TranslationKey = keyof (typeof DICT)["en"];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "shelco.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "sw" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback((key: TranslationKey) => DICT[lang][key] ?? DICT.en[key], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
