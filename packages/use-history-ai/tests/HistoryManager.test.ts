// packages/use-history-ai/tests/HistoryManager.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { HistoryManager } from "../src/index.js";

describe("HistoryManager", () => {
  let manager: HistoryManager;

  beforeEach(() => {
    manager = new HistoryManager(3, false); // limit=3, no persist
  });

  it("adds items to history", () => {
    manager.add("first");
    manager.add("second");

    const history = manager.getHistory();
    expect(history.length).toBe(2);
    expect(history[0].text).toBe("second"); // newest comes first
  });

  it("respects history limit", () => {
    manager.add("1");
    manager.add("2");
    manager.add("3");
    manager.add("4");

    const history = manager.getHistory();
    expect(history.length).toBe(3);
    expect(history[0].text).toBe("4");
    expect(history.at(-1)?.text).toBe("2");
  });

  it("clears history", () => {
    manager.add("temp");
    expect(manager.getHistory().length).toBe(1);

    manager.clear();
    expect(manager.getHistory().length).toBe(0);
  });
});
