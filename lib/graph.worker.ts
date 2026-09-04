import { parseJsonToGraph } from "./json-parser";

self.onmessage = (e: MessageEvent) => {
  const { text } = e.data;

  try {
    const { nodes, edges } = parseJsonToGraph(text);
    self.postMessage({ type: "SUCCESS", nodes, edges });
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      message: "Failed to process graph layout",
    });
  }
};
