"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useSidebarStore } from "../../store/use-sidebar-store";

export const Header = () => {
  const { isCollapsed, resetWidth } = useSidebarStore();

  return (
    <header className="bg-transparent max-w-screen z-100 select-none">
      <div className="w-[calc(100%_0px)] h-11 transition-opacity opacity-100 relative left-0">
        <div role="toolbar" className="flex justify-between items-center overflow-hidden h-11 px-3">
          {isCollapsed && (
            <Button 
              size="mdIcon" 
              variant="ghost" 
              onClick={resetWidth}
            >
              <MenuIcon className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}