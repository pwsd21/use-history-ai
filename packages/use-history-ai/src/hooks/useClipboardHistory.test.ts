import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboardHistory } from "./useClipboardHistory.js";

describe("useClipboardHistory", () => {
  it("should initialize with empty history", () => {
    const { result } = renderHook(() => useClipboardHistory());
    expect(result.current.history).toEqual([]);
    expect(result.current.isListening).toBe(false);
  });

  it("should start and stop listening", () => {
    const { result } = renderHook(() => useClipboardHistory());

    act(() => {
      result.current.startListening();
    });
    expect(result.current.isListening).toBe(true);

    act(() => {
      result.current.stopListening();
    });
    expect(result.current.isListening).toBe(false);
  });

  it("should clear history", () => {
    const { result } = renderHook(() => useClipboardHistory());

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
  });

  it("should filter by search query", () => {
    const { result } = renderHook(() => useClipboardHistory());

    act(() => {
      result.current.setSearchQuery("test");
    });

    expect(result.current.searchQuery).toBe("test");
  });
});
