import { FilterIcon, PlusCircleIcon } from "lucide-react";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { AddFilter } from "@/modules/layouts/ui/components/add-filter";
import { FilterProvider } from "@/modules/layouts/ui/providers/filter-provider";

import { useFilter } from "@/modules/layouts/hooks/use-filter";
import { FilterGroupItem } from "./filter-group-item";
import { Filter, FilterGroup } from "@/modules/layouts/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props<T> {
  columns: Column<T>[];
}

export const FilterPopover = <T,>({ columns }: Props<T>) => {
  const {
    isFiltering,
    filterGroup,
    allFilters,
    addFilter,
    addFilterGroup,
    updateFilter,
    updateGroup,
    removeFilter,
    removeGroup,
    setConnector
  } = useFilter();

  // ฟังก์ชันช่วย render filter หรือ group
  function renderFilterOrGroup(filter: Filter<T> | FilterGroup<T>) {
    if ("column" in filter) {
      return (
        <FilterProvider 
          key={filter.id}
          filter={filter} 
          onRemove={() => removeFilter(filter.id)}
          onUpdate={(f) => updateFilter(filter.id, f)}
        />
      );
    } else {
      return (
        <FilterGroupItem 
          key={filter.id}
          columns={columns}
          filter={filter}
          onRemove={removeGroup}
          onUpdate={(f) => updateGroup(filter.id, f)}
        />
      );
    }
  }

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
          <div className="flex flex-col p-2 h-full">
            <div className="my-1 flex w-full items-center gap-2">
              <div className="shrink-0 min-w-16 text-center box-border">
                <span className="text-sm text-primary px-1 font-medium uppercase">
                  Where
                </span>
              </div>
              {/* render filter/group ตัวแรก */}
              {allFilters[0] && renderFilterOrGroup(allFilters[0])}
            </div>

            {allFilters.length > 1 && (
              <div className="h-full w-full relative flex gap-2">
                <div className="w-16 min-w-16 relative">
                  <div className="absolute border-l-[1.5px] border-dashed border-border h-full left-1/2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="xs" variant="primary" className="h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[10px] rounded px-2">
                          {filterGroup.connector}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setConnector("and")}>And</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setConnector("or")}>Or</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-[calc(100%-64px)]">
                  {/* render filter/group ที่เหลือ */}
                  {allFilters.slice(1).map(renderFilterOrGroup)}
                </div> 
              </div>
            )}
          </div>
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