const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "linkedin_post_topics";

async function upstash(command) {
  const res = await fetch(`${UPSTASH_URL}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json();
  if (data.error) throw new Error(`Upstash error: ${data.error}`);
  return data.result;
}

export async function getRecentTopics() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return [];
  const raw = await upstash(["get", KEY]);
  return raw ? JSON.parse(raw) : [];
}

export async function addTopic(topic) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  const topics = await getRecentTopics();
  topics.push({ topic, date: new Date().toISOString().slice(0, 10) });
  const trimmed = topics.slice(-30);
  await upstash(["set", KEY, JSON.stringify(trimmed)]);
}
