import { cva, VariantProps } from "class-variance-authority";

export const iconVariants = cva(
  "", {
    variants: {
      color: {
        none: "bg-none",
        secondary: "hover:bg-sidebar-accent",
        red: "bg-red-foreground dark:bg-red-muted",
        yellow: "bg-yellow-foreground dark:bg-yellow-muted",
        blue: "bg-blue-foreground dark:bg-blue-muted",
      },
      text: {
        default: "text-white",
        secondary: "text-neutral",
        red: "text-red-secondary",
        yellow: "text-yellow-secondary",
        blue: "text-blue-secondary",
      },
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
export interface Workspace extends VariantProps<typeof iconVariants> {
  href: string;
  label: string;
  description: string;
  icon: string;
}

export const layouts = [
  "table",
  "board",
] as const;

export type LayoutsType = typeof layouts[number];