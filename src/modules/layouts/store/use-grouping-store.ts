import { Column } from "@tanstack/react-table";
import { create } from "zustand";
import { dateBy, GroupingValue, textBy, selectBy, ColumnType, textSort, GroupingSort, dateSort, selectSort, numericSort } from "../types";

const getInitialGroupingValue = (columnType: ColumnType): GroupingValue => {
  switch (columnType) {
    case "text":
      return textBy[0].value;
    case "date":
      return dateBy[0].value; 
    case "select":
      return selectBy[0].value; 
    case "numeric":
      return { from: 0, to: 1000 };
    default:
      return textBy[0].value;
  }
};

const getInitialGroupingSort = (columnType: ColumnType): GroupingSort => {
  switch (columnType) {
    case "text":
      return textSort[0].value;
    case "date":
      return dateSort[0].value; 
    case "select":
      return selectSort[0].value; 
    case "numeric":
      return numericSort[0].value;
    default:
      return textSort[0].value;
  }
};

type GroupingStore<T> = {
  grouping: Column<T> | null;
  groupingValue: GroupingValue | null;
  groupingSort: GroupingSort | null;
  onSelect: (column: Column<T>) => void;
  onSetGroupingValue: (value: GroupingValue) => void;
  onSetGroupingSort: (value: GroupingSort) => void;
  onRemove: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGroupingStore = create<GroupingStore<any>>((set) => ({
  grouping: null,
  groupingValue: null,
  groupingSort: null,
  onSelect: (column) => {
    const columnType = column.columnDef?.meta?.variant;
    const initialValue = columnType ? getInitialGroupingValue(columnType) : null;
    const initialSort = columnType ? getInitialGroupingSort(columnType) : null;
    
    set({ 
      grouping: column,
      groupingValue: initialValue,
      groupingSort: initialSort,
    });
  },
  onSetGroupingValue: (value) => set({ groupingValue: value }), 
  onSetGroupingSort: (value) => set({ groupingSort: value }), 
  onRemove: () => set({ grouping: null }),
}));