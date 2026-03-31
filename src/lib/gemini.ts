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

const getBestModel = async (apiKey: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (!response.ok) throw new Error("Failed to list models");

    const models = data.models || [];
    console.log("All Available Gemini Models:", models.map((m: any) => m.name)); // Debug log for user

    // Priority List for Free Tier
    const priorities = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-1.5-pro-001",
      "gemini-1.0-pro",
      "gemini-pro"
    ];

    for (const priority of priorities) {
      const found = models.find((m: any) => m.name.endsWith(priority));
      if (found) return found.name.replace("models/", "");
    }

    // Fallback: any flash model
    const anyFlash = models.find((m: any) => m.name.includes("flash"));
    if (anyFlash) return anyFlash.name.replace("models/", "");

    // Fallback: any gemini model (avoiding 2.5 if possible based on this error, but if it's the only one...)
    const anyGemini = models.find((m: any) => m.name.includes("gemini") && !m.name.includes("2.5"));
    if (anyGemini) return anyGemini.name.replace("models/", "");

    return "gemini-2.0-flash"; // Ultimate fallback
  } catch (e) {
    console.warn("Could not auto-detect model, using default");
    return "gemini-2.0-flash";
  }
};

export const generateStudyContent = async (
  apiKey: string,
  featureId: string,
  content: string,
  difficulty: string
) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = await getBestModel(apiKey);
    console.log("Using model:", modelName);
    const model = genAI.getGenerativeModel({ model: modelName });

    const promptGenerator = PROMPTS[featureId as AIFeatureId];
    if (!promptGenerator) {
      throw new Error("Invalid feature selected");
    }

    const prompt = promptGenerator(content, difficulty);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

// Deprecated but kept for compatibility with UI check
export const validateGeminiConnection = async (apiKey: string) => {
  return getBestModel(apiKey).then(name => [name]);
};
