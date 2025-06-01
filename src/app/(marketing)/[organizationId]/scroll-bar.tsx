"use client";

import { cn } from "@/lib/utils";

import { useScroll } from "@/hooks/use-scroll";

export const ScrollBar = () => {
  const scrolled = useScroll();

  return (
    <div className="flex flex-row items-center justify-between px-6 mx-auto max-w-5xl">
      <div className={cn(
        "shrink-0 w-full h-px bg-border opacity-0 transition-opacity", 
        scrolled && "opacity-100"
        )} 
      />
    </div>
  );
}