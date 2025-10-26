# use-history-ai

AI-powered clipboard history manager for React with Google Gemini integration.

## Features

✨ **Smart Clipboard Management**
- Automatically captures clipboard history
- Persistent storage across sessions
- Search and filter clipboard items
- Export/import functionality

🤖 **AI-Powered**
- Summarize clipboard content
- Ask questions about your clipboard history
- Powered by Google Gemini AI

📦 **Easy to Use**
- Simple React hook interface
- TypeScript support
- Zero configuration required

## Installation

```bash
npm install use-history-ai
```

## Quick Start

```tsx
import { useClipboardHistory } from 'use-history-ai';

function App() {
  const {
    history,
    addToHistory,
    clearHistory,
    searchHistory,
    askAI,
    summarizeHistory
  } = useClipboardHistory({
    geminiApiKey: 'your-api-key-here',
    maxItems: 100
  });

  return (
    <div>
      <h1>Clipboard History</h1>
      
      {/* Display history */}
      {history.map((item) => (
        <div key={item.id}>
          <p>{item.text}</p>
          <small>{new Date(item.timestamp).toLocaleString()}</small>
        </div>
      ))}

      {/* Add manually */}
      <button onClick={() => addToHistory('New clipboard item')}>
        Add Item
      </button>

      {/* Search */}
      <input 
        onChange={(e) => {
          const results = searchHistory(e.target.value);
          console.log(results);
        }}
        placeholder="Search history..."
      />

      {/* AI Features */}
      <button onClick={async () => {
        const summary = await summarizeHistory();
        console.log(summary);
      }}>
        Summarize
      </button>

      <button onClick={async () => {
        const answer = await askAI('What did I copy about React?');
        console.log(answer);
      }}>
        Ask AI
      </button>
    </div>
  );
}
```

## API Reference

### `useClipboardHistory(options)`

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `geminiApiKey` | `string` | - | Google Gemini API key (required for AI features) |
| `maxItems` | `number` | `100` | Maximum number of items to store |
| `storageKey` | `string` | `'clipboard-history'` | LocalStorage key for persistence |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `history` | `ClipboardItem[]` | Array of clipboard items |
| `addToHistory` | `(text: string) => void` | Add item to history |
| `removeFromHistory` | `(id: string) => void` | Remove specific item |
| `clearHistory` | `() => void` | Clear all history |
| `searchHistory` | `(query: string) => ClipboardItem[]` | Search history |
| `exportHistory` | `() => string` | Export as JSON |
| `importHistory` | `(json: string) => void` | Import from JSON |
| `askAI` | `(question: string) => Promise<string>` | Ask AI about clipboard |
| `summarizeHistory` | `() => Promise<string>` | Get AI summary |

#### Types

```typescript
interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
}
```

## Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. Use it in the hook configuration

## Examples

### Basic Usage

```tsx
const { history, addToHistory } = useClipboardHistory({
  geminiApiKey: process.env.VITE_GEMINI_API_KEY
});
```

### Search History

```tsx
const results = searchHistory('react hooks');
console.log(results); // All items containing "react hooks"
```

### AI Summary

```tsx
const summary = await summarizeHistory();
console.log(summary); // AI-generated summary of clipboard history
```

### Export/Import

```tsx
// Export
const json = exportHistory();
localStorage.setItem('backup', json);

// Import
const backup = localStorage.getItem('backup');
importHistory(backup);
```

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- React Native: ❌ (Web only)

## Requirements

- React 18+
- Node.js 16+
- Modern browser with localStorage support

## License

MIT © Pawan Sachdeva

## Contributing

Contributions welcome! Please open an issue or PR.

## Links

- [GitHub](https://github.com/pwsd21/use-history-ai)
- [NPM](https://www.npmjs.com/package/use-history-ai)
- [Demo](https://use-history-ai-demo.vercel.app) *(coming soon)*

## Support

If you find this useful, please ⭐️ star the repo!