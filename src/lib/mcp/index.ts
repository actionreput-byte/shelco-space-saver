import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listOrders from "./tools/list-orders";
import getOrder from "./tools/get-order";
import listInvoices from "./tools/list-invoices";
import listClients from "./tools/list-clients";
import listProducts from "./tools/list-products";
import createQuoteRequest from "./tools/create-quote-request";
import updateOrderStatus from "./tools/update-order-status";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "shelco-storage-showcase",
  title: "Shelco Storage Showcase",
  version: "0.1.0",
  instructions:
    "Tools for Shelco Storage Systems Ltd (Dar es Salaam) — racking and shelving supply and installation. Read orders, invoices, clients and stock, log new quote requests, and move orders through the pipeline. All access runs as the signed-in Shelco user: clients only ever see their own orders, invoices and documents, while staff see the full CRM.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listOrders,
    getOrder,
    listInvoices,
    listClients,
    listProducts,
    createQuoteRequest,
    updateOrderStatus,
  ],
});
