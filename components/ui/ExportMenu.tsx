"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Link, ChevronDown, Check } from "lucide-react";
import { useGraphStore } from "@/store/graph-store";
import { toPng } from "html-to-image";

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const jsonText = useGraphStore((state) => state.jsonText);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCopyLink = () => {
    try {
      const encodedData = btoa(encodeURIComponent(jsonText));
      const url = `${window.location.origin}?data=${encodedData}`;

      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  };

  const handleDownloadPng = () => {
    const element = document.querySelector(".react-flow") as HTMLElement;
    if (!element) return;

    const filter = (node: HTMLElement) => {
      const exclusionClasses = [
        "react-flow__controls",
        "react-flow__minimap",
        "react-flow__panel",
      ];
      return !exclusionClasses.some((cls) => node.classList?.contains(cls));
    };

    toPng(element, { filter, backgroundColor: "transparent" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "json-graph-architecture.png";
        link.href = dataUrl;
        link.click();
        setIsOpen(false);
      })
      .catch((err) => {
        console.error("Failed to export PNG", err);
      });
  };

  return (
    <div className="relative z-50 flex items-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-1.5 border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-white dark:bg-transparent font-medium transition-colors uppercase tracking-widest cursor-pointer text-xs"
      >
        Export
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            // Slide down animation logic
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            style={{ originY: 0 }} // Ensures it scales/slides from the top edge
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#121212] border border-zinc-300 dark:border-zinc-800 shadow-2xl flex flex-col font-mono"
          >
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-zinc-100 dark:hover:bg-[#1e1e1e] text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer border-b border-zinc-200 dark:border-zinc-800"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Link className="w-4 h-4 text-orange-500" />
              )}
              <span>{copied ? "Link Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handleDownloadPng}
              className="flex items-center gap-3 px-4 py-3 text-xs text-left hover:bg-zinc-100 dark:hover:bg-[#1e1e1e] text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-500" />
              <span>Download PNG</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
