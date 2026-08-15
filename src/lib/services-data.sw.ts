import type { Lang } from "@/i18n";
import type { ServiceData, ServiceSlug } from "@/lib/services-data";

type ServiceSw = {
  name: string;
  headline: string;
  subhead: string;
  benefits: { title: string; body: string }[];
  features: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICES_SW: Record<ServiceSlug, ServiceSw> = {
  "racking-solutions": {
    name: "Suluhisho za Rack",
    headline: "Mifumo ya Rack za Paleti kwa Maghala ya Dar es Salaam",
    subhead:
      "Rack za selective, drive-in, cantilever na mezzanine kwa chuma cha Q235 — zinabuniwa, kutengenezwa na kufungwa na Shelco.",
    benefits: [
      {
        title: "Tumia kimo chako chote",
        body: "Rack hubadilisha nafasi ya juu isiyotumika kuwa maelfu ya nafasi za paleti bila kukodi ghala kubwa zaidi.",
      },
      {
        title: "Kurejesha gharama haraka",
        body: "Wateja wengi hurejesha uwekezaji ndani ya mwaka mmoja kwa kuepuka kodi na kuchukua mizigo haraka.",
      },
      {
        title: "Zinafungwa na timu zetu",
        body: "Ukaguzi, michoro, utengenezaji na ufungaji vyote hufanywa na sisi — hakuna mafundi wa nje.",
      },
    ],
    features: [
      "Rack za selective zenye ngazi zinazorekebishwa",
      "Rack za drive-in na double-deep kwa hifadhi ya msongamano mkubwa",
      "Rack za cantilever kwa mabomba, mbao na mizigo mirefu",
      "Sakafu za mezzanine na mifumo ya ngazi nyingi",
      "Ubunifu wenye uwezo wa mzigo uliopimwa na lebo za uwezo",
      "Vifaa vya usalama: kinga za nguzo, mesh deck, viunga vya paleti",
    ],
    faqs: [
      {
        q: "Rack za Shelco zinabeba uzito kiasi gani?",
        a: "Ngazi hubuniwa kulingana na uzito wa paleti zako — kwa kawaida kilo 1,000 hadi 3,500 kwa ngazi. Kila bay huwekwa lebo ya uwezo wake.",
      },
      {
        q: "Mnaweza kufunga rack wakati ghala linaendelea na kazi?",
        a: "Ndiyo. Tunafunga njia kwa njia, ikiwemo usiku na wikendi, ili shughuli zako ziendelee.",
      },
      {
        q: "Mnatoa michoro na mipangilio?",
        a: "Kila nukuu hujumuisha mchoro wa mpangilio unaoonesha nafasi za bay, upana wa njia na nafasi za paleti zinazoongezeka.",
      },
      {
        q: "Mradi wa rack huchukua muda gani?",
        a: "Baada ya ukaguzi wa eneo, miradi ya kawaida hutengenezwa na kufungwa ndani ya wiki 2–4 kutegemea ukubwa.",
      },
    ],
  },
  "shelving-solutions": {
    name: "Suluhisho za Shelf",
    headline: "Shelf za Maduka na Gondola kwa Maduka na Supermarket",
    subhead:
      "Onesha bidhaa nyingi zaidi, zipange vizuri na uuze haraka kwa shelf za gondola, ukutani na end-cap za Shelco.",
    benefits: [
      {
        title: "Nafasi zaidi za bidhaa kwa kila mita",
        body: "Mipangilio bora ya gondola na nafasi kati ya shelf hukuwezesha kuonesha bidhaa nyingi zaidi katika duka lilelile.",
      },
      {
        title: "Zimejengwa kwa shughuli za duka",
        body: "Chuma chenye rangi ya powder-coat kinachostahimili kujaza kila siku, matoroli na unyevu wa pwani.",
      },
      {
        title: "Ufungaji wa haraka wa duka",
        body: "Shelf za kawaida huletwa na kufungwa ndani ya siku chache, ili ufungue kwa wakati.",
      },
    ],
    features: [
      "Gondola za upande mmoja na pande mbili",
      "Shelf za ukutani, end cap na sehemu za matangazo",
      "Ngazi zinazorekebishwa, reli za bei na vigawanyo",
      "Mipangilio ya famasi, maduka ya vifaa na supermarket",
      "Shelf za stoo zinazoendana na duka",
      "Rangi maalum zinazolingana na chapa yako",
    ],
    faqs: [
      {
        q: "Shelf zinaweza kuwa na rangi za chapa yetu?",
        a: "Ndiyo — paneli na nguzo zinaweza kupakwa rangi ya chapa yako kwa ombi.",
      },
      {
        q: "Mnafanya mipangilio kamili ya duka?",
        a: "Tunabuni mpangilio kamili: mtiririko wa njia, safu za gondola, end cap na kaunta za malipo.",
      },
      {
        q: "Shelf zinarekebishika?",
        a: "Ngazi zote hurekebishwa kwa nafasi ya mm 25–50 ili upange upya bidhaa wakati wowote.",
      },
      {
        q: "Mnasambaza nje ya Dar es Salaam?",
        a: "Ndiyo, tunasafirisha na kufunga nchi nzima ikiwemo Arusha, Mwanza, Dodoma na Mbeya.",
      },
    ],
  },
  "general-shelving-racking": {
    name: "Shelf na Rack za Kawaida",
    headline: "Shelf Zisizo na Bolti kwa Ofisi, Karakana, Stoo na Nyumbani",
    subhead:
      "Shelf imara na za bei nafuu za slotted-angle na boltless zinazounganishwa kwa dakika chache na kubeba uzito halisi.",
    benefits: [
      {
        title: "Panga kila stoo",
        body: "Badilisha marundo ya sakafu kuwa ngazi safi, zenye lebo na rahisi kutafuta.",
      },
      {
        title: "Bei nafuu kwa kila shelf",
        body: "Gharama ndogo zaidi kwa kila ngazi ya hifadhi — bora kwa nyaraka na vipuri.",
      },
      {
        title: "Zinaungwa kwa dakika",
        body: "Muundo usio na bolti — hakuna kulehemu wala zana maalum; hamisha au ongeza wakati wowote.",
      },
    ],
    features: [
      "Shelf za rivet zisizo na bolti zenye ngazi 4–6",
      "Shelf za slotted-angle zinazokatwa kwa vipimo vyako",
      "Shelf za nyaraka na mafaili kwa ofisi",
      "Shelf za karakana na vipuri zenye vibox",
      "Shelf za gereji, jikoni na duka la nyumbani",
      "Umaliziaji wa galvanized au rangi ya powder-coat",
    ],
    faqs: [
      {
        q: "Ngazi moja hubeba kiasi gani?",
        a: "Vipande vya kawaida hubeba kilo 150–350 kwa ngazi, kutegemea upana na aina ya ubao.",
      },
      {
        q: "Naweza kupata vipimo maalum?",
        a: "Ndiyo — tunatengeneza kulingana na vipimo vya chumba chako, ikiwemo pembe na chini ya ngazi.",
      },
      {
        q: "Mnauza kipande kimoja?",
        a: "Tunauza kuanzia kipande kimoja cha nyumbani au duka hadi mamia kwa ghala.",
      },
      {
        q: "Ufungaji umejumuishwa?",
        a: "Usafirishaji na ufungaji ndani ya Dar es Salaam vinaweza kujumuishwa kwenye nukuu yako.",
      },
    ],
  },
  accessories: {
    name: "Vifaa vya Ziada",
    headline: "Vifaa vya Rack, Vipuri na Vifaa vya Usalama",
    subhead:
      "Mesh deck, viunga vya paleti, kinga za nguzo, mihimili na vigawanyo — weka mfumo wako salama na wenye tija.",
    benefits: [
      {
        title: "Hifadhi mizigo migumu",
        body: "Mesh deck na viunga vya paleti hukuwezesha kuhifadhi katoni, madumu na bidhaa zisizo na umbo maalum kwa usalama.",
      },
      {
        title: "Linda uwekezaji wako",
        body: "Kinga za nguzo na vizuizi huzuia uharibifu wa forklift ambao hugharimu zaidi kurekebisha.",
      },
      {
        title: "Vinapatikana papo hapo",
        body: "Mihimili, deck na vifaa vya kawaida vipo stoo kwa kuchukua au kuletewa haraka.",
      },
    ],
    features: [
      "Mihimili ya box na viunganishi kwa urefu wote wa kawaida",
      "Mesh deck za waya na paneli za mbao",
      "Viunga vya paleti na vishikilio vya madumu",
      "Kinga za nguzo, vizuizi vya mwisho wa njia na bollard",
      "Vigawanyo vya shelf, vibox na vishikilio vya lebo",
      "Alama za uwezo wa mzigo na ukaguzi wa usalama",
    ],
    faqs: [
      {
        q: "Vifaa vyenu vinaendana na rack za chapa nyingine?",
        a: "Vingi vinaendana — tutumie picha na vipimo vya mihimili nasi tutathibitisha.",
      },
      {
        q: "Mnaweza kukagua rack zetu zilizopo?",
        a: "Ndiyo, tunafanya ukaguzi wa usalama na kutoa vipuri vinavyohitajika.",
      },
      {
        q: "Mesh deck ni salama dhidi ya moto?",
        a: "Mesh deck hupendelewa kwa mifumo ya sprinkler kwa sababu maji hupita ndani yake.",
      },
      {
        q: "Mnasafirisha oda ndogo?",
        a: "Ndiyo, vifaa vinaweza kuchukuliwa Changombe au kuletwa popote Tanzania.",
      },
    ],
  },
};

export function localizeService(service: ServiceData, lang: Lang): ServiceData {
  if (lang !== "sw") return service;
  const sw = SERVICES_SW[service.slug];
  return {
    ...service,
    name: sw.name,
    headline: sw.headline,
    subhead: sw.subhead,
    benefits: service.benefits.map((b, i) => ({
      icon: b.icon,
      title: sw.benefits[i]?.title ?? b.title,
      body: sw.benefits[i]?.body ?? b.body,
    })),
    features: sw.features,
    faqs: sw.faqs,
  };
}
