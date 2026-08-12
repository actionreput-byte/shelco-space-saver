import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "get_order",
  title: "Get order details",
  description:
    "Get one Shelco order by its order number (e.g. SO-1042) including line items and the status history.",
  inputSchema: {
    order_number: z.string().trim().min(1).describe("The order number, e.g. SO-1042."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_number }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, title, status, total, expected_date, site_address, notes, created_at, client_id")
      .eq("order_number", order_number)
      .maybeSingle();
    if (error) return toolError(error.message);
    if (!order) return toolError(`No order found with number ${order_number}.`);

    const [{ data: items }, { data: events }] = await Promise.all([
      supabase
        .from("order_items")
        .select("description, qty, unit_price")
        .eq("order_id", order.id),
      supabase
        .from("order_events")
        .select("status, note, created_at")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true }),
    ]);

    const payload = { order, items: items ?? [], events: events ?? [] };
    return jsonResult(payload, payload);
  },
});
