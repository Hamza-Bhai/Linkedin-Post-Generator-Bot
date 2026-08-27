# LinkedIn Post Agent

Automated daily LinkedIn post generator for a Full-Stack + AI Automation Engineer. It picks a fresh topic (alternating between full-stack development and AI/LLM automation), writes a ready-to-post LinkedIn draft using Gemini AI, and sends it to you on Telegram every day — so you just review and post manually (no bots posting on your behalf, so your LinkedIn account stays safe).

## How it works

1. **Topic + post generation** — Gemini AI picks a topic relevant to full-stack dev or AI automation (avoiding recently used topics) and writes a complete LinkedIn post: hook, body, engagement question, hashtags.
2. **History tracking** — Recent topics are stored in Upstash Redis so the AI doesn't repeat itself.
3. **Delivery** — The generated post is sent to you via a Telegram bot.
4. **Scheduling** — Runs automatically every day via a Vercel Cron Job, so no local machine needs to stay on.
5. **Posting** — You review the message on Telegram and post it to LinkedIn yourself.

## Tech stack

- **Runtime:** Node.js (ESM)
- **AI:** Google Gemini API (free tier)
- **Delivery:** Telegram Bot API
- **History storage:** Upstash Redis (free tier, REST API)
- **Hosting/Scheduling:** Vercel Serverless Functions + Vercel Cron Jobs

## Project structure

```
api/
  daily.js          # Vercel serverless function (cron entry point)
src/
  generatePost.js   # Builds the prompt and calls Gemini
  sendTelegram.js   # Sends the generated post to Telegram
  historyStore.js   # Reads/writes recent topics from Upstash
  getChatId.js       # One-time helper to find your Telegram chat ID
  daily.js           # Local runner: generate + send (used for testing)
vercel.json          # Cron schedule config
```

## Setup

### 1. Clone and install

```bash
git clone <this-repo-url>
cd linkedin-post-agent
npm install
```

### 2. Get a free Gemini API key

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with a Google account
3. Click **Create API key** and copy it

### 3. Create a Telegram bot

1. In Telegram, message **@BotFather**
2. Send `/newbot`, follow the prompts, and copy the **bot token** you receive
3. Send any message (e.g. "hi") to your new bot
4. Add your bot token to `.env`, then run:
   ```bash
   node src/getChatId.js
   ```
   This prints your **chat ID** — copy it too.

> Note: Telegram is blocked in some regions (e.g. Pakistan) — connect a VPN on your machine before running any Telegram-related commands.

### 4. Create a free Upstash Redis database

1. Go to [console.upstash.com](https://console.upstash.com/) and sign up
2. Create a new database
3. Under **REST API**, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### 5. Configure environment variables

Copy `.env.example` to `.env` and fill in all the values collected above:

```bash
cp .env.example .env
```

```
GEMINI_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 6. Test locally

```bash
npm run generate   # generate a post and print it to the console
npm run daily       # generate a post and send it to Telegram
```

### 7. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Then add all 5 environment variables from `.env` in **Vercel Dashboard → Project → Settings → Environment Variables**, and deploy to production:

```bash
vercel --prod
```

The cron job is already configured in `vercel.json` to run daily at **04:00 UTC (09:00 PKT)**. You can verify it under **Project → Settings → Cron Jobs**.

## Customizing the topic focus

Edit the prompt in `src/generatePost.js` (`buildPrompt` function) to change the tone, topic areas, or post format.
