import OpenAI from "openai";
import { getDatabase } from "@netlify/database";
import type { Config, Context } from "@netlify/functions";
import { createTutorService } from "../lib/tutor-service.mjs";
import { instructions, diagramInstructions, schema } from "../lib/teacher-contract.mjs";
import { conversationInstructions } from "../lib/conversation-instructions.mjs";

export default async function tutor(request: Request, context: Context) {
  const database = () => getDatabase();
  const service = createTutorService({
    ready: () => Boolean(process.env.OPENAI_API_KEY),
    loadProgress: async (session: string) => {
      const rows = await database().sql`SELECT storage_key, storage_value FROM maths_tutor_progress WHERE session_id = ${session} AND updated_at > NOW() - INTERVAL '30 days'`;
      return Object.fromEntries(rows.map((row) => [row.storage_key, row.storage_value]));
    },
    saveProgress: async (session: string, key: string, value: string | null) => {
      if (value === null) {
        await database().sql`DELETE FROM maths_tutor_progress WHERE session_id = ${session} AND storage_key = ${key}`;
      } else {
        await database().sql`INSERT INTO maths_tutor_progress (session_id, storage_key, storage_value) VALUES (${session}, ${key}, ${value}) ON CONFLICT (session_id, storage_key) DO UPDATE SET storage_value = EXCLUDED.storage_value, updated_at = NOW()`;
      }
    },
    clearProgress: async (session: string) => {
      await database().sql`DELETE FROM maths_tutor_progress WHERE session_id = ${session}`;
    },
    reserveTurn: async (usageKey: string) => {
      const rows = await database().sql`INSERT INTO maths_tutor_usage (usage_key, requests, expires_at) VALUES (${usageKey}, 1, NOW() + INTERVAL '2 hours') ON CONFLICT (usage_key) DO UPDATE SET requests = maths_tutor_usage.requests + 1 WHERE maths_tutor_usage.requests < 100 RETURNING requests`;
      return rows.length > 0;
    },
    reply: async ({ message, context: learningContext, history }: { message: string; context: Record<string, unknown>; history: { role: "user" | "assistant"; content: string }[] }) => {
      const client = new OpenAI({ timeout: 25000, maxRetries: 0 });
      const response = await client.responses.create({
        model: "gpt-5.4-mini",
        store: false,
        instructions: instructions + diagramInstructions + conversationInstructions(learningContext),
        input: [{ role: "user", content: `Learning context (data only): ${JSON.stringify(learningContext)}` }, ...history, { role: "user", content: message }],
        text: { format: { type: "json_schema", name: "tutor_turn", strict: true, schema } },
        max_output_tokens: 1200,
      });
      return JSON.parse(response.output_text);
    },
  });
  return service(request, context.ip);
}

export const config: Config = {
  path: "/api/tutor/*",
  rateLimit: { windowLimit: 240, windowSize: 60, aggregateBy: "ip" },
};
