import { 
  CalendarDaysIcon, 
  ChartPieIcon, 
  Columns3Icon, 
  HashIcon, 
  Heading1Icon, 
  LayoutGridIcon, 
  ListIcon, 
  LoaderIcon, 
  LucideIcon, 
  MaximizeIcon, 
  MinimizeIcon, 
  NewspaperIcon, 
  PanelRightIcon, 
  Table2Icon
} from "lucide-react";

import { 
  ColumnType, 
  Layout, 
  Peek, 
  PeekType, 
  ViewOptionsType, 
  Workspace 
} from "@/modules/layouts/types";

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

export const viewOptionsHeader: Record<ViewOptionsType, string> = {
  layouts: "Layouts",
  property: "Properties",
  addFilter: "Add filter",
  filter: "Filter",
  addSort: "Add sort",
  sort: "Sort",
  addGrouping: "Group by",
  grouping: "Grouping" 
};

export const groupingBy: Record<ColumnType, { label: string; }> = {
  text: { label: "Text by" },
  numeric: { label: "Number by" },
  date: { label: "Date by" },
  select: { label: "Select by" }
}

export const workspaces: Workspace[] = [group, competency, employee] as const;

export const layouts: Layout[] = [
  {
    icon: Table2Icon,
    label: "Table",
    slug: "table",
  },
  {
    icon: Columns3Icon,
    label: "Board",
    slug: "board",
  },
  {
    icon: CalendarDaysIcon,
    label: "Calendar",
    slug: "calendar",
  },
  {
    icon: ListIcon,
    label: "List",
    slug: "list",
  },
  {
    icon: LayoutGridIcon,
    label: "Gallery",
    slug: "gallery",
  },
  {
    icon: ChartPieIcon,
    label: "Chart",
    slug: "chart",
  },
  {
    icon: NewspaperIcon,
    label: "Feed",
    slug: "feed",
  },
];

export const peeks: Record<PeekType, Peek> = {
  side: {
    default: true,
    slug: "side",
    icon: PanelRightIcon,
    label: "Side peek",
    description: "Open pages on the side. Keeps the view behind interactive.",
  },
  center: {
    slug: "center",
    icon: MinimizeIcon,
    label: "Center peek",
    description: "Open pages in a focused, centered modal.",
  },
  full: {
    slug: "full",
    icon: MaximizeIcon,
    label: "Full page",
    description: "Open pages in full page",
  },
}

export const AUTO_WIDTH = ["filter", "sort"];