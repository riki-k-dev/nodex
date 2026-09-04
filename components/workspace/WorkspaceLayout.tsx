"use client";

import { CornerBox } from "@/components/ui/CornerBox";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { JsonEditor } from "@/components/editor/JsonEditor";
import { useGraphStore } from "@/store/graph-store";
import { AlertCircle } from "lucide-react";

export function WorkspaceLayout() {
  const jsonText = useGraphStore((state) => state.jsonText);
  const setJsonText = useGraphStore((state) => state.setJsonText);
  const isValidJson = useGraphStore((state) => state.isValidJson);
  const parseError = useGraphStore((state) => state.parseError);

  return (
    <div className="min-h-screen w-full bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-mono transition-colors duration-200 relative">
      {/* Minimal Header */}
      <header className="h-14 border-b border-zinc-300 dark:border-zinc-900 px-6 flex items-center justify-between bg-white dark:bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-orange-500 rounded-none shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
          <h1 className="text-sm font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
            JSON Graph Visualizer
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <ThemeToggle />
          <button className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-white dark:bg-transparent font-medium transition-colors uppercase tracking-widest cursor-pointer">
            Deploy
          </button>
        </div>
      </header>

      {/* Main Split View */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8">
        {/* Editor Side */}
        <CornerBox className="h-[calc(100vh-8rem)] flex flex-col">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 tracking-widest">
              Editor
            </h2>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              payload.json
            </span>
          </div>
          <div className="flex-1 w-full h-full bg-white dark:bg-[#1e1e1e] border border-zinc-300 dark:border-zinc-800 rounded-sm overflow-hidden">
            <JsonEditor
              value={jsonText}
              onChange={(val) => setJsonText(val || "")}
            />
          </div>
        </CornerBox>

        {/* Graph Visualizer Side */}
        <CornerBox className="h-[calc(100vh-8rem)] flex flex-col">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex justify-between items-center shrink-0">
            <h2 className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 tracking-widest">
              Graph Engine
            </h2>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Node View
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-medium text-sm border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0c] transition-colors rounded-sm overflow-hidden">
            [ React Flow Canvas ]
          </div>
        </CornerBox>
      </main>

      {/* Floating Error Badge */}
      {!isValidJson && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
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
