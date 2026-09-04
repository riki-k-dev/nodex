"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useGraphStore } from "@/store/graph-store";
import { Search } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const nodes = useGraphStore((state) => state.nodes);
  const setFocusedNodeId = useGraphStore((state) => state.setFocusedNodeId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd/Ctrl + K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={() => setOpen(false)}
    >
      <Command
        className="w-full max-w-lg bg-white dark:bg-[#121212] border-2 border-zinc-300 dark:border-zinc-800 rounded-none shadow-2xl overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
          }
        }}
        loop
      >
        <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <Command.Input
            autoFocus
            placeholder="Search JSON keys or values..."
            className="w-full bg-transparent p-4 text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
          />

          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest cursor-pointer shrink-0"
            title="Close (Esc)"
          >
            <span>Close</span>
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-none font-bold">
              ESC
            </kbd>
          </button>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          <Command.Empty className="p-4 text-sm text-center text-zinc-500">
            No nodes found.
          </Command.Empty>

          {nodes.map((node) => (
            <Command.Item
              key={node.id}
              value={`${node.data.label} ${node.data.value}`}
              onSelect={() => {
                setFocusedNodeId(node.id);
                setOpen(false);
              }}
              className="flex items-center justify-between p-3 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#1e1e1e] aria-selected:bg-zinc-100 dark:aria-selected:bg-[#1e1e1e] aria-selected:border-l-2 aria-selected:border-orange-500 border-l-2 border-transparent transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  {node.data.label as string}
                </span>
                <span className="text-xs text-zinc-500 truncate max-w-[300px]">
                  {node.data.value as string}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 px-2 py-1 bg-zinc-100 dark:bg-[#1a1a1a]">
                {node.data.type as string}
              </span>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
