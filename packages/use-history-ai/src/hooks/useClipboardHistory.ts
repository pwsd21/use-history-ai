import { useState, useEffect, useCallback } from "react";

export interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  type: "text" | "image" | "html";
  category?: string | undefined;
  tags?: string[] | undefined;
  favorite?: boolean | undefined;
}

export interface ClipboardHistoryOptions {
  maxItems?: number;
  enableKeyboardShortcuts?: boolean;
  autoSave?: boolean;
}

export function useClipboardHistory(options: ClipboardHistoryOptions = {}) {
  const {
    maxItems = 100,
    enableKeyboardShortcuts = true,
    autoSave = true,
  } = options;

  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (autoSave && history.length > 0) {
      localStorage.setItem("clipboard-history", JSON.stringify(history));
    }
  }, [history, autoSave]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+V to toggle history modal
      if (e.ctrlKey && e.shiftKey && e.key === "V") {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
      }

      // Escape to close modal
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [enableKeyboardShortcuts, isModalOpen]);

  // Listen for copy events
  useEffect(() => {
    if (!isListening) return;

    const handleCopy = async () => {
      try {
        const text = await navigator.clipboard.readText();

        if (text && text.trim()) {
          const newItem: ClipboardItem = {
            id: Date.now().toString(),
            text: text.trim(),
            timestamp: Date.now(),
            type: "text",
            tags: [],
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

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [isListening, maxItems]);

  // Filter history by search and category
  const filteredHistory = history.filter((item) => {
    const matchesSearch = searchQuery
      ? item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // Get all unique categories
  const categories = Array.from(
    new Set(
      history.filter((item) => item.category).map((item) => item.category)
    )
  );

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

  const addTag = useCallback((id: string, tag: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, tags: [...(item.tags || []), tag] as string[] }
          : item
      )
    );
  }, []);

  const removeTag = useCallback((id: string, tag: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              tags: (item.tags?.filter((t) => t !== tag) || []) as string[],
            }
          : item
      )
    );
  }, []);

  const setCategory = useCallback((id: string, category: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item))
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  }, []);

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clipboard-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [history]);

  const importHistory = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setHistory(imported);
        }
      } catch (err) {
        console.error("Failed to import history:", err);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    history: filteredHistory,
    allHistory: history,
    isListening,
    searchQuery,
    selectedCategory,
    categories,
    isModalOpen,
    setIsModalOpen,
    setSearchQuery,
    setSelectedCategory,
    startListening,
    stopListening,
    clearHistory,
    removeItem,
    copyToClipboard,
    addTag,
    removeTag,
    setCategory,
    toggleFavorite,
    exportHistory,
    importHistory,
  };
}
