import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CornerBoxProps {
  children: ReactNode;
  className?: string;
  cornerColor?: string;
}

export function CornerBox({
  children,
  className,
  cornerColor = "border-orange-500 dark:border-orange-500",
}: CornerBoxProps) {
  return (
    <div
      className={cn(
        "relative bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800/80 shadow-sm dark:shadow-none transition-colors flex flex-col",
        className,
      )}
    >
      {/* Corners */}
      <div
        className={cn(
          "absolute top-[-1px] left-[-1px] w-5 h-5 border-t-2 border-l-2 pointer-events-none z-20",
          cornerColor,
        )}
      />
      <div
        className={cn(
          "absolute top-[-1px] right-[-1px] w-5 h-5 border-t-2 border-r-2 pointer-events-none z-20",
          cornerColor,
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-1px] left-[-1px] w-5 h-5 border-b-2 border-l-2 pointer-events-none z-20",
          cornerColor,
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-1px] right-[-1px] w-5 h-5 border-b-2 border-r-2 pointer-events-none z-20",
          cornerColor,
        )}
      />

      {/* Content wrapper */}
      <div className="flex-1 w-full p-4 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
