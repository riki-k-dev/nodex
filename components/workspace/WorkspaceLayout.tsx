"use client";

import { useState } from "react";
import { CornerBox } from "@/components/ui/CornerBox";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { JsonEditor } from "@/components/editor/JsonEditor";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { useGraphStore } from "@/store/graph-store";
import {
  AlertCircle,
  Maximize2,
  Minimize2,
  Search,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/ui/CommandPalette";

type ViewMode = "split" | "editor" | "graph";

export function WorkspaceLayout() {
  const jsonText = useGraphStore((state) => state.jsonText);
  const setJsonText = useGraphStore((state) => state.setJsonText);
  const isValidJson = useGraphStore((state) => state.isValidJson);
  const parseError = useGraphStore((state) => state.parseError);
  const isProcessing = useGraphStore((state) => state.isProcessing);

  const [viewMode, setViewMode] = useState<ViewMode>("split");

  return (
    <div className="h-screen w-full bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-mono transition-colors duration-200 overflow-hidden">
      {/* Header with Search Hint */}
      <header className="h-14 border-b border-zinc-300 dark:border-zinc-900 px-6 flex items-center justify-between bg-white dark:bg-black/50 backdrop-blur-md shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-orange-500 rounded-none shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
            JSON Graph Visualizer
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Cmd/Ctrl + K Hint */}
          <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest border-r border-zinc-300 dark:border-zinc-800 pr-4">
            <Search className="w-3 h-3" />
            <span>Search</span>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-none">
                Cmd
              </kbd>
              <span className="text-zinc-400">/</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-none">
                Ctrl
              </kbd>
              <span className="text-zinc-400">+</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-none">
                K
              </kbd>
            </div>
          </div>

          <ThemeToggle />
          <button className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-white dark:bg-transparent font-medium transition-colors uppercase tracking-widest cursor-pointer">
            Deploy
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 lg:p-8 min-h-0 overflow-hidden relative">
        <AnimatePresence initial={false}>
          {/* Editor Panel */}
          {(viewMode === "split" || viewMode === "editor") && (
            <motion.div
              key="editor-panel"
              layout
              initial={{ opacity: 0, flex: 0 }}
              animate={{ opacity: 1, flex: 1 }}
              exit={{ opacity: 0, flex: 0, padding: 0, margin: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="min-w-0 min-h-0 flex flex-col overflow-hidden"
            >
              <CornerBox className="flex-1 flex flex-col min-h-0">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex justify-between items-center shrink-0">
                  <h2 className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 tracking-widest">
                    Editor
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      payload.json
                    </span>
                    <button
                      onClick={() =>
                        setViewMode(viewMode === "editor" ? "split" : "editor")
                      }
                      className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      {viewMode === "editor" ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-0 bg-white dark:bg-[#1e1e1e] border border-zinc-300 dark:border-zinc-800 rounded-sm overflow-hidden flex flex-col">
                  <JsonEditor
                    value={jsonText}
                    onChange={(val) => setJsonText(val || "")}
                  />
                </div>
              </CornerBox>
            </motion.div>
          )}

          {/* Graph Engine Panel */}
          {(viewMode === "split" || viewMode === "graph") && (
            <motion.div
              key="graph-panel"
              layout
              initial={{ opacity: 0, flex: 0 }}
              animate={{ opacity: 1, flex: 1 }}
              exit={{ opacity: 0, flex: 0, padding: 0, margin: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="min-w-0 min-h-0 flex flex-col overflow-hidden"
            >
              <CornerBox className="flex-1 flex flex-col min-h-0">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex justify-between items-center shrink-0">
                  <h2 className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 tracking-widest flex items-center gap-2">
                    Graph Engine
                    {isProcessing && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                    )}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Node View
                    </span>
                    <button
                      onClick={() =>
                        setViewMode(viewMode === "graph" ? "split" : "graph")
                      }
                      className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      {viewMode === "graph" ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div
                  className={`flex-1 w-full min-h-0 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-sm overflow-hidden flex flex-col bg-zinc-50 dark:bg-[#0c0c0c] transition-opacity duration-300 ${isProcessing ? "opacity-50" : "opacity-100"}`}
                >
                  <GraphCanvas />
                </div>
              </CornerBox>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cmd+K Search Palette */}
      <CommandPalette />

      {/* Floating Error Badge */}
      {!isValidJson && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex flex-col items-center gap-1 px-6 py-3 bg-zinc-50 dark:bg-[#0a0a0a] text-red-600 dark:text-red-500 border-2 border-dashed border-red-500/50 rounded-none font-medium shadow-2xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm uppercase tracking-widest font-bold">
                Invalid JSON
              </span>
            </div>
            {parseError && (
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-md text-center text-balance">
                {parseError}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
