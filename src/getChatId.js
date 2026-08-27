import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN missing in .env");

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await res.json();

const chat = data?.result?.[0]?.message?.chat;
if (!chat) {
  console.log("No messages found. Send a message to your bot on Telegram first, then rerun this.");
  console.log(JSON.stringify(data, null, 2));
} else {
  console.log("Chat ID:", chat.id);
  console.log("Name:", chat.first_name || chat.username || "");
}
