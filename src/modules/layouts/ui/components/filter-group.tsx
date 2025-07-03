import { useMemo } from "react";
import { Column } from "@tanstack/react-table";
import { FunnelPlusIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddFilter } from "@/modules/layouts/ui/components/add-filter";
import { FilterList } from "@/modules/layouts/ui/components/filter-list";

import { FilterGroup as FilterGroupType } from "@/modules/layouts/types";

import { columnFilterOptions } from "@/modules/layouts/constants";

import { useFilterGroup } from "@/modules/layouts/hooks/use-filter-group";

interface Props<T> {
  columns: Column<T>[];
  filter: FilterGroupType<T>;
  onUpdate: (updatedGroup: FilterGroupType<T>) => void;
  onRemove: (groupId: number) => void;
}

export const FilterGroup = <T,>({
  columns,
  filter,
  onUpdate,
  onRemove
}: Props<T>) => {
  const { 
    addGroup, 
    updateFilter,
    updateConnector,
    removeFilter,
    updateGroup,
    removeGroup
  } = useFilterGroup(filter, onUpdate);

  const sortedItems = useMemo(() => 
    [...filter.filters, ...filter.groups].sort((a, b) => a.id - b.id)
  , [filter.filters, filter.groups]);

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
      {sortedItems.length > 0 && (
        <FilterList
          items={sortedItems}
          columns={columns}
          connector={filter.connector}
          onChangeConnector={updateConnector}
          onUpdateFilter={updateFilter}
          onRemoveFilter={removeFilter}
          onUpdateGroup={updateGroup}
          onRemoveGroup={removeGroup}
        />
      )}
      <div className="flex flex-row items-center gap-1">
        <AddFilter 
          asChild
          mode="popover"
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
        >
          <Button variant="outline" size="xs">
            <FunnelPlusIcon className="size-3.5" />
            Add condition
          </Button>
        </AddFilter>
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