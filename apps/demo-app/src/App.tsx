import { useState } from "react";
import { useHistoryAI } from "use-history-ai";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  const {
    history,
    isListening,
    startListening,
    stopListening,
    clearHistory,
    removeItem,
    copyToClipboard,
    loading,
    response,
    error,
    analyzeHistory,
    summarizeHistory,
  } = useHistoryAI(apiKey);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    try {
      await analyzeHistory(prompt);
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  const handleSummarize = async () => {
    try {
      await summarizeHistory();
    } catch (err) {
      console.error("Summarize failed:", err);
    }
  };

  return (
    <div className="app">
      <h1>📋 Clipboard History + AI</h1>
      <p className="subtitle">Powered by Google Gemini AI</p>

      {!apiKey && (
        <div className="warning">
          ⚠️ <strong>API Key Missing!</strong>
          <br />
          Create <code>.env.local</code> with:{" "}
          <code>VITE_GEMINI_API_KEY=your_key</code>
        </div>
      )}

      {/* Clipboard Controls */}
      <div className="controls">
        <button
          onClick={isListening ? stopListening : startListening}
          className={isListening ? "active" : ""}
        >
          {isListening ? "⏸️ Stop Listening" : "▶️ Start Listening"}
        </button>
        <button onClick={clearHistory} disabled={history.length === 0}>
          🗑️ Clear History ({history.length})
        </button>
        <button
          onClick={handleSummarize}
          disabled={history.length === 0 || loading || !apiKey}
        >
          ✨ Summarize History
        </button>
      </div>

      {/* Clipboard History */}
      <div className="history-section">
        <h3>📋 Clipboard History ({history.length})</h3>
        {history.length === 0 ? (
          <p className="empty">
            {isListening
              ? "Copy something (Ctrl+C) to see it here..."
              : 'Click "Start Listening" to track your clipboard'}
          </p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="item-content">
                  <span className="item-text">{item.text}</span>
                  <span className="item-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => copyToClipboard(item.text)}
                    title="Copy"
                  >
                    📋
                  </button>
                  <button onClick={() => removeItem(item.id)} title="Remove">
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <div className="ai-section">
        <h3>🤖 Ask AI About Your Clipboard</h3>
        <form onSubmit={handleAnalyze}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI to analyze your clipboard history...
Examples:
- What are the main topics I've been copying?
- Find all the URLs I copied
- Organize these items by category"
            rows={4}
            disabled={loading || !apiKey || history.length === 0}
          />
          <button
            type="submit"
            disabled={
              loading || !apiKey || !prompt.trim() || history.length === 0
            }
          >
            {loading ? "⏳ Analyzing..." : "🔍 Analyze"}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* AI Response */}
      {response && (
        <div className="response">
          <h3>🤖 AI Analysis:</h3>
          <div className="output">{response.output}</div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing your clipboard history...</p>
        </div>
      )}
    </div>
  );
}

export default App;
