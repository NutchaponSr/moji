import { cva, VariantProps } from "class-variance-authority";

export const iconVariants = cva(
  "", {
    variants: {
      color: {
        none: "bg-none",
        secondary: "hover:bg-sidebar-accent",
        red: "bg-destructive",
        yellow: "bg-warning",
        sky: "bg-marine",
      },
      text: {
        default: "text-white",
        secondary: "text-[#91918e]",
        red: "text-destructive",
        yellow: "text-warning",
        sky: "text-marine",
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
export interface Workspace extends VariantProps<typeof iconVariants> {
  href: string;
  label: string;
  description: string;
  icon: string;
  className: string;
}

export const group: Workspace = {
  label: "Group",
  href: "groups",
  description: "Combining diverse skills to achieve shared goals.",
  icon: "solar:library-bold",
  className: "bg-[#f5e0e9] dark:bg-[#4e2c3c]",
  text: "yellow"
};

export const competency: Workspace = {
  label: "Competency",
  href: "competencies",
  description: "Diverse skills and competencies to achieve shared goals.",
  icon: "solar:file-text-bold",
  className: "bg-[#fadec9] dark:bg-[#5c3b23]",
  text: "yellow"
}

export const employee: Workspace = {
  label: "Employee",
  href: "employees",
  description: "Manage employees with diverse competencies to achieve goals.",
  icon: "solar:users-group-rounded-bold",
  className: "bg-[#d8e5ee] dark:bg-[#143a4e]",
  text: "sky"
}

export const workspaces: Workspace[] = [group, competency, employee] as const;