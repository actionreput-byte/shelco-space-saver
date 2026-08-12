import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_orders",
  title: "List orders",
  description:
    "List Shelco racking and shelving orders visible to the signed-in user. Clients see only their own orders; staff see all orders.",
  inputSchema: {
    status: z
      .enum(["quote", "confirmed", "in_production", "installed", "closed", "cancelled"])
      .optional()
      .describe("Filter by order status."),
    search: z.string().optional().describe("Match order number or title."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("orders")
      .select("id, order_number, title, status, total, expected_date, site_address, created_at, client_id")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    if (search) query = query.or(`order_number.ilike.%${search}%,title.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) return toolError(error.message);
    return jsonResult(data ?? [], { orders: data ?? [] });
  },
});
