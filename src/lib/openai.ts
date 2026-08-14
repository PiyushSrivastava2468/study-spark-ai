export type AIFeatureId =
  | "summary"
  | "flashcards"
  | "quiz"
  | "questions"
  | "notes"
  | "quickrev";

const PROMPTS: Record<AIFeatureId, (text: string, difficulty: string) => string> = {
  summary: (text, difficulty) =>
    `You are an expert tutor. Provide a concise and clear summary of the following study material suitable for a ${difficulty} level student. Focus on key concepts and main ideas.\n\nMaterial:\n${text}`,

  flashcards: (text, difficulty) =>
    `You are a study aid generator. Create 15-20 flashcards based on the following text for a ${difficulty} level student. Format as a JSON array of objects with "front" and "back" keys. Return ONLY raw JSON, no markdown.\n\nMaterial:\n${text}`,

  quiz: (text, difficulty) =>
    `Generate a multiple-choice quiz (15-20 questions) based on this text for a ${difficulty} level student. Format as a JSON array of objects with "question", "options" (array of strings), "correctAnswer" (index), and "explanation". Return ONLY raw JSON, no markdown.\n\nMaterial:\n${text}`,

  questions: (text, difficulty) =>
    `Generate 8-10 important exam-style questions based on this text for a ${difficulty} level exam. Format as a JSON array of objects with "question", "options" (array of 4 strings), "correctAnswer" (index number), and "explanation" keys. Return ONLY raw JSON, no markdown.\n\nMaterial:\n${text}`,

  notes: (text, difficulty) =>
    `Create comprehensive revision notes from this text for a ${difficulty} level student. Use clear headings, bullet points, and explain complex concepts in detail. Structure it logically. Do NOT use JSON.\n\nMaterial:\n${text}`,

  quickrev: (text, difficulty) =>
    `Create a high-yield "Cheat Sheet" for last-minute revision. Focus ONLY on: 1) Key Definitions, 2) Important Formulas/Dates, 3) Crucial Facts. Use short bullet points or tables. Target level: ${difficulty}. Do NOT use JSON.\n\nMaterial:\n${text}`,
};

// Latest Groq models in priority order
const MODEL_PRIORITIES = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

const MAX_INPUT_WORDS = 800;

function truncateText(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_INPUT_WORDS) return text;
  return (
    words.slice(0, MAX_INPUT_WORDS).join(" ") +
    "\n\n[Content truncated to fit AI token limits. Key material above preserved.]"
  );
}

/**
 * Determine the proxy URL.
 * - Capacitor WebView: uses absolute Vercel URL (no local /api endpoint)
 * - Web (dev + production): uses relative /api/groq
 *   - Dev: Vite proxies it to Groq, injecting auth header in Node.js
 *   - Production: Vercel serverless function handles it
 */
function getProxyUrl(): string {
  if (typeof window !== "undefined" && window.location.protocol === "capacitor:") {
    return "https://study-spark-ai-beta.vercel.app/api/groq";
  }
  return "/api/groq";
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Call the /api/groq proxy — no Authorization header sent from browser.
 * The proxy (Vite dev server or Vercel serverless) adds the API key server-side.
 */
async function callGroq(
  messages: ChatMessage[],
  model: string = MODEL_PRIORITIES[0],
  maxTokens: number = 8192
): Promise<string> {
  const proxyUrl = getProxyUrl();

  // Only Content-Type is sent — fully ISO-8859-1 safe, no auth header
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model, maxTokens }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = (errorData as any)?.error || `HTTP ${response.status}`;
    const errorCode = (errorData as any)?.code || "";

    console.error(`Groq Proxy Error [${response.status}]:`, { errorMessage, errorCode });

    if (response.status === 401) {
      throw new Error(`AUTH_ERROR: Invalid Groq API key. Details: ${errorMessage}`);
    }
    if (response.status === 429) {
      if (String(errorMessage).toLowerCase().includes("quota") || errorCode === "insufficient_quota") {
        throw new Error(`QUOTA_ERROR: Groq quota exceeded. Details: ${errorMessage}`);
      }
      throw new Error(`RATE_LIMIT: ${errorMessage}`);
    }
    if (response.status === 404) {
      throw new Error(`MODEL_NOT_FOUND: ${errorMessage}`);
    }
    if (response.status === 400 && (
      String(errorMessage).toLowerCase().includes("decommission") ||
      String(errorMessage).toLowerCase().includes("model") ||
      String(errorMessage).toLowerCase().includes("not supported")
    )) {
      throw new Error(`MODEL_NOT_FOUND: ${errorMessage}`);
    }
    if (response.status === 413) {
      throw new Error(`TOO_LARGE: ${errorMessage}`);
    }

    throw new Error(`Groq API Error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  return (data as any).content || "";
}

/**
 * Generate study content with model fallback
 */
export const generateStudyContent = async (
  featureId: string,
  content: string,
  difficulty: string
): Promise<string> => {
  const promptGenerator = PROMPTS[featureId as AIFeatureId];
  if (!promptGenerator) {
    throw new Error("Invalid feature selected");
  }

  const safeContent = truncateText(content);
  const prompt = promptGenerator(safeContent, difficulty);
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "You are an expert academic tutor and study material creator. Provide high-quality, accurate content.",
    },
    { role: "user", content: prompt },
  ];

  const errors: string[] = [];

  for (const model of MODEL_PRIORITIES) {
    try {
      console.log(`Trying Groq model: ${model}`);
      const result = await callGroq(messages, model, 3000);
      console.log(`Success with model: ${model}`);
      return result;
    } catch (error: any) {
      const msg = error.message || String(error);
      console.warn(`${model} failed:`, msg.substring(0, 200));

      if (msg.startsWith("QUOTA_ERROR:") || msg.startsWith("AUTH_ERROR:")) {
        throw new Error(msg.replace(/^(QUOTA_ERROR|AUTH_ERROR):\s*/, ""));
      }
      if (msg.startsWith("RATE_LIMIT:") || msg.startsWith("TOO_LARGE:")) {
        errors.push(`${model}: ${msg.startsWith("TOO_LARGE:") ? "request too large" : "rate limited"}`);
        continue;
      }
      if (msg.startsWith("MODEL_NOT_FOUND:")) {
        errors.push(`${model}: not available`);
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    "All AI models are currently rate-limited. Please wait a moment and try again.\n\n" +
    `Details:\n${errors.join("\n")}`
  );
};

/**
 * Chat with AI (AI Chat page)
 */
export const chatWithAI = async (
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  newMessage: string
): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful AI study assistant. Help students understand concepts, solve problems, create study plans, and answer academic questions. Be clear, concise, and encouraging. Use markdown formatting when helpful.",
    },
    ...conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: newMessage },
  ];

  const errors: string[] = [];

  for (const model of MODEL_PRIORITIES) {
    try {
      console.log(`AI Chat trying model: ${model}`);
      const result = await callGroq(messages, model, 4096);
      return result;
    } catch (error: any) {
      const msg = error.message || String(error);
      if (msg.startsWith("QUOTA_ERROR:") || msg.startsWith("AUTH_ERROR:")) {
        throw new Error(msg.replace(/^(QUOTA_ERROR|AUTH_ERROR):\s*/, ""));
      }
      if (msg.startsWith("RATE_LIMIT:") || msg.startsWith("MODEL_NOT_FOUND:")) {
        errors.push(`${model}: ${msg}`);
        continue;
      }
      throw error;
    }
  }

  throw new Error("All AI models are currently rate-limited. Please wait a moment and try again.");
};

export { type AIFeatureId as default };
