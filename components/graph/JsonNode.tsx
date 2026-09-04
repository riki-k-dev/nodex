import { Handle, Position } from "@xyflow/react";

interface JsonNodeProps {
  data: {
    label: string;
    value: string;
    type: string;
  };
}

export function JsonNode({ data }: JsonNodeProps) {
  const isComplex = data.value === "{Object}" || data.value === "[Array]";

  return (
    <div className="bg-white dark:bg-[#121212] border-2 border-zinc-300 dark:border-zinc-800 rounded-none shadow-sm min-w-[200px] font-mono text-xs overflow-hidden">
      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-zinc-400 !border-none !rounded-none"
      />

      {/* Node Header (Key) */}
      <div className="bg-zinc-100 dark:bg-[#1a1a1a] px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 truncate">
        {data.label}
      </div>

      {/* Node Body (Value) */}
      <div className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
        <span
          className={
            isComplex
              ? "text-orange-500 font-medium"
              : "text-green-600 dark:text-green-400"
          }
        >
          {data.value}
        </span>
      </div>

      {/* Source Handle (Right) - Only show if it has children (complex type) */}
      {isComplex && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2 !h-2 !bg-orange-500 !border-none !rounded-none"
        />
      )}
    </div>
  );
}
