import { randomUUID as nodeRandomUUID } from "crypto";

export type HistoryItem = {
  id: string;
  text: string;
  timestamp: number;
};

function generateId(): string {
  if (typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  if (typeof nodeRandomUUID === "function") {
    return nodeRandomUUID();
  }

  // Fallback
  return Math.random().toString(36).substring(2, 9);
}


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
      id: generateId(),
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
