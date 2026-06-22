import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mockReply, type MessagePart } from "./mockAgent";

const historyItem = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const inputSchema = z.object({
  message: z.string().min(1),
  history: z.array(historyItem).max(20).optional(),
});

export type GenerateReplyResult = { text: string; parts: MessagePart[] };

const SYSTEM_PROMPT = `You are Sage, an ambient, autonomous AI assistant.
Be concise, warm, and practical. Use light markdown (short bullet lists, bold
for key terms) when it helps readability. Never invent actions you cannot take;
describe what you would do and ask for confirmation before anything irreversible.`;

/**
 * Generate an assistant reply.
 *
 * - When ANTHROPIC_API_KEY is set, calls the real Anthropic Messages API.
 * - Otherwise falls back to the local mock agent so the app still works in demo
 *   mode with no credentials.
 *
 * The handler body runs server-side only; the API key never reaches the client
 * bundle.
 */
export const generateReply = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }: { data: z.infer<typeof inputSchema> }): Promise<GenerateReplyResult> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

    // Demo mode: no key → rich local mock with tool/subagent cards.
    if (!apiKey) {
      return mockReply(data.message);
    }

    const messages = [
      ...(data.history ?? []).map((m: z.infer<typeof historyItem>) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: data.message },
    ];

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 200)}`);
      }

      const json = (await res.json()) as {
        content?: { type: string; text?: string }[];
      };
      const text =
        json.content
          ?.filter((b) => b.type === "text")
          .map((b) => b.text ?? "")
          .join("\n")
          .trim() || "(no response)";

      const parts: MessagePart[] = [
        {
          type: "privacy",
          routing: "cloud-with-consent",
          note: "Routed to the Anthropic API (cloud). Your message text was sent for this reply.",
        },
        { type: "text", text },
      ];

      return { text, parts };
    } catch (err) {
      // Surface a graceful, user-readable reply instead of crashing the chat.
      const message =
        err instanceof Error ? err.message : "Unknown error contacting the model.";
      const text = `I couldn't reach the model just now (${message}). Please try again in a moment.`;
      return { text, parts: [{ type: "text", text }] };
    }
  });
