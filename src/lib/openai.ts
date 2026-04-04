export type AIFeatureId =
  | "summary"
  | "flashcards"
  | "quiz"
  | "questions"
  | "notes"
  | "quickrev";

const PROMPTS: Record<AIFeatureId, (text: string, difficulty: string) => string> = {
  summary: (text, difficulty) =>
    `You are an expert tutor. Please provide a concise and clear summary of the following study material suitable for a ${difficulty} level student. Focus on the key concepts and main ideas.\n\nMaterial:\n${text}`,

  flashcards: (text, difficulty) =>
    `You are a study aid generator. Create a set of 30-50 flashcards based on the following text for a ${difficulty} level student. Format the output as a JSON array of objects with "front" and "back" keys. Do not include markdown code blocks, just the raw JSON.\n\nMaterial:\n${text}`,

  quiz: (text, difficulty) =>
    `Generate a multiple-choice quiz (30-50 questions) based on this text for a ${difficulty} level student. Format the output as a JSON array of objects with "question", "options" (array of strings), "correctAnswer" (index), and "explanation". Do not include markdown.\n\nMaterial:\n${text}`,

  questions: (text, difficulty) =>
    `Generate 10-15 important exam-style questions based on this text for a ${difficulty} level exam. Format the output as a JSON array of objects with "question", "options" (array of 4 strings), "correctAnswer" (index number), and "explanation" keys. Do not include markdown code blocks.\n\nMaterial:\n${text}`,

  notes: (text, difficulty) =>
    `Create comprehensive revision notes from this text for a ${difficulty} level student. Use clear headings, bullet points, and explain complex concepts in detail. Structure it logically for deep study. Do NOT use JSON.\n\nMaterial:\n${text}`,

  quickrev: (text, difficulty) =>
    `Create a high-yield "Cheat Sheet" for last-minute revision. Focus ONLY on: 1) Key Definitions, 2) Important Formulas/Dates, 3) Crucial Facts. Do NOT write full sentences or paragraphs. Use short bullet points or tables. Target level: ${difficulty}. Do NOT use JSON.\n\nMaterial:\n${text}`,
};

// Models to try in order (cost-effective first)
const MODEL_PRIORITIES = [
  "gpt-4o-mini",
  "gpt-3.5-turbo",
  "gpt-4o",
];

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY || "";
  if (!key) {
    console.error("Missing VITE_OPENAI_API_KEY in .env file!");
  }
  return key;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Call OpenAI Chat Completions API
 */
async function callOpenAI(
  messages: ChatMessage[],
  model: string = MODEL_PRIORITIES[0],
  maxTokens: number = 4096
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    
    // Check for rate limit
    if (response.status === 429) {
      throw new Error(`RATE_LIMIT: ${errorMessage}`);
    }
    // Check for model not found
    if (response.status === 404) {
      throw new Error(`MODEL_NOT_FOUND: ${errorMessage}`);
    }
    
    throw new Error(errorMessage);
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
    { role: "system", content: "You are an expert academic tutor and study material creator. Provide high-quality, accurate content." },
    { role: "user", content: prompt },
  ];

  const errors: string[] = [];

  for (const model of MODEL_PRIORITIES) {
    try {
      console.log(`Trying model: ${model}`);
      const result = await callOpenAI(messages, model);
      console.log(`✓ Success with model: ${model}`);
      return result;
    } catch (error: any) {
      const msg = error.message || String(error);
      console.warn(`✗ ${model} failed:`, msg.substring(0, 120));

      if (msg.startsWith("RATE_LIMIT:")) {
        errors.push(`${model}: rate limited`);
        continue;
      }
      if (msg.startsWith("MODEL_NOT_FOUND:")) {
        errors.push(`${model}: not available`);
        continue;
      }

      // Non-recoverable error — don't try other models
      throw error;
    }
  }

  throw new Error(
    "All AI models are currently unavailable. Please try again in a few minutes.\n\n" +
    `Details:\n${errors.join("\n")}`
  );
};

/**
 * Chat with AI (for the AI Chat page)
 * Takes conversation history and returns AI response
 */
export const chatWithAI = async (
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  newMessage: string
): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful AI study assistant. You help students understand concepts, solve problems, create study plans, and answer academic questions. Be clear, concise, and encouraging. Use markdown formatting when helpful.",
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
      const result = await callOpenAI(messages, model, 2048);
      return result;
    } catch (error: any) {
      const msg = error.message || String(error);
      if (msg.startsWith("RATE_LIMIT:") || msg.startsWith("MODEL_NOT_FOUND:")) {
        errors.push(`${model}: ${msg}`);
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    "⏳ All AI models are currently rate-limited. Please wait a moment and try again."
  );
};

// Keep for backward compatibility
export { type AIFeatureId as default };
