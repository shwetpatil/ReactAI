import { GoogleGenAI } from '@google/genai';

/**
 * Non-streaming helper.
 */
export async function askGemini(
  prompt: string,
  apiKey: string
): Promise<string> {
  let result = '';

  for await (const chunk of askGeminiStream(prompt, apiKey)) {
    result += chunk;
  }

  return result;
}

/**
 * Streaming helper.
 */
export async function* askGeminiStream(
  prompt: string,
  apiKey: string
): AsyncGenerator<string, void, unknown> {
  const ai = new GoogleGenAI({
    apiKey,
  });

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of response) {
      yield chunk.text ?? '';
    }
  } catch (error) {
    console.error('Gemini Stream Error:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to complete Gemini request');
  }
}