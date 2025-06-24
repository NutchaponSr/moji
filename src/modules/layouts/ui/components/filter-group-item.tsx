import { Column } from "@tanstack/react-table";

import { Filter, FilterGroup } from "../../types";
import { useFilterGroup } from "../../hooks/use-filter-group";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { AddFilter } from "./add-filter";
import { columnFilterOptions } from "../../constants";
import { FilterProvider } from "../providers/filter-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Props<T> {
  columns: Column<T>[];
  filter: FilterGroup<T>;
  onUpdate: (updatedGroup: FilterGroup<T>) => void;
  onRemove: (groupId: number) => void;
}

export const FilterGroupItem = <T,>({
  columns,
  filter,
  onUpdate,
  onRemove
}: Props<T>) => {
  const { 
    addGroup, 
    updateFilter,
    removeFilter,
    updateGroup,
    removeGroup
  } = useFilterGroup(filter, onUpdate);

  // ฟังก์ชันช่วย render filter หรือ group
  function renderFilterOrGroup(item: Filter<T> | FilterGroup<T>) {
    if ("column" in item) {
      return (
        <FilterProvider 
          key={item.id}
          filter={item} 
          onRemove={() => removeFilter(item.id)}
          onUpdate={(f) => updateFilter(f.id, f)}
        />
      );
    } else {
      return (
        <FilterGroupItem 
          key={item.id}
          columns={columns}
          filter={item} 
          onRemove={removeGroup}
          onUpdate={(f) => updateGroup(item.id, f)}
        />
      );
    }
  }

  const firstItem = [...filter.filters, ...filter.groups].sort((a, b) => a.id - b.id)[0];

  return (
    <div className="bg-sidebar rounded-sm w-full px-2 py-1.5 border border-border flex flex-col gap-2.5">
      <div className="flex items-center gap-8">
        <span className="flex-auto truncate text-xs text-secondary">
          Any of the following are true...
        </span>
        <div className="flex gap-0.5">
          <Button size="smIcon" variant="destructive" onClick={() => onRemove(filter.id)}>
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>
      {firstItem && (
        <div className="flex flex-col p-2 h-full">
          <div className="my-1 flex w-full items-center gap-2">
            <div className="shrink-0 min-w-16 text-center box-border">
              <span className="text-sm text-primary px-1 font-medium uppercase">
                Where
              </span>
            </div>
            {/* render filter/group ตัวแรก */}
            {renderFilterOrGroup(firstItem)}
          </div>

          {[...filter.filters, ...filter.groups].length > 1 && (
            <div className="h-full w-full relative flex gap-2">
              <div className="w-16 min-w-16 relative">
                <div className="absolute border-l-[1.5px] border-dashed border-border h-full left-1/2">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="xs" variant="primary" className="h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-[10px] rounded px-2">
                          {filter.connector}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onUpdate({ ...filter, connector: "and" })}>And</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdate({ ...filter, connector: "or" })}>Or</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[calc(100%-64px)]">
                {/* render filter/group ที่เหลือ */}
                {[...filter.filters, ...filter.groups]
                  .sort((a, b) => a.id - b.id)
                  .slice(1)
                  .map(renderFilterOrGroup)
                }
              </div> 
            </div>
          )}
        </div>
      )}
      <div className="flex flex-row items-center gap-1">
        <AddFilter 
          columns={columns}
          onSelect={(column, columnType) => onUpdate({
            ...filter,
            filters: [ 
              ...filter.filters,
              {
                column,
                columnType,
                id: Date.now(),
                operator: columnFilterOptions[columnType][0],
                value: "",
              },
            ],
          })}
        />
        <Button 
          size="xs" 
          variant="outline" 
          onClick={addGroup}
        >
          <PlusCircleIcon className="size-3.5" />
          Add condition group
        </Button>
      </div>
    </div>
  );
}