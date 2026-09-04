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
      path: string[] = [],
    ) {
      const nodeId = parentId ? `${parentId}-${keyName}` : "root";
      const currentPath = parentId ? [...path, keyName] : [];

      const isNull = data === null;
      const isArray = Array.isArray(data);
      const isObject = typeof data === "object" && !isNull && !isArray;

      rawNodes.push({
        id: nodeId,
        type: "jsonNode",
        position: { x: 0, y: 0 },
        data: {
          label: keyName,
          value: isObject ? "{Object}" : isArray ? "[Array]" : String(data),
          type: isNull ? "null" : typeof data,
          path: currentPath,
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
            traverse(val, nodeId, depth + 1, key, currentPath);
          },
        );
      } else if (isArray) {
        (data as unknown[]).forEach((val, index) => {
          traverse(val, nodeId, depth + 1, String(index), currentPath);
        });
      }
    }

    traverse(parsedData, null, 0);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return { nodes: [], edges: [] };
  }

  return getLayoutedElements(rawNodes, rawEdges);
}
