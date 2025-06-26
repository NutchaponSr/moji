import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ChevronDownIcon, GripVerticalIcon, XIcon } from "lucide-react";
import { Column, ColumnSort } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CommandSearch } from "@/components/command-search";
import { Command } from "cmdk";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { columnSortOptions } from "../../constants";

interface Props<T> {
  column: ColumnSort;
  columns: Column<T>[];
  onSelect: (column: Column<T>) => void;
  onChange: () => void;
  onRemove: () => void;
}

export const SortItem = <T,>({ 
  column,
  columns,
  onSelect,
  onChange,
  onRemove
}: Props<T>) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef
  } = useSortable({ id: column.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-7 items-center rounded-sm border border-border shadow-xs bg-background text-xs w-fit"
    >
      <div {...attributes} {...listeners} className="flex items-center justify-center size-7 cursor-grab">
        <GripVerticalIcon className="size-4 stroke-[1.5] fill-primary stroke-primary" />
      </div>
      <Separator orientation="vertical" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost"size="sm" className="justify-between min-w-40 rounded-none">
            <span className="flex items-center gap-1 whitespace-nowrap font-medium capitalize">
              {column.icon && <column.icon className="size-4" />}             
              {column.id}
            </span>
            <ChevronDownIcon className="size-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-1 w-40">
          <CommandSearch placeholder="Sort by...">
            <Command.Group>
            {columns.map((item) => {
              const Icon = item.columnDef.meta?.icon;

              return (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={() => onSelect(item)}
                  className="flex items-center gap-2 px-2 py-1 text-sm text-primary rounded-sm h-7 data-[selected=true]:bg-accent capitalize cursor-pointer"
                >
                  {Icon && <Icon className="size-5 stroke-[1.5]" />}
                  {item.id}
                </Command.Item>
              );
            })}
          </Command.Group>    
          </CommandSearch>
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-none">
            {!column.desc 
              ? columnSortOptions[column.type][0]
              : columnSortOptions[column.type][1]
            }
            <ChevronDownIcon className="size-3" />
          </Button> 
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto p-1">
          {columnSortOptions[column.type].map((item, index) => (
            <DropdownMenuItem 
            key={index}
            className="text-xs"
            onClick={onChange}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" />
      <Button 
        variant="ghost" 
        size="sm" 
        className="rounded-l-none"
        onClick={onRemove}
      >
        <XIcon />
      </Button> 
    </div>
  );
}