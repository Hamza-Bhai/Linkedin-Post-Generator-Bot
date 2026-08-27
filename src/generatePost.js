import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRecentTopics, addTopic } from "./historyStore.js";

function buildPrompt(pastTopics) {
  const avoidList = pastTopics.slice(-15).join(", ") || "none yet";
  return `You are helping a full-stack software engineer write a LinkedIn post.

Pick ONE fresh, specific topic relevant to full-stack development (e.g. a framework feature, a debugging lesson, a performance trick, a career insight, an architecture decision, a tool comparison). Avoid these recently used topics: ${avoidList}.

Write a LinkedIn post about it with:
- A strong 1-line hook as the first line
- 3-6 short paragraphs or bullet points, easy to skim
- A personal, first-person, authentic tone (not salesy, not generic AI-sounding)
- End with a short question to invite engagement
- Add 3-5 relevant hashtags at the end

Respond in strict JSON with this shape, nothing else:
{"topic": "short topic label", "post": "full post text with line breaks as \\n"}`;
}

export async function generatePost() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing. Copy .env.example to .env and add your key.");
  }

  const history = await getRecentTopics();
  const pastTopics = history.map((h) => h.topic);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const result = await model.generateContent(buildPrompt(pastTopics));
  const raw = result.response.text().trim();

  const jsonText = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  const { topic, post } = JSON.parse(jsonText);

  await addTopic(topic);

  return { topic, post };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const { topic, post } = await generatePost();
  console.log("Topic:", topic);
  console.log("\n--- Post ---\n");
  console.log(post);
}
