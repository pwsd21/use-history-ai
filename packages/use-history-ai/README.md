# use-history-ai

AI-powered clipboard history manager for React with Google Gemini integration.

[![npm version](https://img.shields.io/npm/v/use-history-ai)](https://www.npmjs.com/package/use-history-ai)
[![npm downloads](https://img.shields.io/npm/dw/use-history-ai)](https://www.npmjs.com/package/use-history-ai)
[![license](https://img.shields.io/npm/l/use-history-ai)](https://github.com/pwsd21/use-history-ai/blob/main/LICENSE)

## Installation

```bash
npm install use-history-ai
```

## Features

- 📋 Automatic clipboard monitoring
- 💾 Persistent localStorage storage
- 🔍 Search and filter
- 🏷️ Tags and categories
- ⭐ Favorites
- 📤 Export/Import JSON
- 🤖 AI-powered analysis with Google Gemini
- ⌨️ Keyboard shortcuts

## Quick Start

### Basic Clipboard History

```tsx
import { useClipboardHistory } from 'use-history-ai';

function App() {
  const {
    history,
    isListening,
    startListening,
    stopListening,
    clearHistory
  } = useClipboardHistory();

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop
      </button>
      <button onClick={clearHistory}>Clear</button>

      {history.map((item) => (
        <div key={item.id}>
          <p>{item.text}</p>
          <small>{new Date(item.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
```

### With AI Features

```tsx
import { useHistoryAI } from 'use-history-ai';

function App() {
  const {
    history,
    startListening,
    analyzeHistory,
    summarizeHistory,
    loading,
    response,
    error
  } = useHistoryAI('your-gemini-api-key');

  return (
    <div>
      <button onClick={startListening}>Start</button>
      
      <button onClick={summarizeHistory} disabled={loading}>
        Summarize
      </button>

      <button onClick={() => analyzeHistory('Find all URLs')} disabled={loading}>
        Analyze
      </button>

      {response && <p>{response.output}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## API Reference

### `useClipboardHistory(options?)`

Basic clipboard history management.

#### Options

```typescript
interface ClipboardHistoryOptions {
  maxItems?: number;              // Default: 100
  enableKeyboardShortcuts?: boolean; // Default: true
  autoSave?: boolean;             // Default: true
}
```

#### Returns

```typescript
{
  // State
  history: ClipboardItem[];           // Filtered items
  allHistory: ClipboardItem[];        // All items
  isListening: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  categories: string[];
  isModalOpen: boolean;
  
  // Actions
  startListening: () => void;
  stopListening: () => void;
  clearHistory: () => void;
  removeItem: (id: string) => void;
  copyToClipboard: (text: string) => Promise<boolean>;
  
  // Tags & Categories
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  setCategory: (id: string, category: string) => void;
  toggleFavorite: (id: string) => void;
  
  // Import/Export
  exportHistory: () => void;
  importHistory: (file: File) => void;
  
  // Filters
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setIsModalOpen: (open: boolean) => void;
}
```

#### ClipboardItem Type

```typescript
interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  type: "text" | "image" | "html";
  category?: string;
  tags?: string[];
  favorite?: boolean;
}
```

### `useHistoryAI(apiKey)`

Clipboard history with AI analysis.

#### Parameters

- `apiKey` (string, required): Google Gemini API key

#### Returns

All properties from `useClipboardHistory` plus:

```typescript
{
  // AI State
  loading: boolean;
  response: AIResponse | null;
  error: string | null;
  
  // AI Actions
  analyzeHistory: (prompt: string) => Promise<AIResponse>;
  summarizeHistory: () => Promise<AIResponse>;
  findInHistory: (query: string) => Promise<AIResponse>;
  generate: (prompt: string) => Promise<AIResponse>;
}
```

#### AIResponse Type

```typescript
interface AIResponse {
  input: string;
  output: string;
}
```

### `useHistory(limit?, persist?)`

Simple history manager (no clipboard monitoring).

#### Parameters

- `limit` (number, default: 10): Maximum items
- `persist` (boolean, default: true): Enable localStorage

#### Returns

```typescript
{
  history: HistoryItem[];
  addItem: (text: string) => HistoryItem;
  clearHistory: () => void;
  getHistory: () => HistoryItem[];
}
```

### `useAI(apiKey, model?)`

AI text generation hook.

#### Parameters

- `apiKey` (string, required): Google Gemini API key
- `model` (string, default: "gemini-2.5-flash"): Model name

#### Returns

```typescript
{
  loading: boolean;
  response: AIResponse | null;
  error: string | null;
  generate: (prompt: string) => Promise<AIResponse>;
}
```

### `HistoryManager` Class

Low-level history management class.

```typescript
const manager = new HistoryManager(limit?, persist?);

manager.add(text: string): HistoryItem;
manager.clear(): void;
manager.getHistory(): HistoryItem[];
```

## Usage Examples

### Search and Filter

```tsx
const { 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories 
} = useClipboardHistory();

<input 
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search..."
/>

<select 
  value={selectedCategory || ''}
  onChange={(e) => setSelectedCategory(e.target.value || null)}
>
  <option value="">All</option>
  {categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
```

### Tags and Categories

```tsx
const { addTag, setCategory, toggleFavorite } = useClipboardHistory();

<button onClick={() => addTag(item.id, 'important')}>
  Add Tag
</button>

<button onClick={() => setCategory(item.id, 'Code')}>
  Set Category
</button>

<button onClick={() => toggleFavorite(item.id)}>
  {item.favorite ? '★' : '☆'}
</button>
```

### Export/Import

```tsx
const { exportHistory, importHistory } = useClipboardHistory();

// Export
<button onClick={exportHistory}>Export JSON</button>

// Import
<input 
  type="file" 
  accept=".json"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) importHistory(file);
  }}
/>
```

### AI Analysis

```tsx
const { 
  analyzeHistory, 
  summarizeHistory, 
  findInHistory,
  loading, 
  response 
} = useHistoryAI('your-api-key');

// Summarize
<button onClick={summarizeHistory} disabled={loading}>
  Summarize History
</button>

// Custom prompt
<button onClick={() => analyzeHistory('Find all code snippets')}>
  Find Code
</button>

// Search with AI
<button onClick={() => findInHistory('React hooks')}>
  Find React Topics
</button>

{response && <p>{response.output}</p>}
```

## Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. Use in `useHistoryAI` or `useAI`

## Keyboard Shortcuts

Default shortcuts (can be disabled):

- **Ctrl+Shift+V** - Toggle history modal
- **Escape** - Close modal

Disable shortcuts:
```tsx
useClipboardHistory({ enableKeyboardShortcuts: false })
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ❌ Internet Explorer
- ❌ React Native

## Requirements

- React 18+ or 19+
- Modern browser with Clipboard API

## Important Notes

### Next.js Compatibility

`useHistoryAI` uses `@google/genai` which has Node.js dependencies. For Next.js client components, use `useClipboardHistory` only:

```tsx
"use client";
import { useClipboardHistory } from 'use-history-ai';
// Don't use useHistoryAI in client components
```

### Security

⚠️ Never expose API keys in client code! Use environment variables or server-side routes.

## License

MIT © Pawan Sachdeva

## Links

- **NPM:** https://www.npmjs.com/package/use-history-ai
- **GitHub:** https://github.com/pwsd21/use-history-ai
- **Issues:** https://github.com/pwsd21/use-history-ai/issues

## Author

**Pawan Sachdeva**  
Email: pawansachdeva1998@gmail.com  
GitHub: [@pwsd21](https://github.com/pwsd21)