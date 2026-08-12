# Shelco — AI Agent, App Install, Bilingual Site & Service Landing Pages

Four additions on top of the existing site + CRM + portal.

## 1. Floating AI chat agent

- A floating chat button in the bottom-right corner on every public page, opening a mobile-friendly chat panel (full-screen sheet on phones).
- Powered by Lovable AI with a Shelco-specific system prompt: products, materials (Q235 steel), service areas, Dar es Salaam contact details, pricing guidance, and a "book a site visit" flow.
- The agent can capture a lead mid-conversation (name, phone, service, message) and save it into the CRM quote requests list, so staff see chat leads with existing enquiries.
- One ongoing conversation per visitor, saved in the backend. Signed-in clients keep their history; guests get an anonymous conversation id kept in their browser and linked to their account when they sign in.
- Staff can read chat conversations in a new CRM page.
- Placeholder training content now; you supply the Q&A list later and it drops into the prompt/knowledge without rebuilding.
- Emails and reminders are not in this phase.

## 2. Install-the-app QR code

- The site becomes an installable app (PWA): app name, Shelco icon, splash colours, standalone display, so "Add to Home Screen" gives a real app icon.
- A new "Get the app" section on the homepage and a dedicated page with a QR code that opens the site on the phone plus step-by-step install instructions for Android and iPhone.
- Once installed, the same app gives clients ordering, order tracking, messaging via the agent, and their portal — no separate store app needed.
- Notifications/promotions: this phase ships in-app announcements in the portal. True phone push notifications need a separate messaging setup — flagged as a follow-up.

## 3. Swahili / English toggle

- Language switch in the header (and mobile menu), remembered per visitor.
- All public site copy (header, hero, calculators, about, services, portfolio, testimonials, blog, contact, footer, service pages, chat launcher) available in both English and Swahili.
- CRM/back-office stays English.

## 4. Services submenu + 4 service landing pages, SEO-optimised

- Header "Services" becomes a dropdown (accordion in the mobile menu) listing all four services.
- New pages: `/services` (overview) plus `/services/racking-solutions`, `/services/shelving-solutions`, `/services/general-shelving-racking`, `/services/accessories`.
- Each landing page follows the ad-landing flow: photoreal hero image + calculator, social proof, service description with 3D icons, portfolio examples, FAQ accordion, testimonials, animations, booking form (submits into the CRM as a quote request).
- SEO per page: unique title/description/OG/Twitter tags, single H1, semantic sections, image alt text, canonical, FAQ + Service + LocalBusiness JSON-LD, lazy-loaded images, and a sitemap covering all routes.

## Technical notes

- Chat: TanStack server route `src/routes/api/chat.ts` streaming via the Lovable AI gateway (`google/gemini-3.6-flash`), AI Elements chat UI, `useChat` client. New tables `chat_conversations` and `chat_messages` with RLS (visitor/owner reads own, staff read all), plus a lead-capture tool writing to `quote_requests`.
- PWA: manifest-only home-screen support (`public/manifest.webmanifest`, icons, head tags). QR generated client-side from the published URL.
- i18n: lightweight typed dictionary + context provider in `src/i18n/`, no heavy library; copy extracted from the existing section components.
- Services: shared `service-landing.tsx` template driven by a per-service data file, reusing existing calculator, testimonial, portfolio and motion components; routes under `src/routes/services/`.
- Booking/lead forms write to the existing `quote_requests` table; new CRM page `crm.chats.tsx` and enquiries view for staff.

## Not included

- Real email sending and automated reminders (next phase).
- Phone push notifications (needs a messaging provider).
- App store / native builds.
