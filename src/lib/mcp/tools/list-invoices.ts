import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_invoices",
  title: "List invoices",
  description:
    "List Shelco invoices visible to the signed-in user, with totals and amounts paid. Clients see only their own invoices; staff see all.",
  inputSchema: {
    status: z
      .enum(["draft", "sent", "partially_paid", "paid", "overdue", "cancelled"])
      .optional()
      .describe("Filter by invoice status."),
    unpaid_only: z.boolean().optional().describe("Only invoices not fully paid."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, unpaid_only, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("invoices")
      .select("invoice_number, status, issue_date, due_date, subtotal, vat_rate, total, paid_amount, client_id, order_id")
      .order("issue_date", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return toolError(error.message);
    const rows = (data ?? []).filter(
      (r) => !unpaid_only || Number(r.paid_amount) < Number(r.total),
    );
    return jsonResult(rows, { invoices: rows });
  },
});
