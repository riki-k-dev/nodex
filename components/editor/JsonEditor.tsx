"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const editorTheme = currentTheme === "dark" ? "vs-dark" : "vs-light";

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
        Loading Editor...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Editor
        height="100%"
        width="100%"
        language="json"
        theme={editorTheme}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          wordWrap: "on",
          lineNumbersMinChars: 3,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          formatOnPaste: true,
          tabSize: 2,
          overviewRulerLanes: 0,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
