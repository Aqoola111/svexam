import {
  GoogleGenerativeAI,
  SchemaType,
  type ResponseSchema,
} from "@google/generative-ai";
import { z } from "zod";

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_GENERATE_ATTEMPTS = 3;

const generateDescriptionResponseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.slice(0, MAX_DESCRIPTION_LENGTH)),
});

const generateDescriptionResponseSchemaConfig: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    description: {
      type: SchemaType.STRING,
      description: `A compelling movie description. Must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`,
    },
  },
  required: ["description"],
};

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const parseResponseJson = (text: string): unknown => {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fencedMatch?.[1]) {
      return JSON.parse(fencedMatch[1].trim());
    }

    throw new Error("AI returned an invalid response. Please try again.");
  }
};

const getRetryDelayMs = (error: unknown, attempt: number): number => {
  const message = getErrorMessage(error);
  const match = message.match(/retry in (\d+(?:\.\d+)?)s/i);

  if (match?.[1]) {
    return Math.min(Math.ceil(Number(match[1]) * 1000) + 500, 45000);
  }

  return Math.min(attempt * 2000, 10000);
};

const isRetryableGeminiError = (error: unknown): boolean => {
  const message = getErrorMessage(error);

  return (
    message.includes("429") ||
    message.includes("Too Many Requests") ||
    message.includes("too many requests") ||
    message.includes("Quota exceeded") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("503") ||
    message.includes("high demand")
  );
};

const getGeminiErrorMessage = (error: unknown): string => {
  const message = getErrorMessage(error);

  if (message.includes("limit: 0")) {
    return "This Gemini model has no free-tier quota. Set GEMINI_MODEL=gemini-2.5-flash-lite in .env.";
  }

  if (
    message.includes("429") ||
    message.includes("Too Many Requests") ||
    message.includes("too many requests") ||
    message.includes("Quota exceeded") ||
    message.includes("RESOURCE_EXHAUSTED")
  ) {
    return "Too many AI requests. Please wait a minute and try again.";
  }

  if (message.includes("503") || message.includes("high demand")) {
    return "AI is busy right now. Please try again in a moment.";
  }

  return "Failed to generate description. Please try again.";
};

const generateContentWithRetry = async (
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string
): Promise<string> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_GENERATE_ATTEMPTS; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt === MAX_GENERATE_ATTEMPTS) {
        break;
      }

      await sleep(getRetryDelayMs(error, attempt));
    }
  }

  throw new Error(getGeminiErrorMessage(lastError));
};

export const generateMovieDescription = async (
  title: string,
  genre: string
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelName = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: generateDescriptionResponseSchemaConfig,
      maxOutputTokens: 80,
    },
  });

  const prompt = `Write a compelling movie description for a ${genre} movie titled "${title}". Keep it under ${MAX_DESCRIPTION_LENGTH} characters.`;

  const text = await generateContentWithRetry(model, prompt);
  const json = parseResponseJson(text);
  const parsed = generateDescriptionResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error("AI returned an invalid response. Please try again.");
  }

  return parsed.data.description;
};
