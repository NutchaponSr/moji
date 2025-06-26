import { Command } from "cmdk";
import { PlusCircleIcon } from "lucide-react";
import { Column } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { CommandSearch } from "@/components/command-search";

interface Props<T> {
  columns: Column<T>[];
  onSelect: (column: Column<T>) => void;
}

export const AddSort = <T,>({
  columns,
  onSelect
}: Props<T>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="xs">
          <PlusCircleIcon className="size-3.5" />
          Add sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-auto">
        <CommandSearch placeholder="Filter by...">
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
  );
}