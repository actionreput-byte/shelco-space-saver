# Shelco Portal & CRM — Phase 1: Accounts + CRM Core

Phase 1 builds the backend foundation: real accounts, roles and permissions, and the owner's CRM for clients, products/stock, orders, invoices and files. The marketing side stays as it is for now; service landing pages, Swahili, and the AI chatbot follow in later phases (outlined at the end).

This requires enabling Lovable Cloud (database, logins, file storage, server code) — I'll turn it on as the first step.

## Accounts and access

Three kinds of users, one sign-up entry point on the site header ("Client portal" / "Staff login"):

- **Client** — self-registers, sees only their own orders, invoices, files and quote requests.
- **Employee** — created/invited by the owner, sees the CRM areas the owner grants.
- **Owner/Admin** — full access, manages staff and their permissions.

Roles live in a dedicated roles table (never on the profile), enforced in the database so a client can never read another client's data, and staff pages are gated both in the UI and on the server.

Permissions the owner can toggle per employee: clients, orders, products & stock, invoices, files, settings — each read-only or full.

## Owner CRM (staff area)

- **Dashboard** — open orders, unpaid invoices, low-stock alerts, new client registrations, recent activity.
- **Clients** — company/contact details, status (lead, active, dormant, blocked), notes, linked orders/invoices/files; search and filter.
- **Products & materials** — catalogue (racking, shelving, accessories) with SKU, unit, price, stock on hand, reorder level; stock movements in/out with a running balance and low-stock flags.
- **Orders** — create an order for a client with line items pulled from the catalogue, quantities and prices, auto totals, status pipeline (quote → confirmed → in production → installed → closed), delivery/site notes, and a timeline of status changes.
- **Invoices** — generate an invoice from an order, sequential numbering, VAT line, download as PDF, mark paid/partially paid/overdue. No online payment in this phase.
- **Files** — upload/download documents per client or order (drawings, site photos, signed quotes, delivery notes), with size/type limits.
- **Team** — invite employees, set their permissions, deactivate accounts.

## Client portal

- Register / log in, complete company profile.
- Track orders: current stage, expected dates, order history.
- View and download invoices (PDF) and files shared by Shelco.
- Submit a quote request that lands directly in the CRM as a lead.
- Automatic email confirmations on registration, quote received, order status change, and new invoice — sent through Lovable's built-in email (no external account needed; the client's domain gets verified when they're ready).

## Technical notes

- Lovable Cloud provides Postgres, auth, storage and server functions. All CRM reads/writes go through authenticated server functions with row-level security; staff routes live under a protected layout, client portal routes under the same gate with role-based redirects.
- Tables: `profiles`, `user_roles`, `staff_permissions`, `clients`, `products`, `stock_movements`, `orders`, `order_items`, `order_events`, `invoices`, `files` (metadata) + a private storage bucket for the actual files.
- Invoice PDFs are generated client-side from a branded HTML template, matching the site's orange/navy identity.
- Emails use Lovable's app-email templates, branded to match the site.
- The CRM UI reuses the existing design tokens and shadcn components, and is fully usable on a phone.

## Later phases (after this one is approved and working)

- **Phase 2** — five service landing pages (Racking Solutions, Shelving Solutions, General Shelving & Racking, Accessories, Warehouse Design & Consulting), each ad-ready: hero image + calculator, social proof, service description, portfolio, FAQ, testimonials, animations, booking form that writes into the CRM.
- **Phase 3** — English/Swahili language switch across the whole site and portal.
- **Phase 4** — AI chatbot that answers client questions, captures leads into the CRM, sends emails and schedules reminders.
