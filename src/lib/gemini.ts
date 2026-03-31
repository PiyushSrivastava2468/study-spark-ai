import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Model priority list — 2.5 models first (separate quota from 2.0)
const MODEL_PRIORITIES = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite-001",
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-pro-latest",
];

export const getAvailableModels = async (apiKey: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error("Failed to list models");

    const models = data.models || [];
    // Only include models that support generateContent
    const genModels = models.filter((m: any) =>
      m.supportedGenerationMethods?.includes("generateContent")
    );
    const modelNames = genModels.map((m: any) => m.name.replace("models/", ""));

    console.log("Available generateContent models:", modelNames);

    // Return models in priority order
    const ordered: string[] = [];
    for (const priority of MODEL_PRIORITIES) {
      const found = modelNames.find((n: string) => n === priority);
      if (found) ordered.push(found);
    }

    // Add any remaining gemini models not in priority list (excluding non-text models)
    const excludePatterns = ["embedding", "imagen", "veo", "aqa", "lyria", "tts", "audio", "live", "robotics", "computer-use", "deep-research", "image", "banana"];
    for (const name of modelNames) {
      if (!ordered.includes(name) && !excludePatterns.some(p => name.includes(p))) {
        ordered.push(name);
      }
    }

    return ordered.length > 0 ? ordered : ["gemini-2.0-flash-lite"];
  } catch (e) {
    console.warn("Could not auto-detect models:", e);
    return ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"];
  }
};

const isRateLimitError = (error: any): boolean => {
  const msg = String(error?.message || error || "").toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate") ||
    msg.includes("resource exhausted") ||
    msg.includes("limit")
  );
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Try generating content, automatically falling back through available models
 * if rate-limited. Also retries once after a short delay for transient errors.
 */
export const generateWithFallback = async (
  apiKey: string,
  prompt: string
): Promise<string> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = await getAvailableModels(apiKey);
  console.log("Will try models in order:", models);

  const errors: string[] = [];

  for (const modelName of models) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(`✓ Success with model: ${modelName}`);
      return response.text();
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      console.warn(`✗ ${modelName} failed:`, errMsg.substring(0, 120));

      if (isRateLimitError(error)) {
        errors.push(`${modelName}: rate limited`);
        continue;
      }

      if (errMsg.includes("404") || errMsg.includes("not found") || errMsg.includes("not supported")) {
        errors.push(`${modelName}: not available`);
        continue;
      }

      // For other errors, retry once after a brief delay
      try {
        console.log(`Retrying ${modelName} after 3s delay...`);
        await delay(3000);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (retryError: any) {
        errors.push(`${modelName}: ${retryError?.message?.substring(0, 80) || "unknown error"}`);
        continue;
      }
    }
  }

  // All models failed
  const allRateLimited = errors.every((e) => e.includes("rate limited"));
  if (allRateLimited) {
    throw new Error(
      "⏳ All AI models have reached their free tier quota limit. " +
      "This resets automatically (usually within an hour or by tomorrow). " +
      "You can either:\n" +
      "• Wait a few minutes and try again\n" +
      "• Get a new API key from https://aistudio.google.com/app/apikey\n" +
      "• Upgrade to a paid Gemini plan for higher limits"
    );
  }

  throw new Error(
    `AI generation failed with all available models. Errors:\n${errors.join("\n")}`
  );
};

export const generateStudyContent = async (
  apiKey: string,
  featureId: string,
  content: string,
  difficulty: string
) => {
  const promptGenerator = PROMPTS[featureId as AIFeatureId];
  if (!promptGenerator) {
    throw new Error("Invalid feature selected");
  }

  const prompt = promptGenerator(content, difficulty);
  return generateWithFallback(apiKey, prompt);
};

// Deprecated but kept for compatibility with UI check
export const validateGeminiConnection = async (apiKey: string) => {
  const models = await getAvailableModels(apiKey);
  return models.slice(0, 1);
};
