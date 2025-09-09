import { useState } from "react";
import { useHistory } from "use-history-ai";

export default function App() {
  const { history, add, clear } = useHistory();
  const [input, setInput] = useState("");

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>AI History Demo</h1>

      <input
        type="text"
        placeholder="Type something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button
        onClick={() => {
          if (input.trim() !== "") add(input);
          setInput("");
        }}
        style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
      >
        Add
      </button>
      <button
        onClick={clear}
        style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
      >
        Clear
      </button>

      <ul style={{ marginTop: "1rem" }}>
        {history.map((item) => (
          <li key={item.id}>
            <strong>{new Date(item.timestamp).toLocaleTimeString()}:</strong>{" "}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
