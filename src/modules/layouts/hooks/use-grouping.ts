import { 
  getCoreRowModel, 
  getFilteredRowModel, 
  getSortedRowModel, 
  Row, 
  Table, 
  useReactTable 
} from "@tanstack/react-table";

import { useGroupingStore } from "@/modules/layouts/store/use-grouping-store";
import { GroupingProps } from "../types";
import { createDefaultGroup, isValidGroupingConfig, groupAndSortData } from "../utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export const useGrouping = () => {
  const grouping = useGroupingStore((state) => state.grouping);
  const groupingSort = useGroupingStore((state) => state.groupingSort);
  const groupingValue = useGroupingStore((state) => state.groupingValue);
  const onSelect = useGroupingStore((state) => state.onSelect);
  const onRemove = useGroupingStore((state) => state.onRemove);
  const onChangeOption = useGroupingStore((state) => state.onSetGroupingValue);
  const onChangeSort = useGroupingStore((state) => state.onSetGroupingSort);

  const isGrouping = grouping !== null;
  const groupingType = grouping?.columnDef.meta?.variant; 

  // TODO: Handle another groupingType

  const isValidGrouping = () => {
    return isGrouping && groupingType !== null;
  }

  return {
    isGrouping,
    grouping,
    groupingType,
    groupingValue,
    groupingSort,
    isValidGrouping,
    onSelect,
    onChangeOption,
    onChangeSort,
    onRemove,
  }
}

interface Props<T> {
  table: Table<T>;
  row: T[];
  filterData: (row: Row<T>) => boolean;
}

export const useGroupingTable = <T,>({ table, row, filterData }: Props<T>) => {
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
}

export const useGrouped = <T>(table: Table<T>) => {
  const { grouping, groupingValue, groupingType, groupingSort, onChangeSort } = useGrouping();

  const data = useMemo(() => table.getFilteredRowModel().rows.map((row) => row.original), [table])

  const [groupedData, setGroupedData] = useState<GroupingProps<T>[]>([]);

  const onToggleAll = useCallback(() => {
    setGroupedData(groupedData.map((group) => ({
      ...group,
      hidden: !group.hidden,
    })))
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
    })
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
    })
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

  const hasAllHide = groupedData.every((f) => f.hidden);

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
    groupedData,
    hasAllHide,
    onDragEnd,
    onToggleAll,
    onHide,
    onShow
  };
}