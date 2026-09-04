import { CornerBox } from "@/components/ui/CornerBox";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function WorkspaceLayout() {
  return (
    <div className="min-h-screen w-full bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-mono transition-colors duration-200">
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
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 tracking-widest">
              Editor
            </h2>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              payload.json
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-medium text-sm border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0c] transition-colors rounded-sm">
            [ Monaco Editor Workspace ]
          </div>
        </CornerBox>

        {/* Graph Visualizer Side */}
        <CornerBox className="h-[calc(100vh-8rem)] flex flex-col">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 tracking-widest">
              Graph Engine
            </h2>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Node View
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-medium text-sm border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0c0c0c] transition-colors rounded-sm">
            [ React Flow Canvas ]
          </div>
        </CornerBox>
      </main>
    </div>
  );
}
