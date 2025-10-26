export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
}

export class HistoryManager {
  private limit: number;
  private persist: boolean;
  private key = "use-history-ai";
  private history: HistoryItem[];

  constructor(limit = 10, persist = true) {
    this.limit = limit;
    this.persist = persist;
    this.history = this.load();
  }

  private load(): HistoryItem[] {
    if (!this.persist) return [];
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  private save() {
    if (this.persist) {
      localStorage.setItem(this.key, JSON.stringify(this.history));
    }
  }

  add(text: string): HistoryItem {
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
    };
    this.history.unshift(item);
    if (this.history.length > this.limit) this.history.pop();
    this.save();
    return item;
  }

  clear() {
    this.history = [];
    this.save();
  }

  getHistory(): HistoryItem[] {
    return this.history;
  }
}

export * from "./hooks/useAI.js";
export * from "./hooks/useHistory.js";
export * from "./hooks/useHistoryAI.js";
export * from "./hooks/useClipboardHistory.js";
export type { AIResponse } from "./hooks/useAI.js";
