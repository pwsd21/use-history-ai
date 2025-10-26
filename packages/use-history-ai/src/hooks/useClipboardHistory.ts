import { useState, useEffect, useCallback } from "react";

export interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  type: "text" | "image" | "html";
}

export function useClipboardHistory(maxItems: number = 50) {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("clipboard-history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load clipboard history:", err);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("clipboard-history", JSON.stringify(history));
    }
  }, [history]);

  // Listen for copy events
  useEffect(() => {
    if (!isListening) return;

    const handleCopy = async (e: ClipboardEvent) => {
      try {
        const text = await navigator.clipboard.readText();

        if (text && text.trim()) {
          const newItem: ClipboardItem = {
            id: Date.now().toString(),
            text: text.trim(),
            timestamp: Date.now(),
            type: "text",
          };

          setHistory((prev) => {
            // Don't add duplicates of the last item
            if (prev[0]?.text === newItem.text) return prev;

            const updated = [newItem, ...prev];
            return updated.slice(0, maxItems);
          });
        }
      } catch (err) {
        console.error("Failed to read clipboard:", err);
      }
    };

    // Listen to copy events
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [isListening, maxItems]);

  const startListening = useCallback(() => {
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("clipboard-history");
  }, []);

  const removeItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      return false;
    }
  }, []);

  return {
    history,
    isListening,
    startListening,
    stopListening,
    clearHistory,
    removeItem,
    copyToClipboard,
  };
}
