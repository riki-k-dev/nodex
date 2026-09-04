import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 250;
const NODE_HEIGHT = 80;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Setup dagre graph configuration
  // rankdir: LR = Left to Right
  // nodesep: Space between nodes vertically
  // ranksep: Space between columns horizontally
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 30,
    ranksep: 120,
  });

  // Assign dimensions to nodes for layout calculation
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Execute the layout algorithm
  dagre.layout(dagreGraph);

  // Map the calculated positions back to React Flow nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        // Dagre returns the center point, React Flow uses top-left origin by default
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
