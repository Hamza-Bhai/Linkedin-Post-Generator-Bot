import { generatePost } from "./generatePost.js";
import { sendTelegramMessage } from "./sendTelegram.js";

const { topic, post } = await generatePost();
console.log("Generated topic:", topic);

const message = `📝 Today's LinkedIn Post\n\nTopic: ${topic}\n\n${post}`;
await sendTelegramMessage(message);

console.log("Sent to Telegram successfully.");
