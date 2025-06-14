import { Workspace } from "@/modules/layouts/types";

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

export const workspaces: Workspace[] = [group, competency, employee] as const;