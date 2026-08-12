import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "update_order_status",
  title: "Update order status",
  description:
    "Move a Shelco order to a new status in the pipeline (quote, confirmed, in production, installed, closed, cancelled). Staff access only.",
  inputSchema: {
    order_number: z.string().trim().min(1).describe("The order number, e.g. SO-1042."),
    status: z
      .enum(["quote", "confirmed", "in_production", "installed", "closed", "cancelled"])
      .describe("The new status for the order."),
    note: z.string().trim().optional().describe("Optional note recorded with the status change."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ order_number, status, note }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("orders")
      .update({ status, ...(note ? { notes: note } : {}) })
      .eq("order_number", order_number)
      .select("order_number, status, title")
      .maybeSingle();
    if (error) return toolError(error.message);
    if (!data) {
      return toolError(
        `No order ${order_number} was updated. It may not exist, or you may not have permission to change it.`,
      );
    }
    return jsonResult({ updated: data }, { order: data });
  },
});
