import { useState, useEffect, useCallback } from "react";
import { HistoryItem, HistoryManager } from "./index.js";

// Singleton instance of HistoryManager
const historyManager = new HistoryManager();

export function useHistory(limit?: number, persist?: boolean) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Initialize HistoryManager with optional limit/persist
  useEffect(() => {
    if (limit !== undefined || persist !== undefined) {
      const tempManager = new HistoryManager(limit ?? 10, persist ?? true);
      setHistory(tempManager.getHistory());
    } else {
      setHistory(historyManager.getHistory());
    }
  }, [limit, persist]);

  // Add a new item
  const add = useCallback((text: string) => {
    const item = historyManager.add(text);
    setHistory([...historyManager.getHistory()]);
    return item;
  }, []);

  // Clear history
  const clear = useCallback(() => {
    historyManager.clear();
    setHistory([]);
  }, []);

  return { history, add, clear };
}
