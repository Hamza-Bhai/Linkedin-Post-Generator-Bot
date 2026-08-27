import { generatePost } from "../src/generatePost.js";
import { sendTelegramMessage } from "../src/sendTelegram.js";

export default async function handler(req, res) {
  try {
    const { topic, post } = await generatePost();
    const message = `📝 Today's LinkedIn Post\n\nTopic: ${topic}\n\n${post}`;
    await sendTelegramMessage(message);
    res.status(200).json({ ok: true, topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
