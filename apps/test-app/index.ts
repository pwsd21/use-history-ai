import { HistoryManager } from "use-history-ai";

function runTests() {
  const manager = new HistoryManager(3, false); // limit = 3, persist = false (so localStorage use nahi hoga)

  console.log("➡️ Adding items...");
  manager.add("First");
  manager.add("Second");
  manager.add("Third");
  manager.add("Fourth"); // yeh add hote hi "First" drop ho jayega (limit = 3)

  console.log("📜 Current History:", manager.getHistory());

  console.log("➡️ Clearing history...");
  manager.clear();

  console.log("📜 After clear:", manager.getHistory());
}

runTests();
