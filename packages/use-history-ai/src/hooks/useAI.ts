import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

export interface AIResponse {
  input: string;
  output: string;
}

export function useAI(apiKey: string, model = "gemini-2.5-flash") {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(prompt: string) {
    setLoading(true);
    setError(null);

    try {
      // Initialize the AI client
      const ai = new GoogleGenAI({ apiKey });

      // Create a chat session
      const chat = ai.chats.create({
        model,
      });

      // Send the message
      const result = await chat.sendMessage({
        message: [{ text: prompt }],
      });

      const content = result.text || "No response";
      const output = { input: prompt, output: content };

      setResponse(output);
      return output;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate response";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, response, error, generate };
}
