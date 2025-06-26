import { Column } from "@tanstack/react-table";
import { FilterIcon, PlusCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { AddFilter } from "@/modules/layouts/ui/components/add-filter";
import { FilterList } from "@/modules/layouts/ui/components/filter-list";

import { useFilter } from "@/modules/layouts/hooks/use-filter";;

interface Props<T> {
  columns: Column<T>[];
}

export const FilterPopover = <T,>({ columns }: Props<T>) => {
  const {
    isFiltering,
    sortedItems,
    connector,
    addFilter,
    addFilterGroup,
    updateFilter,
    updateGroup,
    removeFilter,
    removeGroup,
    setConnector
  } = useFilter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="icon" size="icon">
          <FilterIcon className={cn(isFiltering && "text-marine")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-auto select-none">
        <div className="p-2 min-h-6 bg-sidebar rounded-t-sm">
          <h2 className="text-xs text-primary font-medium">
            {isFiltering 
              ? "In the view, show records"
              : "No filter conditions are applied"
            }
          </h2>
        </div>
        <Separator orientation="horizontal" />
        
        {isFiltering && (
          <FilterList
            items={sortedItems}
            columns={columns}
            connector={connector}
            onChangeConnector={setConnector}
            onUpdateFilter={updateFilter}
            onRemoveFilter={removeFilter}
            onUpdateGroup={updateGroup}
            onRemoveGroup={removeGroup}
          />
        )}

        <div className="flex flex-row items-center p-2 gap-1">
          <AddFilter columns={columns} onSelect={addFilter} />
          <Button 
            size="xs" 
            variant="outline" 
            onClick={addFilterGroup}
          >
            <PlusCircleIcon className="size-3.5" />
            Add condition group
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}