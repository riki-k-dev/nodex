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
        "relative bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800/80 shadow-sm dark:shadow-none transition-colors",
        className,
      )}
    >
      {/* Top Left Corner */}
      <div
        className={cn(
          "absolute top-[-1px] left-[-1px] w-5 h-5 border-t-2 border-l-2 pointer-events-none",
          cornerColor,
        )}
      />
      {/* Top Right Corner */}
      <div
        className={cn(
          "absolute top-[-1px] right-[-1px] w-5 h-5 border-t-2 border-r-2 pointer-events-none",
          cornerColor,
        )}
      />
      {/* Bottom Left Corner */}
      <div
        className={cn(
          "absolute bottom-[-1px] left-[-1px] w-5 h-5 border-b-2 border-l-2 pointer-events-none",
          cornerColor,
        )}
      />
      {/* Bottom Right Corner */}
      <div
        className={cn(
          "absolute bottom-[-1px] right-[-1px] w-5 h-5 border-b-2 border-r-2 pointer-events-none",
          cornerColor,
        )}
      />

      {/* Content wrapper */}
      <div className="h-full w-full p-4 overflow-hidden">{children}</div>
    </div>
  );
}
