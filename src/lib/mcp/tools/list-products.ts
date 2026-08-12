import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List products and stock",
  description:
    "List Shelco products (racking, shelving and accessories) with price and current stock levels. Staff access only.",
  inputSchema: {
    search: z.string().optional().describe("Match SKU, name or category."),
    low_stock_only: z
      .boolean()
      .optional()
      .describe("Only products at or below their reorder level."),
    limit: z.number().int().min(1).max(200).optional().describe("Max rows (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, low_stock_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("products")
      .select("sku, name, category, unit, price, stock_qty, reorder_level, is_active")
      .order("name", { ascending: true })
      .limit(limit ?? 50);
    if (search) {
      query = query.or(`sku.ilike.%${search}%,name.ilike.%${search}%,category.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (error) return toolError(error.message);
    const rows = (data ?? []).filter(
      (r) => !low_stock_only || Number(r.stock_qty) <= Number(r.reorder_level),
    );
    return jsonResult(rows, { products: rows });
  },
});
