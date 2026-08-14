// Vercel Serverless Function — proxies Groq API calls server-side.
// The API key is NEVER sent from the browser; it lives only in server env vars.

export const config = { maxDuration: 30 };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: any, res: any) {
  // Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  // Set CORS on every real response
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured on server" });
  }

  const { messages, model = "llama-3.3-70b-versatile", maxTokens = 8192 } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.7 }),
    });

    const data = await groqRes.json().catch(() => ({}));

    if (!groqRes.ok) {
      const msg = (data as any)?.error?.message || `HTTP ${groqRes.status}`;
      const code = (data as any)?.error?.code || "";
      return res.status(groqRes.status).json({ error: msg, code });
    }

    const content = (data as any).choices?.[0]?.message?.content ?? "";
    return res.json({ content });
  } catch (err: any) {
    console.error("Groq proxy error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
