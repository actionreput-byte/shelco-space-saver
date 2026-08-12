import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { jsonResult, notAuthenticated, supabaseForUser, toolError } from "../supabase";

export default defineTool({
  name: "create_quote_request",
  title: "Create quote request",
  description:
    "Log a new quote / site-visit request in the Shelco CRM enquiries list so the sales team can follow up.",
  inputSchema: {
    name: z.string().trim().min(1).describe("Contact person's name."),
    phone: z.string().trim().optional().describe("Tanzanian phone number for follow-up."),
    email: z.string().trim().optional().describe("Contact email address."),
    company: z.string().trim().optional().describe("Company or business name."),
    service: z
      .enum([
        "Racking Solutions",
        "Shelving Solutions",
        "General Shelving & Racking",
        "Accessories",
      ])
      .optional()
      .describe("Which Shelco service the enquiry is about."),
    message: z.string().trim().optional().describe("Details of the storage requirement."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        name: input.name,
        phone: input.phone ?? null,
        email: input.email ?? ctx.getUserEmail() ?? null,
        company: input.company ?? null,
        service: input.service ?? null,
        message: input.message ?? null,
      })
      .select("id, name, service, created_at")
      .maybeSingle();
    if (error) return toolError(error.message);
    return jsonResult({ created: data }, { quote_request: data ?? null });
  },
});
