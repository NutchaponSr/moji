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
import { ArrowUpDownIcon } from "lucide-react";
import { Column, Table } from "@tanstack/react-table";

import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SortItem } from "./sort-item";
import { AddSort } from "./add-sort";

interface Props<T> {
  table: Table<T>;
}

export const SortPopover = <T,>({ table }: Props<T>) => {
  const hasSorted = table.getState().sorting.length > 0;

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

  const onSelect = (column: Column<T>) => {
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

  const columns = table.getAllColumns().filter((col) => !table.getState().sorting.some((s) => s.id === col.id));

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="icon" size="icon">
          <ArrowUpDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="p-2 min-h-6 bg-sidebar rounded-t-sm">
          <h2 className="text-xs text-primary font-medium">
            Sort by
          </h2>
        </div>
        <Separator orientation="horizontal" />
        
        {hasSorted && (
          <div className="flex flex-col px-1 my-1 gap-1 overflow-auto">
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
                    onSelect={(col) => {
                      table.setSorting((currentSorting) => 
                        currentSorting.map((item) => 
                          item.id === column.id
                            ? {
                              id: col.id,
                              icon: col.columnDef.meta?.icon,
                              type: col.columnDef.meta?.variant ?? "text",
                              desc: item.desc,
                            } : item
                        )
                      )
                    }}
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
        )}
        <div className="flex flex-row items-center p-2 gap-1">
          <AddSort 
            columns={columns}
            onSelect={onSelect}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}