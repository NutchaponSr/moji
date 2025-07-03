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
import { getVisibilityStats, getHiddenGroups, getVisibleGroups, showAllGroups, hideAllGroups, hideGroup, showGroup, toggleGroupVisibility, toggleMultipleGroups, setMultipleGroupsVisibility } from "../utils";

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
  }

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
  }

  const isValidGrouping = () => {
    return isGrouping && groupingType !== null;
  };

  const createVisibilityManager = <T>(groupedData: GroupingProps<T>[], setGroupedData: (data: GroupingProps<T>[]) => void) => ({
    toggleGroup: (groupLabel: string) => {
      setGroupedData(toggleGroupVisibility(groupedData, groupLabel));
    },
    hideGroup: (groupLabel: string) => {
      setGroupedData(hideGroup(groupedData, groupLabel));
    },
    showGroup: (groupLabel: string) => {
      setGroupedData(showGroup(groupedData, groupLabel));
    },
    hideAllGroups: () => {
      setGroupedData(hideAllGroups(groupedData));
    },
    showAllGroups: () => {
      setGroupedData(showAllGroups(groupedData));
    },
    getVisibleGroups: () => getVisibleGroups(groupedData),
    getHiddenGroups: () => getHiddenGroups(groupedData),
    getVisibilityStats: () => getVisibilityStats(groupedData),
    toggleMultipleGroups: (groupLabels: string[]) => {
      setGroupedData(toggleMultipleGroups(groupedData, groupLabels));
    },
    setMultipleGroupsVisibility: (groupLabels: string[], hidden: boolean) => {
      setGroupedData(setMultipleGroupsVisibility(groupedData, groupLabels, hidden));
    },
    toggleAllGroups: () => {
      const allHidden = getHiddenGroups(groupedData).length === groupedData.length;
      if (allHidden) {
        setGroupedData(showAllGroups(groupedData));
      } else {
        setGroupedData(hideAllGroups(groupedData));
      }
    }
  });


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
    getSortOptions,
    getGroupingOptions,
    getGroupingDescription,
    createVisibilityManager
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