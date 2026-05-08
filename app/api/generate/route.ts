import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getSystemPrompt, getUserPrompt } from "@/lib/prompts";
import { searchWeb, buildSearchQuery, formatSourcesForPrompt } from "@/lib/search";
import type { GenerateRequest } from "@/types";

export const runtime = "edge";
export const maxDuration = 120;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body: GenerateRequest = await req.json();
  const { stage, brief, followUp, useSearch = true, history = [] } = body;

  // Fetch real-time search context
  let searchContext = "";
  if (useSearch) {
    const query = buildSearchQuery(stage, brief);
    const sources = await searchWeb(query, 5);
    searchContext = formatSourcesForPrompt(sources);
  }

  // Build messages
  const systemPrompt = getSystemPrompt(stage);
  const userMessage  = getUserPrompt(stage, brief, followUp) + searchContext;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  // Stream response
  const stream = await anthropic.messages.stream({
    model:      "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system:     systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
