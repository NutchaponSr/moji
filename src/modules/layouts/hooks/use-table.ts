import { 
  ColumnOrderState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState, 
  useReactTable, 
  VisibilityState 
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { 
  FilterGroup, 
  TableProps, 
} from "@/modules/layouts/types";

import { compareValues } from "@/modules/layouts/utils";

import { useFilterStore } from "@/modules/layouts/store/use-filter-store";

export const useTable = <T extends Record<string, unknown>>({
  data,
  columns,
  initialColumnOrder = columns.map((c) => c.id!),
  initialColumnVisibility = {},
  initialSorting = [],
}: TableProps<T>) => {
  const { filterGroup } = useFilterStore();

  const [globalFilter, setGlobalFilter] = useState("");
  const [] = useState()
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

  const isFilterGroupEmpty = useCallback((group: FilterGroup<T>): boolean => {
    return group.filters.length === 0 && group.groups.length === 0;
  }, []);

  const evaluateGroup = useCallback((group: FilterGroup<T>, row: Row<T>): boolean => {
    if (isFilterGroupEmpty(group)) return true;

    const filterResults = group.filters
      .filter((f) => f.column.id && f.operator && f.value)
      .map((filter) => 
        compareValues(
          row.getValue(filter.column.id as string),
          filter.value,
          filter.operator,
          filter.columnType
        ),
      );

    const groupResults = group.groups.map((subGroup) => evaluateGroup(subGroup, row));
    const allResults = [...filterResults, ...groupResults].filter((result) => result !== undefined);

    if (allResults.length === 0) return true;

    return group.connector === "and"
      ? allResults.every((result) => result)
      : allResults.some((result) => result);
  }, [isFilterGroupEmpty]);

  // Memoize the filter function to prevent recreating it on every render
  const filterData = useCallback((row: Row<T>) => {
    const passesFilterGroup = evaluateGroup(filterGroup, row);

    if (!globalFilter) return passesFilterGroup;

    const passesGlobalTextFilter = Object
      .keys(row.original)
      .some(key => {
        const value = row.original[key as keyof T];

        if (value === null || typeof value === 'object') return false;

        return String(value).toLowerCase().includes(globalFilter.toLowerCase());
      });
    
    return passesFilterGroup && passesGlobalTextFilter;
  }, [evaluateGroup, filterGroup, globalFilter]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    globalFilterFn: filterData,
    filterFns: {
      custom: (row, columnId, filterValue) => {
        return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase());
      },
    },
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      globalFilter: globalFilter || filterGroup,
    },
  });

  const filteredData = useMemo(() => {
    return table.getFilteredRowModel().rows.map((row) => row.original)
  }, [table]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  }, []);

  const handleClear= useCallback(() => {
    setGlobalFilter("");
  }, []);

  return {
    table,
    sorting,
    columnVisibility,
    columnOrder,
    globalFilter,
    filteredData,
    setSorting,
    setColumnVisibility,
    setColumnOrder,
    setGlobalFilter,
    handleSearchChange,
    handleClear,
    filterData,
  };
}