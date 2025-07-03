"use client"

import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Table } from "@tanstack/react-table";

interface ColumnPropertyProps<T> {
  table: Table<T>;
  viewOptions: string | null;
}

export const useColumnProperty = <T,>({ table, viewOptions }: ColumnPropertyProps<T>) => {
  const displayableColumns = table.getAllLeafColumns().filter((col) => col.id !== "actions");
  const sortableColumns = displayableColumns;

  const getCurrentColumnOrder = useCallback(() => {
    return table.getState().columnOrder.length > 0
      ? [...table.getState().columnOrder]
      : table.getAllColumns().map((col) => col.id);
  }, [table]);

  const isValidColumnMove = useCallback(
    (activeId: string, overId: string) => {
      const sortableColumnIds = sortableColumns.map((col) => col.id);
      return sortableColumnIds.includes(activeId) && sortableColumnIds.includes(overId);
    },
    [sortableColumns],
  );

  const updateColumnOrder = useCallback(() => {
    const allColumns = table.getAllColumns().map((col) => col.id);
    const newOrder = [
      ...["actions"].filter((id) => allColumns.includes(id)),
      ...allColumns.filter((id) => !["actions"].includes(id)),
    ];

    table.setColumnOrder(newOrder);
  }, [table]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over || active.id === over.id || !isValidColumnMove(active.id as string, over.id as string)) {
        return;
      }

      const currentOrder = getCurrentColumnOrder();
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        table.setColumnOrder(arrayMove(currentOrder, oldIndex, newIndex));
      }
    },
    [getCurrentColumnOrder, isValidColumnMove, table],
  );

  const handleColumnToggle = useCallback(
    (columnId: string) => {
      const column = table.getColumn(columnId)
      if (!column) return

      const isCurrentlyVisible = column.getIsVisible()

      if (isCurrentlyVisible) {
        // Hide the column
        column.toggleVisibility()
      } else {
        // Show the column and move it to the end of visible columns
        column.toggleVisibility()

        // Get current column order
        const currentOrder = getCurrentColumnOrder()
        const visibleColumns = displayableColumns
          .filter((col) => col.getIsVisible() || col.id === columnId)
          .map((col) => col.id)

        // Remove the toggled column from its current position
        const filteredOrder = currentOrder.filter((id) => id !== columnId)

        // Find the position to insert (after the last visible column, but before any fixed columns at the end)
        const fixedColumns = ["actions"] // Add any other fixed columns that should stay at the end
        const lastVisibleIndex = Math.max(
          ...visibleColumns
            .filter((id) => !fixedColumns.includes(id) && id !== columnId)
            .map((id) => filteredOrder.indexOf(id)),
        )

        // Insert the column after the last visible column
        const insertIndex = lastVisibleIndex >= 0 ? lastVisibleIndex + 1 : filteredOrder.length
        const newOrder = [...filteredOrder.slice(0, insertIndex), columnId, ...filteredOrder.slice(insertIndex)]

        table.setColumnOrder(newOrder)
      }
    },
    [table, getCurrentColumnOrder, displayableColumns],
  )

  const handleShowAllColumns = useCallback(() => {
    table.toggleAllColumnsVisible(true)
    updateColumnOrder()
  }, [table, updateColumnOrder])

  const handleHideAllColumns = useCallback(() => {
    table.toggleAllColumnsVisible(false)
    updateColumnOrder()
  }, [table, updateColumnOrder])

  useEffect(() => {
    if (viewOptions === "property") {
      updateColumnOrder()
    }
  }, [viewOptions, updateColumnOrder])

  return {
    displayableColumns,
    handleDragEnd,
    handleColumnToggle,
    handleShowAllColumns,
    handleHideAllColumns,
  }
}
