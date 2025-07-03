import { 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent, 
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { 
  restrictToFirstScrollableAncestor, 
  restrictToVerticalAxis 
} from "@dnd-kit/modifiers"
import { Column, Table } from "@tanstack/react-table";

import { SortItem } from "@/modules/layouts/ui/components/sort-item";
import { useSort } from "../../hooks/use-sort";

interface Props<T> {
  columns: Column<T>[];
  table: Table<T>;
}

export const SortContent = <T,>({ columns, table }: Props<T>) => {
  const { isSorting, onChange } = useSort(table);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    
    if (active && over && active.id !== over.id) {
      table.setSorting((currentSorting) => {
        const oldIndex = currentSorting.findIndex((idx) => idx.id === active.id);
        const newIndex = currentSorting.findIndex((idx) => idx.id === over.id);

        return arrayMove(currentSorting, oldIndex, newIndex);
      });
    }
  }

  if (!isSorting) return null;

  return (
    <div className="flex flex-col px-2 my-2 gap-1 overflow-auto">
      <DndContext
        sensors={sensors}
        onDragEnd={onDragEnd}
        collisionDetection={closestCenter}
        modifiers={[
          restrictToFirstScrollableAncestor,
          restrictToVerticalAxis
        ]}
      >
        <SortableContext
          items={table.getState().sorting.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        > 
          {table.getState().sorting.map((column) => (
            <SortItem
              key={column.id}
              column={column}
              columns={columns}
              onSelect={(col) => onChange(col, column.id)}
              onChange={() => 
                table.setSorting((prev) => prev.map((item) => 
                  item.id === column.id ? { ...item, desc: !item.desc } : item))
              }
              onRemove={() => table.setSorting((prev) => prev.filter((item) => item.id !== column.id))}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}