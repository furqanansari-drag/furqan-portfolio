import { cache } from "react";
import { defaults, sanitize, type Content } from "./content";

// Upstash Redis (Vercel Storage se connect karne par ye env vars khud lag jate hain)
const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";
const KEY = "site-content";

export const storeReady = Boolean(URL_ && TOKEN);

export async function redisCmd(args: string[]): Promise<unknown> {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result;
}

// Kuch bhi galat ho to site default content se chalti rehti hai.
export const getContent = cache(async (): Promise<Content> => {
  if (!storeReady) return defaults;
  try {
    const raw = await redisCmd(["GET", KEY]);
    if (typeof raw !== "string") return defaults;
    return sanitize(JSON.parse(raw));
  } catch {
    return defaults;
  }
});

export async function saveContent(c: Content): Promise<void> {
  await redisCmd(["SET", KEY, JSON.stringify(c)]);
}
