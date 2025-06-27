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

export const columns = [
  "text",
  "numeric",
  "date",
  "select"
] as const;

export type LayoutsType = typeof layouts[number];
export type ColumnType = typeof columns[number];

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
  grouping: string | undefined;
  filteredData: T[];  
  groupedData: Record<string, T[]>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<ColumnOrderState>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
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