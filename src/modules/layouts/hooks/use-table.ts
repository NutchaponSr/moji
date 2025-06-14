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
import { useMemo, useState } from "react";

import { 
  FilterGroup, 
  TableProps, 
  TableResponseType 
} from "@/modules/layouts/types";

import { compareValues } from "@/modules/layouts/utils";

import { useGrouping } from "@/modules/layouts/hooks/use-grouping";
import { useFilterStore } from "@/modules/layouts/store/use-filter-store";

export const useTable = <T extends Record<string, unknown>>({
  data,
  columns,
  initialColumnOrder = columns.map((c) => c.id!),
  initialColumnVisibility = {},
  initialSorting = [],
}: TableProps<T>): TableResponseType<T> => {
  const { grouping } = useGrouping();
  const { filterGroup } = useFilterStore();

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder);
  const [globalFilter, setGlobalFilter] = useState("");

  const isFilterGroupEmpty = (group: FilterGroup<T>): boolean => {
    return group.filters.length === 0 && group.groups.length === 0;
  }

  const evaluateGroup = (group: FilterGroup<T>, row: Row<T>): boolean => {
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
  }

  const filterData = (row: Row<T>) => {
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
  }

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
  
  const groupedData = useMemo(() => {
    if (!grouping) {
      return { "All data": filteredData };
    }

    return filteredData.reduce(
      (groups, row) => {
        const groupValue = row[grouping]?.toString() || "Unknown";

        if (!groups[groupValue]) {
          groups[groupValue] = [];
        }

        groups[groupValue].push(row);

        return groups;
      }, {} as Record<string, T[]>,
    );
  }, [grouping, filteredData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value);

  return {
    table,
    sorting,
    columnVisibility,
    columnOrder,
    globalFilter,
    grouping,
    groupedData,
    filteredData,
    setSorting,
    setColumnVisibility,
    setColumnOrder,
    setGlobalFilter,
    handleSearchChange,
    filterData,
  };
}