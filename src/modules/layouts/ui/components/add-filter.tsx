import { Command } from "cmdk";
import { FunnelPlusIcon } from "lucide-react";
import { Column } from "@tanstack/react-table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { CommandSearch } from "@/components/command-search";

import { ColumnType } from "@/modules/layouts/types";

interface Props<T> {
  columns: Column<T>[];
  onSelect: (column: Column<T>, type: ColumnType) => void;
}

export const AddFilter = <T,>({
  columns,
  onSelect
}: Props<T>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="xs">
          <FunnelPlusIcon className="size-3.5" />
          Add condition
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-auto">
        <CommandSearch placeholder="Filter by...">
        <Command.Group>
            {columns.map((item) => {
              const Icon = item.columnDef.meta?.icon;
              const type = item.columnDef.meta?.variant;

              return (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={() => onSelect(item, type ?? "text")}
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