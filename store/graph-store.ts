import { create } from "zustand";
import {
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { parseJsonToGraph } from "@/lib/json-parser";

const DEFAULT_JSON = `{
  "project": "JSON Graph Visualizer",
  "status": "in-progress",
  "techStack": ["Next.js", "React Flow", "Monaco Editor"],
  "features": {
    "localFirst": true,
    "webWorkers": true,
    "visualDiffing": false
  }
}`;

export interface GraphState {
  jsonText: string;
  isValidJson: boolean;
  parseError: string | null;
  setJsonText: (text: string) => void;

  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

const initialGraph = parseJsonToGraph(DEFAULT_JSON);

export const useGraphStore = create<GraphState>((set, get) => ({
  jsonText: DEFAULT_JSON,
  isValidJson: true,
  parseError: null,

  nodes: initialGraph.nodes,
  edges: initialGraph.edges,

  setJsonText: (text: string) => {
    let isValid = false;
    let error: string | null = null;
    let newNodes = get().nodes;
    let newEdges = get().edges;

    try {
      if (text.trim() !== "") {
        JSON.parse(text);
        isValid = true;

        const graph = parseJsonToGraph(text);
        newNodes = graph.nodes;
        newEdges = graph.edges;
      } else {
        isValid = true;
        newNodes = [];
        newEdges = [];
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = "Invalid JSON syntax";
      }
    }

    set({
      jsonText: text,
      isValidJson: isValid,
      parseError: error,
      nodes: newNodes,
      edges: newEdges,
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
}));
