import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAI } from "../src/hooks/useAI.js";

// Mock fetch
global.fetch = vi.fn();

describe("useAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useAI("test-api-key"));

    expect(result.current.loading).toBe(false);
    expect(result.current.response).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should generate AI response successfully", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: "This is a test response" }],
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useAI("test-api-key"));

    const promise = result.current.generate("test prompt");

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const response = await promise;

    expect(response.input).toBe("test prompt");
    expect(response.output).toBe("This is a test response");
    expect(result.current.error).toBe(null);
  });

  it("should handle API errors", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    const { result } = renderHook(() => useAI("invalid-key"));

    await expect(result.current.generate("test")).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.loading).toBe(false);
    });
  });
});
