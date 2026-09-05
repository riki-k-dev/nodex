import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
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

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> =>
    (await get(name)) || null,
  setItem: async (name: string, value: string): Promise<void> =>
    await set(name, value),
  removeItem: async (name: string): Promise<void> => await del(name),
};

const DEFAULT_JSON = `{
  "project": "JSON Visualizer",
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
  isProcessing: boolean;
  setJsonText: (text: string) => void;

  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  focusedNodeId: string | null;
  setFocusedNodeId: (id: string | null) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  updateNodeValue: (path: string[], newValue: unknown) => void;

  collapsedIds: string[];
  toggleNodeCollapse: (id: string) => void;
}

const initialGraph = parseJsonToGraph(DEFAULT_JSON);
let worker: Worker | null = null;

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      jsonText: DEFAULT_JSON,
      isValidJson: true,
      parseError: null,
      isProcessing: false,
      nodes: initialGraph.nodes,
      edges: initialGraph.edges,
      focusedNodeId: null,
      collapsedIds: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setJsonText: (text: string) => {
        let isValid = false;
        let error: string | null = null;
        try {
          if (text.trim() !== "") {
            JSON.parse(text);
            isValid = true;
          } else {
            isValid = true;
          }
        } catch (e: unknown) {
          error = e instanceof Error ? e.message : "Invalid JSON syntax";
        }

        if (!isValid || text.trim() === "") {
          set({
            jsonText: text,
            isValidJson: isValid,
            parseError: error,
            isProcessing: false,
            nodes: text.trim() === "" ? [] : get().nodes,
            edges: text.trim() === "" ? [] : get().edges,
          });
          return;
        }

        set({
          jsonText: text,
          isValidJson: true,
          parseError: null,
          isProcessing: true,
        });

        if (typeof window !== "undefined") {
          if (!worker)
            worker = new Worker(
              new URL("../lib/graph.worker.ts", import.meta.url),
              { type: "module" },
            );
          worker.onmessage = (e) => {
            if (e.data.type === "SUCCESS") {
              set({
                nodes: e.data.nodes,
                edges: e.data.edges,
                isProcessing: false,
              });
            } else {
              set({ isProcessing: false });
            }
          };
          worker.postMessage({ text, collapsedIds: get().collapsedIds });
        }
      },

      toggleNodeCollapse: (id: string) => {
        const current = get().collapsedIds;
        // Toggle logic
        const newCollapsed = current.includes(id)
          ? current.filter((cid) => cid !== id)
          : [...current, id];

        set({ collapsedIds: newCollapsed, isProcessing: true });

        if (worker) {
          worker.postMessage({
            text: get().jsonText,
            collapsedIds: newCollapsed,
          });
        }
      },

      updateNodeValue: (path: string[], newValue: unknown) => {
        const currentJson = get().jsonText;
        try {
          const obj = JSON.parse(currentJson);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let current: any = obj;
          for (let i = 0; i < path.length - 1; i++) current = current[path[i]];

          current[path[path.length - 1]] = newValue;
          get().setJsonText(JSON.stringify(obj, null, 2));
        } catch (error) {
          console.error("Failed to update node value", error);
        }
      },

      onNodesChange: (changes: NodeChange[]) =>
        set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes: EdgeChange[]) =>
        set({ edges: applyEdgeChanges(changes, get().edges) }),
      setNodes: (nodes: Node[]) => set({ nodes }),
      setEdges: (edges: Edge[]) => set({ edges }),
      setFocusedNodeId: (id: string | null) => set({ focusedNodeId: id }),
    }),
    {
      name: "json-graph-storage",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        jsonText: state.jsonText,
        nodes: state.nodes,
        edges: state.edges,
        isValidJson: state.isValidJson,
        collapsedIds: state.collapsedIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
