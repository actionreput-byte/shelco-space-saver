# Shelco Storage Systems — Mobile-First Marketing Site

A single-page, mobile-first site for SHELCO STORAGE SYSTEMS LTD (Dar es Salaam), styled from the logo: orange (#EE5B2B-family) as primary, slate navy (#4A5A7A-family) as secondary, on clean white/light-grey surfaces. Heavy but tasteful animation throughout, 3D-style icons, and photoreal warehouse imagery.

## Sections (in order, mobile-first)

1. **Header** — Shelco logo (uploaded file, hosted as an app asset), compact nav that collapses into a slide-in mobile menu, click-to-call CTA.
2. **Hero + Shelving Capacity Calculator** — headline "Efficient Storage. Maximum Space Utilization.", photoreal warehouse racking background with animated overlay. The calculator sits directly in the hero: inputs for warehouse length, width, ceiling height, aisle width, pallet/shelf type (pallet racking / gondola shelving / boltless rack). Outputs: usable floor area, number of bays, pallet/shelf positions, and storage volume — animated counters that update live.
3. **Social proof strip** (after hero) — animated stat counters (projects delivered, pallet positions installed, years in Dar es Salaam, repeat-client rate).
4. **About Us** — the blue-box copy, with the three pillars (Optimize Space, Maximize ROI, Save Time) as 3D icon cards.
5. **Social proof strip** — short trust line + rating.
6. **Services** — four cards with 3D icons and the exact provided copy: Racking Solutions, Shelving Solutions, General Shelving & Racking, Accessories. Each with a photoreal image.
7. **Social proof strip.**
8. **ROI Calculator** — inputs: current monthly rent/sqm, warehouse area, estimated system investment, extra capacity gained (auto-suggested from the hero calculator). Outputs: added storage value per month, payback period in months, 3-year ROI %, animated bar visual.
9. **Social proof strip.**
10. **Portfolio** — anonymised project cards ("Beverage Distributor, Kurasini", "Retail Chain, Kariakoo") with photoreal install photos, scope, and result metrics. No company names.
11. **Testimonials carousel** — swipeable, auto-advancing, with generated photoreal portraits of African clients (Tanzanian business context), name-initial + role + area only.
12. **Social proof strip.**
13. **Blog** — 4 storage/warehousing articles rendered as a 2-column grid on mobile (2 rows x 2 cards), wider on desktop. Cards only (no article routes) unless you want full posts.
14. **Contact** — address (Changombe, Mwakalinga Road), P.O. Box 100053, both phone numbers as tap-to-call, both emails, embedded map link, and a quote request form (front-end only for now).
15. **Footer** — logo, quick links, contact, copyright.

## Animations

Scroll-reveal on every section, staggered card entries, animated number counters in both calculators and stat strips, parallax hero, hover/tap lift on cards, marquee for the logo/trust strip, and a swipe-enabled carousel. Motion respects `prefers-reduced-motion`.

## Technical notes

- TanStack Start; the whole page replaces `src/routes/index.tsx`. Route-level SEO head with Shelco-specific title/description/OG tags.
- Design tokens (orange/navy palette, radii, shadows, gradients) defined in `src/styles.css` as semantic tokens — no hardcoded colors in components.
- Animation via `motion` (Motion for React) plus CSS keyframes; carousel via embla (already available through shadcn carousel).
- Both calculators are pure client-side math in small typed helper modules, no backend.
- The logo is uploaded to CDN via lovable-assets and imported as a pointer.
- 3D icons and photoreal imagery are generated as image assets (isometric 3D icon set in brand colors; warehouse/racking photography; testimonial portraits).
- Components split into `src/components/shelco/*` — one file per section.

## Not included (say the word to add)

- Backend for the contact form (no email delivery yet — submissions show a success state only).
- Individual blog article pages.
- Multi-language (Swahili) support.
