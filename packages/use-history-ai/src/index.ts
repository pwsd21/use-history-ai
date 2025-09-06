export type HistoryItem = {
  id: string;
  text: string;
  timestamp: number;
};

export class HistoryManager {
  private history: HistoryItem[] = [];
  private limit: number;
  private persist: boolean;

  constructor(limit = 10, persist = true) {
    this.limit = limit;
    this.persist = persist;

    if (this.persist && typeof window !== "undefined") {
      const saved = localStorage.getItem("ai-history");
      if (saved) {
        this.history = JSON.parse(saved);
      }
    }
  }

  add(text: string) {
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
    };

    this.history.unshift(item);
    if (this.history.length > this.limit) {
      this.history.pop();
    }

    if (this.persist && typeof window !== "undefined") {
      localStorage.setItem("ai-history", JSON.stringify(this.history));
    }

    return item;
  }

  getHistory() {
    return this.history;
  }

  clear() {
    this.history = [];
    if (this.persist && typeof window !== "undefined") {
      localStorage.removeItem("ai-history");
    }
  }
}
