import { DragEndEvent } from "@dnd-kit/core";
import { 
  Column,
  ColumnDef, 
  ColumnOrderState, 
  Row, 
  SortingState, 
  Table, 
  VisibilityState 
} from "@tanstack/react-table";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

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
  "calendar",
  "list",
  "gallery",
  "chart",
  "feed"
] as const;

export const viewOptions = [
  "layouts",
  "property",
  "filter",
  "addFilter",
  "addSort",
  "sort",
  "addGrouping",
  "grouping",
] as const;

export const columns = [
  "text",
  "numeric",
  "date",
  "select"
] as const;

export const peeks = [
  "side",
  "center",
  "full",
] as const;

export type PeekType = typeof peeks[number];
export type ColumnType = typeof columns[number];
export type LayoutsType = typeof layouts[number];
export type ViewOptionsType = typeof viewOptions[number];

export interface Filter<T> {
  id: number;
  column: Column<T>;
  operator: string;
  value: string;
  columnType: ColumnType;
}

export interface FilterGroup<T> {
  id: number;
  filters: Filter<T>[];
  groups: FilterGroup<T>[];
  connector: "and" | "or";
}

export interface GroupingProps<T> {
  order: number;
  label: string;
  data: T[];
  hidden: boolean;
}

export interface GroupingConfig<T> {
  column: Column<T>;
  columnType: ColumnType;
  groupingValue: GroupingValue;
  groupingSort: GroupingSort;
  data: T[];
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  initialColumnOrder?: string[];
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;
  enableGrouping?: boolean;
  enableExpanding?: boolean;
}

export interface TableResponseType<T> {
  table: Table<T>;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnOrder: ColumnOrderState;
  globalFilter: string;
  grouping: Column<T> | null;
  filteredData: T[];  
  groupedData: GroupingProps<T>[];
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<ColumnOrderState>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  onDragEnd: (e: DragEndEvent) => void;
  filterData: (row: Row<T>) => boolean;
}

export interface FilterStore<T> {
  filterGroup: FilterGroup<T>;
  setFilterGroup: (filterGroup: FilterGroup<T>) => void;
  addFilter: (column: Column<T>, columnType: ColumnType) => void;
  updateFilter: (filterId: number, updateFilter: Filter<T>) => void;
  removeFilter: (filterId: number) => void;
  addFilterGroup: () => void;
  updateGroup: (groupId: number, updateGroup: FilterGroup<T>) => void;
  removeGroup: (groupId: number) => void;
  setConnector: (connector: "and" | "or") => void;
}

export type Layout = {
  icon: LucideIcon;
  label: string;
  slug: LayoutsType;
}

export type Peek = {
  icon: LucideIcon;
  label: string;
  slug: PeekType;
  default?: boolean;
  description: string;
}

export const textBy = [
  { label: "Exact", value: "exact" },
  { label: "Alphabetical", value: "alphabetical" }
] as const;
export const textSort = [
  { label: "Manual", value: "manual" },
  { label: "Alphabetical", value: "alphabetical" },
  { label: "Reverse alphabetical", value: "reverseAlphabetical" },
] as const;

export const numericSort = [
  { label: "Ascending", value: "ascending" },
  { label: "Descending", value: "descending" },
] as const;

export const dateBy = [
  { label: "Relative", value: "relative" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
] as const;
export const dateSort = [
  { label: "Oldest first", value: "oldestFirst" },
  { label: "Newest first", value: "newestFirst" },
] as const;

export const selectBy = [
  { label: "Group", value: "group" },
  { label: "Option", value: "option" }
] as const;
export const selectSort = [
  { label: "Manual", value: "manual" },
  { label: "Ascending", value: "ascending" },
  { label: "Descending", value: "descending" },
] as const;

export type NumericBy = { from: number; to: number; };

type TextByValue = typeof textBy[number]["value"];
type DateByValue = typeof dateBy[number]["value"];
type SelectByValue = typeof selectBy[number]["value"];

type TextSort = typeof textSort[number]["value"];
type NumericSort = typeof dateSort[number]["value"];
type DateSort = typeof dateSort[number]["value"];
type SelectSort = typeof selectSort[number]["value"];

export type GroupingValue = TextByValue | DateByValue | SelectByValue | NumericBy;
export type GroupingSort = TextSort | DateSort | SelectSort | NumericSort;