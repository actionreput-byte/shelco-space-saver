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

const EN = {
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
  "nav.shop": "Shop",
  "shop.all": "All products",
  "shop.eyebrow": "Shop",
  "shop.title": "Our products & prices",
  "shop.subtitle":
    "Warehouse racks, supermarket shelving and accessories in stock in Dar es Salaam. All prices VAT inclusive with free site survey and installation in Dar es Salaam.",
  "shop.order": "Order now",
  "shop.vat": "VAT inclusive",
  "calc.title": "Shelving capacity calculator",
  "calc.subtitle": "Estimate what your space can really hold.",
  "calc.length": "Length (m)",
  "calc.width": "Width (m)",
  "calc.height": "Clear height (m)",
  "calc.aisle": "Aisle width (m)",
  "calc.units": "units needed",
  "calc.levels": "levels high",
  "calc.load": "kg total load",
  "calc.price": "Indicative price",
  "calc.positions": "shelf levels",
  "calc.sys.pallet": "Medium duty rack (2 m)",
  "calc.sys.gondola": "Supermarket shelving",
  "calc.sys.boltless": "Light duty rack (1 m)",
  "calc.footnote": "Floor area {area} m² · {util}% covered by racking with {rows} rows.",

  // Hero
  "hero.badge": "Dar es Salaam · Since day one",
  "hero.title1": "Efficient Storage.",
  "hero.title2": "Maximum Space Utilisation.",
  "hero.sub":
    "Dexion-style racking and boltless shelving engineered in high grade Q235 steel — from a single shelf at home to a full warehouse pallet racking system.",
  "hero.cta": "Get a free space audit",
  "hero.imgAlt": "Warehouse interior with tall steel pallet racking loaded with palletised cargo",

  // About
  "about.eyebrow": "About us",
  "about.title": "About Shelco Storage Systems",
  "about.desc":
    "Our mission is simple: to deliver efficient storage and maximise space utilisation. We partner with you to organise and store your products in the most cost-effective way possible.",
  "about.p1.title": "Optimising space",
  "about.p1.body":
    "We help you make the most of your available square footage, allowing you to store more inventory.",
  "about.p2.title": "Maximising ROI",
  "about.p2.body":
    "By utilising your space efficiently, we ensure you get a better return on your investment.",
  "about.p3.title": "Saving time",
  "about.p3.body":
    "Organised systems give easy access to materials, streamlining operations and saving valuable time.",
  "about.note":
    "From a single shelf in your home to a complex pallet racking system in a large warehouse, we provide the perfect solution for any storage need — designed, delivered and installed from Changombe, Dar es Salaam.",

  // Services
  "services.eyebrow": "Services",
  "services.title": "Storage systems built in Q235 steel",
  "services.desc":
    "Four core solution families, engineered for Tanzanian warehouses, retail floors, workshops and homes.",
  "services.s1.title": "Racking Solutions",
  "services.s1.body":
    "Our racking systems are Dexion style, manufactured with high-grade Q235 steel and feature a robust boltless design. This makes them ideal for heavy-duty applications, such as storing palletized cargo in large warehouses, ensuring stability and durability.",
  "services.s2.title": "Shelving Solutions",
  "services.s2.body":
    "Our commercial gondola shelving is a versatile boltless system, perfectly suited for small to medium merchandising needs. It provides an organized and attractive way to display goods, making it an excellent choice for retail outlets and supermarkets.",
  "services.s3.title": "General Shelving & Racking",
  "services.s3.body":
    "We provide racking and shelving solutions for every walk of life — from a basic metal shelf for books and files at home or the office, to slotted angle racks for the garage, boltless metal racks for retail outlets and heavy-duty pallet racks for warehouses.",
  "services.s4.title": "Accessories",
  "services.s4.body":
    "We stock a wide range of high-quality racking, supermarket and related accessories to complement your storage system.",

  // Portfolio
  "portfolio.eyebrow": "Selected projects",
  "portfolio.title": "Installations across Dar es Salaam",
  "portfolio.desc":
    "Client names are withheld for confidentiality. The steel, the layouts and the results are all ours.",
  "portfolio.p1.sector": "Beverage distributor",
  "portfolio.p1.scope": "Heavy-duty Dexion-style pallet racking, 6 levels high",
  "portfolio.p1.result": "+68% pallet positions in the same footprint",
  "portfolio.p2.sector": "Retail supermarket chain",
  "portfolio.p2.scope": "Boltless gondola shelving across three trading floors",
  "portfolio.p2.result": "Restock time cut by roughly a third",
  "portfolio.p3.sector": "Spare parts importer",
  "portfolio.p3.scope": "Slotted angle and boltless metal racks with bin locations",
  "portfolio.p3.result": "Order picking accuracy up, searching almost eliminated",

  // Testimonials
  "testi.eyebrow": "Client voices",
  "testi.title": "Trusted by businesses across Tanzania",
  "testi.t1.role": "Operations Director, beverage distribution",
  "testi.t1.quote":
    "Shelco redesigned our whole warehouse layout. We now hold almost 70% more pallets in the same building, and the racking has not moved a millimetre since installation.",
  "testi.t2.role": "Retail Manager, supermarket group",
  "testi.t2.quote":
    "The gondola shelving transformed our shop floor. Products display beautifully, restocking is faster, and our customers can finally find everything.",
  "testi.t3.role": "Warehouse Manager, spare parts",
  "testi.t3.quote":
    "From the site survey to installation the team was professional. The steel quality is genuinely heavy duty — exactly what we needed for engine parts.",

  // Blog
  "blog.eyebrow": "Insights",
  "blog.title": "Storage know-how from our engineers",
  "blog.desc":
    "Practical guidance for warehouse, retail and workshop operators in Tanzania.",
  "blog.read": "min read",
  "blog.b1.tag": "Space planning",
  "blog.b1.title": "Stop paying rent for empty air above your racking",
  "blog.b2.tag": "Safety",
  "blog.b2.title": "The racking inspection checklist every warehouse needs",
  "blog.b3.tag": "Retail",
  "blog.b3.title": "Gondola shelving layouts that lift shop-floor sales",
  "blog.b4.tag": "Design",
  "blog.b4.title": "Aisle width: the number that decides your capacity",

  // Contact
  "contact.eyebrow": "Contact",
  "contact.title": "Request a free storage assessment",
  "contact.desc":
    "Tell us about your space and we will size the right racking or shelving system for it.",
  "contact.maps": "Open in Maps",
  "contact.need": "What do you need to store?",
  "contact.send": "Send request",
  "contact.sentBtn": "Request sent",
  "contact.note": "Prefer to talk? Call +255-767-224466 — we answer during working hours.",
  "contact.toast": "Request received",
  "contact.toastDesc": "Our team will call you back from Changombe shortly.",

  // ROI
  "roi.eyebrow": "ROI calculator",
  "roi.title": "See what better space utilisation pays back",
  "roi.desc": "Model the payback of a Shelco racking or shelving installation before you commit.",
  "roi.descWith":
    "Based on your capacity estimate of {n} storage positions, most sites unlock 40–70% more usable capacity.",
  "roi.rent": "Rent per m² / month (TZS)",
  "roi.area": "Facility area (m²)",
  "roi.investment": "System investment (TZS)",
  "roi.labour": "Monthly handling labour (TZS)",
  "roi.gain": "Extra capacity unlocked",
  "roi.projected": "Your projected return",
  "roi.monthly": "Monthly benefit",
  "roi.payback": "Payback",
  "roi.months": "mo",
  "roi.net3": "3-year net gain",
  "roi.roi3": "3-year ROI",
  "roi.note":
    "Space saving {space}/month plus handling saving {labour}/month against rent of {rent}/month.",

  // Stats
  "stats.installs": "Installations delivered",
  "stats.positions": "Pallet positions built",
  "stats.years": "Years in Dar es Salaam",
  "stats.repeat": "Clients who order again",

  // Sectors
  "sector.warehousing": "Warehousing",
  "sector.supermarkets": "Supermarkets",
  "sector.pharma": "Pharmaceuticals",
  "sector.spares": "Spare parts",
  "sector.logistics": "Logistics",
  "sector.manufacturing": "Manufacturing",
  "sector.cold": "Cold chain",
  "sector.hardware": "Hardware retail",

  // Social proof
  "sp1.quote":
    "Warehouse, retail and workshop operators across Tanzania rely on Shelco steel every day.",
  "sp1.label": "Projects installed",
  "sp2.quote": "Rated 4.9 out of 5 by clients for build quality, fitting and after-sales support.",
  "sp2.label": "Average client rating",
  "sp3.quote":
    "Every system is manufactured in high-grade Q235 steel and installed by our own fitting teams.",
  "sp3.label": "In-house installation",
  "sp4.quote": "Clients typically recover their investment within the first year of operation.",
  "sp4.label": "Typical payback",
  "sp5.quote": "From a single home shelf to a full warehouse fit-out — same engineering standard.",
  "sp5.label": "Pallet positions built",

  // Footer
  "footer.tagline": "Efficient storage and maximum space utilisation for Tanzanian businesses.",
  "footer.explore": "Explore",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved.",
  "footer.qr": "Install the app",
  "footer.qrHint": "Scan to install Shelco on your phone",
  "footer.qrLink": "Installation guide",

  // Service landing shared copy
  "svc.calcTitle": "Free capacity calculator",
  "svc.positions": "Positions",
  "svc.bays": "Bays",
  "svc.volume": "m³ storage",
  "svc.layoutCta": "Get my exact layout",
  "svc.freeVisit": "Free site visit",
  "svc.bookEyebrow": "Book now",
  "svc.bookTitle": "Request your free site visit",
  "svc.sending": "Sending…",
  "svc.error": "Could not send. Please call +255 767 224 466.",
  "svc.whatEyebrow": "What you get",
  "svc.whatTitle": "{name} built for Tanzanian conditions",
  "svc.whatDesc": "Manufactured in high-grade Q235 steel, powder-coated and installed by our own fitting teams.",
  "svc.faqEyebrow": "FAQ",
  "svc.more": "Looking for something else?",
  "svc.seeAll": "See all Shelco services",
  "svc.benefits": "Why clients choose this",
  "svc.included": "What is included",
  "svc.projects": "Recent installations",
  "svc.book": "Book your free site visit",
  "svc.bookDesc": "Send your details and our team will call you back from Changombe.",
} as const;

const SW: Record<keyof typeof EN, string> = {
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
  "nav.shop": "Duka",
  "shop.all": "Bidhaa zote",
  "shop.eyebrow": "Duka",
  "shop.title": "Bidhaa na bei zetu",
  "shop.subtitle":
    "Rack za ghala, shelf za maduka na vifaa vinapatikana Dar es Salaam. Bei zote ni pamoja na VAT, ukaguzi wa eneo na ufungaji ni bure ndani ya Dar es Salaam.",
  "shop.order": "Agiza sasa",
  "shop.vat": "Bei ni pamoja na VAT",
  "calc.title": "Kikokotoo cha uwezo wa hifadhi",
  "calc.subtitle": "Kadiria eneo lako linaweza kubeba kiasi gani.",
  "calc.length": "Urefu (m)",
  "calc.width": "Upana (m)",
  "calc.height": "Kimo cha wazi (m)",
  "calc.aisle": "Upana wa njia (m)",
  "calc.units": "vipande vinavyohitajika",
  "calc.levels": "ngazi kwenda juu",
  "calc.load": "kilo jumla ya mzigo",
  "calc.price": "Makadirio ya bei",
  "calc.positions": "ngazi za shelf",
  "calc.sys.pallet": "Rack ya wastani (2 m)",
  "calc.sys.gondola": "Shelf za duka",
  "calc.sys.boltless": "Rack nyepesi (1 m)",
  "calc.footnote": "Eneo la sakafu {area} m² · {util}% limefunikwa na rack kwa safu {rows}.",

  "hero.badge": "Dar es Salaam · Tangu siku ya kwanza",
  "hero.title1": "Hifadhi Bora.",
  "hero.title2": "Matumizi Makubwa ya Nafasi.",
  "hero.sub":
    "Rack za mtindo wa Dexion na shelf zisizo na bolti, zilizotengenezwa kwa chuma bora cha Q235 — kutoka shelf moja nyumbani hadi mfumo kamili wa rack za ghala.",
  "hero.cta": "Pata ukaguzi wa nafasi bure",
  "hero.imgAlt": "Ndani ya ghala lenye rack ndefu za chuma zilizojaa mizigo ya paleti",

  "about.eyebrow": "Kuhusu sisi",
  "about.title": "Kuhusu Shelco Storage Systems",
  "about.desc":
    "Dhamira yetu ni rahisi: kutoa hifadhi bora na kuongeza matumizi ya nafasi. Tunashirikiana nawe kupanga na kuhifadhi bidhaa zako kwa gharama nafuu zaidi.",
  "about.p1.title": "Kuboresha nafasi",
  "about.p1.body":
    "Tunakusaidia kutumia vizuri kila mita ya eneo lako, ili uweze kuhifadhi bidhaa nyingi zaidi.",
  "about.p2.title": "Kuongeza faida",
  "about.p2.body":
    "Kwa kutumia nafasi yako kwa ufanisi, tunahakikisha unapata marejesho bora ya uwekezaji wako.",
  "about.p3.title": "Kuokoa muda",
  "about.p3.body":
    "Mifumo iliyopangwa hurahisisha kufikia bidhaa, kuharakisha kazi na kuokoa muda muhimu.",
  "about.note":
    "Kuanzia shelf moja nyumbani hadi mfumo mkubwa wa rack za paleti kwenye ghala kubwa, tunatoa suluhisho sahihi kwa hitaji lolote la hifadhi — tunabuni, tunaleta na kufunga kutoka Changombe, Dar es Salaam.",

  "services.eyebrow": "Huduma",
  "services.title": "Mifumo ya hifadhi iliyotengenezwa kwa chuma cha Q235",
  "services.desc":
    "Familia nne kuu za suluhisho, zilizoundwa kwa maghala, maduka, karakana na nyumba za Tanzania.",
  "services.s1.title": "Suluhisho za Rack",
  "services.s1.body":
    "Rack zetu ni za mtindo wa Dexion, zimetengenezwa kwa chuma bora cha Q235 na hazihitaji bolti. Hii inazifanya bora kwa mizigo mizito, kama vile kuhifadhi mizigo ya paleti kwenye maghala makubwa, zikihakikisha uimara na udumu.",
  "services.s2.title": "Suluhisho za Shelf",
  "services.s2.body":
    "Shelf zetu za biashara (gondola) hazihitaji bolti na zinafaa kwa maduka madogo hadi ya kati. Hutoa njia nzuri na yenye mpangilio wa kuonesha bidhaa, hivyo ni chaguo bora kwa maduka na supermarket.",
  "services.s3.title": "Shelf na Rack za Kawaida",
  "services.s3.body":
    "Tunatoa rack na shelf kwa kila mahitaji — kuanzia shelf ndogo ya vitabu na mafaili nyumbani au ofisini, rack za angle kwa gereji, rack za chuma zisizo na bolti kwa maduka hadi rack nzito za paleti kwa maghala.",
  "services.s4.title": "Vifaa vya Ziada",
  "services.s4.body":
    "Tunauza vifaa mbalimbali bora vya rack, maduka makubwa na vinginevyo ili kukamilisha mfumo wako wa hifadhi.",

  "portfolio.eyebrow": "Miradi teule",
  "portfolio.title": "Ufungaji kote Dar es Salaam",
  "portfolio.desc":
    "Majina ya wateja hayatajwi kwa usiri. Chuma, mipangilio na matokeo ni kazi yetu.",
  "portfolio.p1.sector": "Msambazaji wa vinywaji",
  "portfolio.p1.scope": "Rack nzito za mtindo wa Dexion, ngazi 6 kwenda juu",
  "portfolio.p1.result": "Ongezeko la 68% la nafasi za paleti katika eneo lilelile",
  "portfolio.p2.sector": "Mnyororo wa maduka makubwa",
  "portfolio.p2.scope": "Shelf za gondola zisizo na bolti kwenye ghorofa tatu za mauzo",
  "portfolio.p2.result": "Muda wa kujaza bidhaa umepungua takribani theluthi moja",
  "portfolio.p3.sector": "Mwagizaji wa vipuri",
  "portfolio.p3.scope": "Rack za angle na za chuma zisizo na bolti zenye maeneo ya vibox",
  "portfolio.p3.result": "Usahihi wa kuchukua oda umeongezeka, utafutaji umekwisha",

  "testi.eyebrow": "Sauti za wateja",
  "testi.title": "Tunaaminiwa na biashara kote Tanzania",
  "testi.t1.role": "Mkurugenzi wa Uendeshaji, usambazaji wa vinywaji",
  "testi.t1.quote":
    "Shelco walibuni upya mpangilio wa ghala letu lote. Sasa tunahifadhi karibu paleti 70% zaidi katika jengo lilelile, na rack hazijasogea hata milimita tangu zifungwe.",
  "testi.t2.role": "Meneja wa Duka, kundi la supermarket",
  "testi.t2.quote":
    "Shelf za gondola zimebadilisha duka letu. Bidhaa zinaonekana vizuri, kujaza ni haraka, na wateja wetu sasa wanapata kila kitu kwa urahisi.",
  "testi.t3.role": "Meneja wa Ghala, vipuri",
  "testi.t3.quote":
    "Kuanzia ukaguzi wa eneo hadi ufungaji timu ilikuwa ya kitaalamu. Ubora wa chuma ni wa kweli wa kazi nzito — ndicho tulichohitaji kwa vipuri vya injini.",

  "blog.eyebrow": "Makala",
  "blog.title": "Maarifa ya hifadhi kutoka kwa wahandisi wetu",
  "blog.desc": "Mwongozo wa vitendo kwa waendeshaji wa maghala, maduka na karakana Tanzania.",
  "blog.read": "dakika kusoma",
  "blog.b1.tag": "Upangaji wa nafasi",
  "blog.b1.title": "Acha kulipa kodi kwa hewa tupu juu ya rack zako",
  "blog.b2.tag": "Usalama",
  "blog.b2.title": "Orodha ya ukaguzi wa rack kila ghala linahitaji",
  "blog.b3.tag": "Maduka",
  "blog.b3.title": "Mipangilio ya shelf za gondola inayoongeza mauzo dukani",
  "blog.b4.tag": "Ubunifu",
  "blog.b4.title": "Upana wa njia: namba inayoamua uwezo wako",

  "contact.eyebrow": "Mawasiliano",
  "contact.title": "Omba tathmini ya hifadhi bure",
  "contact.desc":
    "Tueleze kuhusu eneo lako nasi tutakupimia mfumo sahihi wa rack au shelf.",
  "contact.maps": "Fungua kwenye Ramani",
  "contact.need": "Unahitaji kuhifadhi nini?",
  "contact.send": "Tuma ombi",
  "contact.sentBtn": "Ombi limetumwa",
  "contact.note":
    "Unapendelea kuongea? Piga +255-767-224466 — tunapokea simu wakati wa kazi.",
  "contact.toast": "Ombi limepokelewa",
  "contact.toastDesc": "Timu yetu itakupigia simu kutoka Changombe hivi karibuni.",

  "roi.eyebrow": "Kikokotoo cha faida",
  "roi.title": "Ona matumizi bora ya nafasi yanavyolipa",
  "roi.desc": "Kadiria marejesho ya ufungaji wa rack au shelf za Shelco kabla ya kuamua.",
  "roi.descWith":
    "Kwa makadirio yako ya nafasi {n} za hifadhi, maeneo mengi hupata ongezeko la 40–70% la uwezo unaotumika.",
  "roi.rent": "Kodi kwa m² / mwezi (TZS)",
  "roi.area": "Eneo la jengo (m²)",
  "roi.investment": "Uwekezaji wa mfumo (TZS)",
  "roi.labour": "Gharama ya vibarua kwa mwezi (TZS)",
  "roi.gain": "Uwezo wa ziada unaopatikana",
  "roi.projected": "Marejesho yanayotarajiwa",
  "roi.monthly": "Faida ya mwezi",
  "roi.payback": "Kurejesha gharama",
  "roi.months": "miezi",
  "roi.net3": "Faida halisi ya miaka 3",
  "roi.roi3": "Faida ya miaka 3",
  "roi.note":
    "Kuokoa nafasi {space}/mwezi pamoja na kuokoa vibarua {labour}/mwezi dhidi ya kodi ya {rent}/mwezi.",

  "stats.installs": "Ufungaji uliokamilika",
  "stats.positions": "Nafasi za paleti zilizojengwa",
  "stats.years": "Miaka Dar es Salaam",
  "stats.repeat": "Wateja wanaorudi kuagiza",

  "sector.warehousing": "Maghala",
  "sector.supermarkets": "Maduka makubwa",
  "sector.pharma": "Dawa",
  "sector.spares": "Vipuri",
  "sector.logistics": "Usafirishaji",
  "sector.manufacturing": "Viwanda",
  "sector.cold": "Hifadhi ya baridi",
  "sector.hardware": "Maduka ya vifaa",

  "sp1.quote":
    "Waendeshaji wa maghala, maduka na karakana kote Tanzania hutegemea chuma cha Shelco kila siku.",
  "sp1.label": "Miradi iliyofungwa",
  "sp2.quote": "Tumepewa 4.9 kati ya 5 na wateja kwa ubora, ufungaji na huduma baada ya mauzo.",
  "sp2.label": "Wastani wa alama za wateja",
  "sp3.quote":
    "Kila mfumo hutengenezwa kwa chuma bora cha Q235 na kufungwa na timu zetu wenyewe.",
  "sp3.label": "Ufungaji wa ndani",
  "sp4.quote": "Wateja hurejesha uwekezaji wao ndani ya mwaka wa kwanza wa matumizi.",
  "sp4.label": "Muda wa kawaida wa kurejesha",
  "sp5.quote": "Kuanzia shelf moja ya nyumbani hadi ghala kamili — kiwango kilekile cha uhandisi.",
  "sp5.label": "Nafasi za paleti zilizojengwa",

  "footer.tagline": "Hifadhi bora na matumizi makubwa ya nafasi kwa biashara za Tanzania.",
  "footer.explore": "Vinjari",
  "footer.contact": "Mawasiliano",
  "footer.rights": "Haki zote zimehifadhiwa.",
  "footer.qr": "Sakinisha app",
  "footer.qrHint": "Scan kusakinisha Shelco kwenye simu yako",
  "footer.qrLink": "Mwongozo wa usakinishaji",

  "svc.calcTitle": "Kikokotoo cha uwezo bure",
  "svc.positions": "Nafasi",
  "svc.bays": "Bay",
  "svc.volume": "m³ hifadhi",
  "svc.layoutCta": "Nipatie mpangilio kamili",
  "svc.freeVisit": "Ukaguzi bure",
  "svc.bookEyebrow": "Agiza sasa",
  "svc.bookTitle": "Omba ukaguzi wako wa eneo bure",
  "svc.sending": "Inatuma…",
  "svc.error": "Imeshindikana kutuma. Tafadhali piga +255 767 224 466.",
  "svc.whatEyebrow": "Unachopata",
  "svc.whatTitle": "{name} zilizojengwa kwa mazingira ya Tanzania",
  "svc.whatDesc": "Zimetengenezwa kwa chuma bora cha Q235, zimepakwa rangi ya powder-coat na kufungwa na timu zetu wenyewe.",
  "svc.faqEyebrow": "Maswali",
  "svc.more": "Unatafuta kitu kingine?",
  "svc.seeAll": "Ona huduma zote za Shelco",
  "svc.benefits": "Kwa nini wateja huchagua hii",
  "svc.included": "Kinachojumuishwa",
  "svc.projects": "Ufungaji wa hivi karibuni",
  "svc.book": "Panga ukaguzi wako bure",
  "svc.bookDesc": "Tuma taarifa zako na timu yetu itakupigia kutoka Changombe.",
};

const DICT = { en: EN, sw: SW } as const;

export type TranslationKey = keyof typeof EN;

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "shelco.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "sw" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let out: string = DICT[lang][key] ?? EN[key];
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.replaceAll(`{${k}}`, String(v));
        }
      }
      return out;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
