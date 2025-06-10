import { cva } from "class-variance-authority";

export const iconVariants = cva(
  "", {
    variants: {
      color: {
        none: "bg-none",
        secondary: "hover:bg-[#00000008]",
        red: "bg-red-400",
        yellow: "bg-yellow-400",
        sky: "bg-sky-400",
      },
      text: {
        default: "text-white",
        secondary: "text-[#91918e]"
      }
    },
    defaultVariants: {
      color: "none",
      text: "default"
    },
  }
);

export type SidebarStore = {
  isDragging: boolean;
  isCollapsed: boolean;
  isResetting: boolean;
  ref: React.RefObject<HTMLElement | null>;
  setIsDragging: (isDragging: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  setIsResetting: (isResetting: boolean) => void;
  resetWidth: () => void;
  collapse: () => void;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}