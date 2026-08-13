import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { SHELCO_SYSTEM_PROMPT } from "@/lib/shelco-knowledge";

type ChatRequestBody = {
  messages?: unknown;
  visitorId?: unknown;
  userId?: unknown;
};

function lastUserText(messages: UIMessage[]) {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return "";
  return last.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const visitorId =
          typeof body.visitorId === "string" && body.visitorId ? body.visitorId : "anonymous";
        const userId = typeof body.userId === "string" && body.userId ? body.userId : null;

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find or create the visitor's single ongoing conversation.
        let conversationId: string | null = null;
        const { data: existing } = await supabaseAdmin
          .from("chat_conversations")
          .select("id")
          .eq("visitor_id", visitorId)
          .maybeSingle();
        if (existing) {
          conversationId = existing.id;
          await supabaseAdmin
            .from("chat_conversations")
            .update({
              last_message_at: new Date().toISOString(),
              ...(userId ? { user_id: userId } : {}),
            })
            .eq("id", conversationId);
        } else {
          const { data: created, error } = await supabaseAdmin
            .from("chat_conversations")
            .insert({
              visitor_id: visitorId,
              user_id: userId,
              title: lastUserText(messages as UIMessage[]).slice(0, 80) || "New chat",
            })
            .select("id")
            .maybeSingle();
          if (error) console.error("chat conversation insert failed", error.message);
          conversationId = created?.id ?? null;
        }

        if (conversationId) {
          const text = lastUserText(messages as UIMessage[]);
          if (text) {
            const { error } = await supabaseAdmin
              .from("chat_messages")
              .insert({ conversation_id: conversationId, role: "user", content: text });
            if (error) console.error("chat message insert failed", error.message);
          }
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: SHELCO_SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
          stopWhen: stepCountIs(50),
          tools: {
            capture_lead: tool({
              description:
                "Save a customer enquiry (lead) into the Shelco CRM so the sales team can call them back. Use once you have at least a name and a phone number.",
              inputSchema: z.object({
                name: z.string().describe("Customer name"),
                phone: z.string().describe("Tanzanian phone number"),
                email: z.string().nullable().describe("Email if given, else null"),
                company: z.string().nullable().describe("Company if given, else null"),
                service: z
                  .enum([
                    "Racking Solutions",
                    "Shelving Solutions",
                    "General Shelving & Racking",
                    "Accessories",
                  ])
                  .nullable(),
                message: z.string().nullable().describe("Summary of what they need"),
              }),
              execute: async (input) => {
                const { error } = await supabaseAdmin.from("quote_requests").insert({
                  name: input.name,
                  phone: input.phone,
                  email: input.email,
                  company: input.company,
                  service: input.service,
                  message: input.message
                    ? `${input.message} (via AI chat)`
                    : "Captured by the Shelco AI assistant",
                });
                if (error) {
                  console.error("lead capture failed", error.message);
                  return { saved: false, error: error.message };
                }
                return { saved: true };
              },
            }),
          },
          onFinish: async ({ text }) => {
            if (!conversationId || !text) return;
            const { error } = await supabaseAdmin
              .from("chat_messages")
              .insert({ conversation_id: conversationId, role: "assistant", content: text });
            if (error) console.error("assistant message insert failed", error.message);
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
