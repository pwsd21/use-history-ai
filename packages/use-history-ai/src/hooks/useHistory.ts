import { useState, useCallback, useEffect } from "react";
import { HistoryItem, HistoryManager } from "../index.js";

export function useHistory(limit = 10, persist = true) {
  const [manager] = useState(() => new HistoryManager(limit, persist));
  const [history, setHistory] = useState<HistoryItem[]>(manager.getHistory());

  const addItem = useCallback(
    (text: string) => {
      const item = manager.add(text);
      setHistory([...manager.getHistory()]);
      return item;
    },
    [manager]
  );

  const clearHistory = useCallback(() => {
    manager.clear();
    setHistory([]);
  }, [manager]);

  const getHistory = useCallback(() => manager.getHistory(), [manager]);

  useEffect(() => {
    setHistory(manager.getHistory());
  }, [manager]);

  return { history, addItem, clearHistory, getHistory };
}
