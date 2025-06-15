import { ColumnType, Workspace } from "@/modules/layouts/types";
import { CalendarDaysIcon, HashIcon, Heading1Icon, LoaderIcon, LucideIcon } from "lucide-react";

export const DEFAULT_PAGE = "/overviews";

export const group: Workspace = {
  label: "Group",
  href: "groups",
  description: "Combining diverse skills to achieve shared goals.",
  icon: "solar:library-bold",
  color: "red",
  text: "red",
};

export const competency: Workspace = {
  label: "Competency",
  href: "competencies",
  description: "Diverse skills and competencies to achieve shared goals.",
  icon: "solar:file-text-bold",
  color: "yellow",
  text: "yellow",
}

export const employee: Workspace = {
  label: "Employee",
  href: "employees",
  description: "Manage employees with diverse competencies to achieve goals.",
  icon: "solar:users-group-rounded-bold",
  color: "blue",
  text: "blue",
}

export const columnIcons: Record<ColumnType, LucideIcon> = {
  text: Heading1Icon,
  numeric: HashIcon,
  date: CalendarDaysIcon,
  select: LoaderIcon,
}

export const columnFilterOptions: Record<ColumnType, string[]> = {
  text: ["contains", "does not contain"],
  numeric: [">", "<", "≤", "≥", "=", "≠"],
  date: ["is", "is before", "is after", "is on or before", "is on or after", "is between"],
  select: ["is", "is not"],        
};

export const columnSortOptions: Record<ColumnType, string[]> = {
  text: ["A ➝ Z", "Z ➝ A"],
  numeric: ["1 ➝ 9", "9 ➝ 1"],
  date: [],
  select: [],        
};

export const workspaces: Workspace[] = [group, competency, employee] as const;