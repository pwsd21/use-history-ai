import { useState, useRef } from "react";
import { useHistoryAI } from "use-history-ai";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedItemForTag, setSelectedItemForTag] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  const {
    history,
    allHistory,
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

  const handleAddTag = (itemId: string) => {
    if (newTag.trim()) {
      addTag(itemId, newTag.trim());
      setNewTag("");
      setSelectedItemForTag(null);
    }
  };

  const handleSetCategory = (itemId: string) => {
    if (newCategory.trim()) {
      setCategory(itemId, newCategory.trim());
      setNewCategory("");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importHistory(file);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📋 AI Clipboard Manager</h1>
        <p className="subtitle">Powered by Google Gemini AI</p>

        <div className="keyboard-hint">
          💡 Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> to toggle
          history
        </div>
      </header>

      {!apiKey && (
        <div className="warning">
          ⚠️ <strong>API Key Missing!</strong>
          <br />
          Create <code>.env.local</code> with:{" "}
          <code>VITE_GEMINI_API_KEY=your_key</code>
        </div>
      )}

      {/* Main Controls */}
      <div className="controls">
        <button
          onClick={isListening ? stopListening : startListening}
          className={isListening ? "active pulse" : ""}
        >
          {isListening ? "⏸️ Stop Listening" : "▶️ Start Listening"}
        </button>

        <button onClick={() => setIsModalOpen(!isModalOpen)}>
          📋 View History ({allHistory.length})
        </button>

        <button onClick={exportHistory} disabled={allHistory.length === 0}>
          💾 Export
        </button>

        <button onClick={() => fileInputRef.current?.click()}>📥 Import</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: "none" }}
        />

        <button
          onClick={clearHistory}
          disabled={allHistory.length === 0}
          className="danger"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Search and Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search clipboard history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Clipboard History */}
      <div className="history-section">
        <h3>
          📋 Clipboard History
          {searchQuery && ` - Found ${history.length} items`}
        </h3>

        {history.length === 0 ? (
          <p className="empty">
            {isListening
              ? searchQuery
                ? "No items match your search"
                : "Copy something (Ctrl+C) to see it here..."
              : 'Click "Start Listening" to track your clipboard'}
          </p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="item-header">
                  <span className="item-time">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="fav-btn"
                    title={
                      item.favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {item.favorite ? "⭐" : "☆"}
                  </button>
                </div>

                <div className="item-content">
                  <div className="item-text">{item.text}</div>

                  {item.category && (
                    <span className="category-badge">{item.category}</span>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                          <button onClick={() => removeTag(item.id, tag)}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => copyToClipboard(item.text)}
                    title="Copy"
                  >
                    📋 Copy
                  </button>

                  <button
                    onClick={() =>
                      setSelectedItemForTag(
                        selectedItemForTag === item.id ? null : item.id
                      )
                    }
                    title="Add tag"
                  >
                    🏷️ Tag
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    title="Remove"
                    className="danger"
                  >
                    ❌
                  </button>
                </div>

                {selectedItemForTag === item.id && (
                  <div className="tag-input-container">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddTag(item.id)
                      }
                    />
                    <button onClick={() => handleAddTag(item.id)}>Add</button>

                    <input
                      type="text"
                      placeholder="Set category..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSetCategory(item.id)
                      }
                    />
                    <button onClick={() => handleSetCategory(item.id)}>
                      Set
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Section */}
      <div className="ai-section">
        <h3>🤖 AI Analysis</h3>

        <div className="quick-ai-actions">
          <button
            onClick={handleSummarize}
            disabled={allHistory.length === 0 || loading || !apiKey}
          >
            ✨ Summarize History
          </button>
          <button
            onClick={() => analyzeHistory("Categorize all items")}
            disabled={allHistory.length === 0 || loading || !apiKey}
          >
            📊 Auto-Categorize
          </button>
          <button
            onClick={() => analyzeHistory("Find all URLs")}
            disabled={allHistory.length === 0 || loading || !apiKey}
          >
            🔗 Extract URLs
          </button>
        </div>

        <form onSubmit={handleAnalyze}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI about your clipboard history...

Examples:
- What are the main topics I've been copying?
- Find all code snippets
- Translate all items to Spanish
- Create a summary of all links"
            rows={4}
            disabled={loading || !apiKey || allHistory.length === 0}
          />
          <button
            type="submit"
            disabled={
              loading || !apiKey || !prompt.trim() || allHistory.length === 0
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
          <h3>🤖 AI Response:</h3>
          <div className="output">{response.output}</div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing your clipboard history...</p>
        </div>
      )}

      {/* Modal for Quick View */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Quick History View</h2>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-content">
              {history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="modal-item"
                  onClick={() => {
                    copyToClipboard(item.text);
                    setIsModalOpen(false);
                  }}
                >
                  <div className="modal-item-text">{item.text}</div>
                  <div className="modal-item-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
