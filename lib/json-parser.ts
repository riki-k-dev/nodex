import { Node, Edge } from "@xyflow/react";
import { getLayoutedElements } from "./layout-engine";

export function parseJsonToGraph(jsonString: string) {
  const rawNodes: Node[] = [];
  const rawEdges: Edge[] = [];

  try {
    const parsedData = JSON.parse(jsonString);

    function traverse(
      data: unknown,
      parentId: string | null,
      depth: number,
      keyName: string = "root",
    ) {
      const nodeId = parentId ? `${parentId}-${keyName}` : "root";

      const isNull = data === null;
      const isArray = Array.isArray(data);
      const isObject = typeof data === "object" && !isNull && !isArray;

      rawNodes.push({
        id: nodeId,
        type: "jsonNode",
        position: { x: 0, y: 0 }, // Position will be overwritten by Dagre
        data: {
          label: keyName,
          value: isObject ? "{Object}" : isArray ? "[Array]" : String(data),
          type: isNull ? "null" : typeof data,
        },
      });

      if (parentId) {
        rawEdges.push({
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#f97316" },
        });
      }

      if (isObject) {
        Object.entries(data as Record<string, unknown>).forEach(
          ([key, val]) => {
            traverse(val, nodeId, depth + 1, key);
          },
        );
      } else if (isArray) {
        (data as unknown[]).forEach((val, index) => {
          traverse(val, nodeId, depth + 1, String(index));
        });
      }
    }

    traverse(parsedData, null, 0);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return { nodes: [], edges: [] };
  }

  // Pass the raw arrays into Dagre before returning
  return getLayoutedElements(rawNodes, rawEdges);
}
