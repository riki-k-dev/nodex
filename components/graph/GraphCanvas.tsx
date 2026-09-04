"use client";

import { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGraphStore } from "@/store/graph-store";
import { JsonNode } from "./JsonNode";
import { useTheme } from "next-themes";

// Register custom node types
const nodeTypes = {
  jsonNode: JsonNode,
};

export function GraphCanvas() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const onNodesChange = useGraphStore((state) => state.onNodesChange);
  const onEdgesChange = useGraphStore((state) => state.onEdgesChange);

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-zinc-50 dark:bg-[#0c0c0c]" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="w-full h-full bg-white dark:bg-[#0a0a0a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        colorMode={isDark ? "dark" : "light"}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color={isDark ? "#27272a" : "#e4e4e7"}
        />
        <Controls className="!mb-6 !ml-2 !bg-white dark:!bg-[#121212] !border-zinc-300 dark:!border-zinc-800 !rounded-none !shadow-none [&>button]:!border-zinc-200 dark:[&>button]:!border-zinc-800 [&>button]:!text-zinc-700 dark:[&>button]:!text-zinc-300" />
      </ReactFlow>
    </div>
  );
}
