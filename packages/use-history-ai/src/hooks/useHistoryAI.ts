import { useClipboardHistory } from "./useClipboardHistory.js";
import { useAI } from "./useAI.js";

export function useHistoryAI(apiKey: string) {
  const clipboard = useClipboardHistory();
  const ai = useAI(apiKey);

  const analyzeHistory = async (prompt: string) => {
    // Combine clipboard history with user prompt
    const historyText = clipboard.history
      .slice(0, 10) // Last 10 items
      .map((item, i) => `${i + 1}. ${item.text}`)
      .join("\n\n");

    const fullPrompt = `Here is my recent clipboard history:\n\n${historyText}\n\n${prompt}`;

    return ai.generate(fullPrompt);
  };

  const summarizeHistory = async () => {
    return analyzeHistory("Summarize these copied items in a few sentences.");
  };

  const findInHistory = async (query: string) => {
    return analyzeHistory(`Find and explain items related to: ${query}`);
  };

  return {
    ...clipboard,
    ...ai,
    analyzeHistory,
    summarizeHistory,
    findInHistory,
  };
}
