import { 
  getCoreRowModel, 
  getFilteredRowModel, 
  getSortedRowModel, 
  Row, 
  Table, 
  useReactTable 
} from "@tanstack/react-table";

import { useGroupingStore } from "@/modules/layouts/store/use-grouping-store";
import { ColumnType, dateBy, dateSort, GroupingProps, NumericBy, numericSort, selectBy, selectSort, textBy, textSort } from "../types";
import { createDefaultGroup, isValidGroupingConfig, groupAndSortData } from "../utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export const useGrouping = <T>(table: Table<T>) => {
  // Store state
  const grouping = useGroupingStore((state) => state.grouping);
  const groupingSort = useGroupingStore((state) => state.groupingSort);
  const groupingValue = useGroupingStore((state) => state.groupingValue);
  const onSelect = useGroupingStore((state) => state.onSelect);
  const onRemove = useGroupingStore((state) => state.onRemove);
  const onChangeOption = useGroupingStore((state) => state.onSetGroupingValue);
  const onChangeSort = useGroupingStore((state) => state.onSetGroupingSort);

  // Computed values
  const isGrouping = grouping !== null;
  const groupingType = grouping?.columnDef.meta?.variant;
  const data = useMemo(() => table.getFilteredRowModel().rows.map((row) => row.original), [table]);

  // Grouped data state
  const [groupedData, setGroupedData] = useState<GroupingProps<T>[]>([]);

  // Utility functions
  const getGroupingDescription = () => {
    if (!groupingValue || !groupingType) return "";
    
    switch (groupingType) {
      case "numeric":
        const numericValue = groupingValue as NumericBy;
        return `${numericValue.from} to ${numericValue.to}`;
      case "text":
      case "date":
      case "select":
        const option = getGroupingOptions().find(opt => opt.value === groupingValue);
        return option?.label || groupingValue.toString();
      default:
        return groupingValue.toString();
    }
  };

  const getGroupingOptions = (columnType?: ColumnType) => {
    const type = columnType || groupingType;

    if (!type) return [];

    switch (type) {
      case "text":
        return textBy;
      case "date":
        return dateBy;
      case "select":
        return selectBy;
      case "numeric":
        return []; // Numeric uses custom range input
      default:
        return [];
    }
  };

  const getSortOptions = (columnType?: ColumnType) => {
    const type = columnType || groupingType;
    if (!type) return [];
    switch (type) {
      case "text":
        return textSort;
      case "date":
        return dateSort;
      case "select":
        return selectSort;
      case "numeric":
        return numericSort;
      default:
        return [];
    }
  };

  const isValidGrouping = () => {
    return isGrouping && groupingType !== null;
  };

  // Group management callbacks
  const onToggleAll = useCallback(() => {
    setGroupedData(groupedData.map((group) => ({
      ...group,
      hidden: !group.hidden,
    })));
  }, [groupedData]);

  const onHide = useCallback((label: string) => {
    setGroupedData(() => {
      const updated = groupedData.map(group =>
        group.label === label ? { ...group, hidden: true } : group
      );
    
      const sorted = [
        ...updated.filter(g => !g.hidden),
        ...updated.filter(g => g.hidden),
      ];
    
      return sorted.map((group, idx) => ({ ...group, order: idx }));
    });
  }, [groupedData]);

  const onShow = useCallback((label: string) => {
    setGroupedData(() => {
      const updated = groupedData.map(group =>
        group.label === label ? { ...group, hidden: false } : group
      );
    
      const sorted = [
        ...updated.filter(g => !g.hidden),
        ...updated.filter(g => g.hidden),
      ];
    
      return sorted.map((group, idx) => ({ ...group, order: idx }));
    });
  }, [groupedData]);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = groupedData.findIndex(g => g.label === active.id);
    const newIndex = groupedData.findIndex(g => g.label === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Check if we need to change sort to manual for text grouping
      if (groupingType === "text" && 
          groupingSort && 
          ["alphabetical", "reverseAlphabetical"].includes(groupingSort)) {
        onChangeSort("manual");
      }

      const reordered = arrayMove(groupedData, oldIndex, newIndex)
        .map((group, idx) => ({ ...group, order: idx }));
      setGroupedData(reordered); 
    }
  }, [groupedData, groupingSort, groupingType, onChangeSort]);

  // This will be handled by a separate hook

  // Computed values for grouped data
  const hasAllHide = groupedData.every((f) => f.hidden);

  // Effect to update grouped data when grouping changes
  useEffect(() => {
    if (!grouping || !groupingValue || !groupingSort || !groupingType) {
      setGroupedData(createDefaultGroup(data));
      return;
    }

    const config = {
      data,
      column: grouping,
      columnType: groupingType,
      groupingValue,
      groupingSort,
    };

    if (!isValidGroupingConfig(config)) {
      setGroupedData(createDefaultGroup(data));
      return;
    }

    const newGroupedData = groupAndSortData(config);
    setGroupedData(newGroupedData);
  }, [grouping, groupingValue, groupingType, groupingSort, data]);

  return {
    // Basic grouping state
    isGrouping,
    grouping,
    groupingType,
    groupingValue,
    groupingSort,
    isValidGrouping,
    
    // Store actions
    onSelect,
    onChangeOption,
    onChangeSort,
    onRemove,
    
    // Utility functions
    getSortOptions,
    getGroupingOptions,
    getGroupingDescription,
    
    // Grouped data management
    groupedData,
    hasAllHide,
    onDragEnd,
    onToggleAll,
    onHide,
    onShow,
    
    // Table creation - use separate hook
    // createGroupingTable,
    
    // Data
    data,
  };
};

// Separate hook for table creation
interface UseGroupingTableProps<T> {
  table: Table<T>;
  row: T[];
  filterData: (row: Row<T>) => boolean;
}

export const useGroupingTable = <T,>({ table, row, filterData }: UseGroupingTableProps<T>) => {
  return useReactTable({
    data: row,
    columns: table.getAllColumns().map((col) => col.columnDef),
    state: {
      globalFilter: table.getState().globalFilter,
      columnOrder: table.getState().columnOrder,
      columnVisibility: table.getState().columnVisibility,
      sorting: table.getState().sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filterData,
    filterFns: {
      custom: (row, columnId, filterValue) => {
        return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase());
      },
    },
  });
};