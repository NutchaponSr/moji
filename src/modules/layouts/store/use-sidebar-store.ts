import { create } from "zustand";

import { SidebarStore } from "@/modules/layouts/types";

export const useSidebarStore = create<SidebarStore>((set) => {
  const ref = { current: null } as React.RefObject<HTMLElement | null>;
  const isResizingRef = { current: false };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 360) newWidth = 360;

    if (ref.current) {
      ref.current.style.width = `${newWidth}px`;
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false;
    set({ isDragging: false });

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  return {
    ref,
    isDragging: false,
    isCollapsed: false,
    isResetting: false,
    setIsDragging: (isDragging) => set({ isDragging }),
    setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
    setIsResetting: (isResetting) => set({ isResetting }),
    handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();

      set({ isDragging: true });
      isResizingRef.current = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    resetWidth: () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (ref.current) {
        set({ isResetting: true, isCollapsed: false });
        ref.current.style.width = isMobile ? "100%" : "240px";
        setTimeout(() => set({ isResetting: false }), 300);
      }
    },
    collapse: () => {
      if (ref.current) {
        set({ isResetting: true, isCollapsed: true });
        ref.current.style.width = "0";
        setTimeout(() => set({ isResetting: false }), 300);
      }
    },
  };
})