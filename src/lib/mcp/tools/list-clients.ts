import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "list_clients",
  title: "List clients",
  description:
    "List Shelco client accounts with their status. Only Shelco staff can read the full directory; clients see only their own record.",
  inputSchema: {
    status: z
      .enum(["lead", "active", "dormant", "blocked"])
      .optional()
      .describe("Filter by client status."),
    search: z.string().optional().describe("Match company or contact name."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("clients")
      .select("id, company_name, contact_name, email, phone, address, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    if (search) query = query.or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) return toolError(error.message);
    return jsonResult(data ?? [], { clients: data ?? [] });
  },
});
