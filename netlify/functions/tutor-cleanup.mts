import { getDatabase } from "@netlify/database";
import type { Config } from "@netlify/functions";

export default async function cleanup() {
  const database = getDatabase();
  await database.sql`DELETE FROM maths_tutor_progress WHERE updated_at < NOW() - INTERVAL '30 days'`;
  await database.sql`DELETE FROM maths_tutor_usage WHERE expires_at < NOW()`;
  return new Response(null, { status: 204 });
}

export const config: Config = { schedule: "0 3 * * *" };
