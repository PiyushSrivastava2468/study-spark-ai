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
    `You are a study aid generator. Create 30-50 flashcards based on the following text for a ${difficulty} level student. Format as a JSON array of objects with "front" and "back" keys. Return ONLY raw JSON, no markdown.\n\nMaterial:\n${text}`,

  quiz: (text, difficulty) =>
    `Generate a multiple-choice quiz (30-50 questions) based on this text for a ${difficulty} level student. Format as a JSON array of objects with "question", "options" (array of strings), "correctAnswer" (index), and "explanation". Return ONLY raw JSON, no markdown.\n\nMaterial:\n${text}`,

  questions: (text, difficulty) =>
    `Generate 10-15 important exam-style questions based on this text for a ${difficulty} level exam. Format as a JSON array of objects with "question", "options" (array of 4 strings), "correctAnswer" (index number), and "explanation" keys. Return ONLY raw JSON, no markdown.\n\nMaterial:\n${text}`,

  notes: (text, difficulty) =>
    `Create comprehensive revision notes from this text for a ${difficulty} level student. Use clear headings, bullet points, and explain complex concepts in detail. Structure it logically. Do NOT use JSON.\n\nMaterial:\n${text}`,

  quickrev: (text, difficulty) =>
    `Create a high-yield "Cheat Sheet" for last-minute revision. Focus ONLY on: 1) Key Definitions, 2) Important Formulas/Dates, 3) Crucial Facts. Use short bullet points or tables. Target level: ${difficulty}. Do NOT use JSON.\n\nMaterial:\n${text}`,
};

// Groq models in priority order (fastest/cheapest first)
const MODEL_PRIORITIES = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY || "";
  if (!key) {
    console.error("Missing VITE_GROQ_API_KEY in .env file!");
  }
  return key;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Call Groq Chat Completions API (OpenAI-compatible)
 */
async function callGroq(
  messages: ChatMessage[],
  model: string = MODEL_PRIORITIES[0],
  maxTokens: number = 8192
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.error?.message || `HTTP ${response.status}`;
    const errorCode = errorData?.error?.code || "";

    console.error(`Groq Error [${response.status}]:`, { errorMessage, errorCode });

    // 401 = Invalid API key
    if (response.status === 401) {
      throw new Error(`AUTH_ERROR: Invalid Groq API key. Details: ${errorMessage}`);
    }

    // 429 = Rate limit OR quota
    if (response.status === 429) {
      if (errorMessage.toLowerCase().includes("quota") || errorCode === "insufficient_quota") {
        throw new Error(`QUOTA_ERROR: Groq quota exceeded. Details: ${errorMessage}`);
      }
      throw new Error(`RATE_LIMIT: ${errorMessage}`);
    }

    // 404 = Model not found
    if (response.status === 404) {
      throw new Error(`MODEL_NOT_FOUND: ${errorMessage}`);
    }

    throw new Error(`Groq API Error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
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

  const prompt = promptGenerator(content, difficulty);
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
      const result = await callGroq(messages, model);
      console.log(`✓ Success with model: ${model}`);
      return result;
    } catch (error: any) {
      const msg = error.message || String(error);
      console.warn(`✗ ${model} failed:`, msg.substring(0, 200));

      // Quota/Auth errors affect ALL models — stop immediately with clear message
      if (msg.startsWith("QUOTA_ERROR:") || msg.startsWith("AUTH_ERROR:")) {
        throw new Error(msg.replace(/^(QUOTA_ERROR|AUTH_ERROR):\s*/, ""));
      }

      if (msg.startsWith("RATE_LIMIT:")) {
        errors.push(`${model}: rate limited`);
        continue;
      }
      if (msg.startsWith("MODEL_NOT_FOUND:")) {
        errors.push(`${model}: not available`);
        continue;
      }

      // Non-recoverable — surface immediately
      throw error;
    }
  }

  throw new Error(
    "All AI models are currently rate-limited. Please wait a moment and try again.\n\n" +
    `Details:\n${errors.join("\n")}`
  );
};

/**
 * Chat with AI (used by AI Chat page)
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
      console.log(`AI Chat trying Groq model: ${model}`);
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

  throw new Error("⏳ All AI models are currently rate-limited. Please wait a moment and try again.");
};

export { type AIFeatureId as default };
