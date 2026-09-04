import { parseJsonToGraph } from "./json-parser";

self.onmessage = (e: MessageEvent) => {
  const { text, collapsedIds = [] } = e.data;

  try {
    const { nodes, edges } = parseJsonToGraph(text, collapsedIds);
    self.postMessage({ type: "SUCCESS", nodes, edges });
  } catch {
    self.postMessage({
      type: "ERROR",
      message: "Failed to process graph layout",
    });
  }
};
