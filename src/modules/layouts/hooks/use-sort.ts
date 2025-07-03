import { Column, Table } from "@tanstack/react-table"

export const useSort = <T>(table: Table<T>) => {
  const isSorting = table.getState().sorting.length > 0;

  const addSort = (column: Column<T>) => {
    table.setSorting((currentSorting) => {
      if (currentSorting.some((idx) => idx.id === column.id)) {
        return currentSorting;
      }

      return [...currentSorting, {
        id: column.id,
        icon: column.columnDef.meta?.icon,
        type: column.columnDef.meta?.variant ?? "text",
        desc: false, 
      }];
    });
  }

  const onChange = (column: Column<T>, prevId?: string) => {
    table.setSorting((currentSorting) =>
      currentSorting.map((item) =>
        (prevId ? item.id === prevId : item.id === column.id)
          ? {
              id: column.id,
              icon: column.columnDef.meta?.icon,
              type: column.columnDef.meta?.variant ?? "text",
              desc: item.desc,
            }
          : item
      )
    );
  }

  const onDelete = () => table.resetSorting();

  return {
    isSorting,
    addSort,
    onChange,
    onDelete
  }
}