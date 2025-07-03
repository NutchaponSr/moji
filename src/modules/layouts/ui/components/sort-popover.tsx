import { Table } from "@tanstack/react-table";
import { ArrowUpDownIcon, PlusCircleIcon } from "lucide-react";

import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { AddSort } from "@/modules/layouts/ui/components/add-sort";
import { SortContent } from "@/modules/layouts/ui/components/sort-content";

import { useSort } from "../../hooks/use-sort";

interface Props<T> {
  table: Table<T>;
}

export const SortPopover = <T,>({ table }: Props<T>) => {
  const { addSort } = useSort(table);

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
          
        <SortContent table={table} columns={columns} />
        <div className="flex flex-row items-center p-2 gap-1">
          <AddSort 
            asChild
            mode="popover"
            columns={columns}
            onSelect={addSort}
          >
            <Button variant="outline" size="xs">
              <PlusCircleIcon className="size-3.5" />
              Add sort
            </Button>
          </AddSort>
        </div>
      </PopoverContent>
    </Popover>
  );
}