import { Handle, Position } from "@xyflow/react";
import { useGraphStore } from "@/store/graph-store";
import { useState, useRef, useEffect } from "react";

interface JsonNodeData {
  label: string;
  value: unknown;
  type: string;
  path?: string[];
  isExpandable?: boolean;
  isCollapsed?: boolean;
}

export function JsonNode({ id, data }: { id: string; data: JsonNodeData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(data.value));

  const updateNodeValue = useGraphStore((state) => state.updateNodeValue);
  const toggleNodeCollapse = useGraphStore((state) => state.toggleNodeCollapse);

  const inputRef = useRef<HTMLInputElement>(null);

  const isEditable =
    data.type !== "object" &&
    data.type !== "array" &&
    data.path &&
    data.path.length > 0;

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (editValue !== String(data.value) && data.path) {
      let finalValue: unknown = editValue;
      if (data.type === "number") finalValue = Number(editValue);
      if (data.type === "boolean") finalValue = editValue === "true";
      if (data.type === "null") finalValue = null;
      updateNodeValue(data.path, finalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(String(data.value));
    }
  };

  return (
    <div className="min-w-[200px] bg-white dark:bg-[#121212] border border-zinc-300 dark:border-zinc-800 rounded-none shadow-sm font-mono text-xs transition-colors hover:border-orange-500/50">
      <Handle
        type="target"
        position={Position.Left}
        className="w-2! h-2! bg-zinc-400! border-none! rounded-none!"
      />

      <div className="flex flex-col">
        {/* Header with Label and Collapse Button */}
        <div className="px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1a1a1a] flex items-center justify-between">
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            {data.label}
          </span>

          {data.isExpandable && (
            <button
              onClick={() => toggleNodeCollapse(id)}
              className="ml-3 flex items-center justify-center w-4 h-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white text-zinc-600 dark:text-zinc-400 transition-colors text-[10px] font-bold shrink-0 cursor-pointer"
              title={data.isCollapsed ? "Expand Node" : "Collapse Node"}
            >
              {data.isCollapsed ? "+" : "-"}
            </button>
          )}
        </div>

        {/* Node Body (Value) */}
        <div
          className={`px-3 py-2 flex items-center justify-between ${isEditable ? "cursor-text hover:bg-zinc-50 dark:hover:bg-[#1a1a1a]" : ""}`}
          onDoubleClick={() => isEditable && setIsEditing(true)}
          title={isEditable ? "Double click to edit" : ""}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-orange-600 dark:text-orange-400 border-b border-orange-500/50 focus:border-orange-500"
            />
          ) : (
            <span
              className={
                data.type === "string"
                  ? "text-green-600 dark:text-green-400"
                  : data.type === "number"
                    ? "text-blue-600 dark:text-blue-400"
                    : data.type === "boolean"
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-zinc-500 dark:text-zinc-400"
              }
            >
              {data.type === "string" && !isEditing
                ? `"${String(data.value)}"`
                : String(data.value)}
            </span>
          )}

          <span className="text-[9px] text-zinc-400 ml-3 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/50 px-1 py-0.5">
            {data.type}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2! h-2! bg-orange-500! border-none! rounded-none!"
      />
    </div>
  );
}
