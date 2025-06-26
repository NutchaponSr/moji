import { Column } from "@tanstack/react-table";

import { FilterGroup } from "@/modules/layouts/ui/components/filter-group";
import { FilterProvider } from "@/modules/layouts/ui/providers/filter-provider";

import { Filter, FilterGroup as FilterGroupType } from "@/modules/layouts/types";

interface Props<T> {
  item: Filter<T> | FilterGroupType<T>;
  columns: Column<T>[];
  onUpdateFilter?: (filterId: number, filter: Filter<T>) => void;
  onUpdateGroup?: (groupId: number, group: FilterGroupType<T>) => void;
  onRemoveFilter?: (filterId: number) => void;
  onRemoveGroup?: (groupId: number) => void;
}

export const Renderer = <T,>({
  item,
  columns,
  onUpdateFilter,
  onUpdateGroup,
  onRemoveFilter,
  onRemoveGroup,
}: Props<T>) => {
  const isFilter = "column" in item;

  if (isFilter) {
    return (
      <FilterProvider 
        key={item.id}
        filter={item}
        onRemove={() => onRemoveFilter?.(item.id)}
        onUpdate={(f) => onUpdateFilter?.(f.id, f)}
      />
    );
  }

  return (
    <FilterGroup 
      key={item.id}
      columns={columns}
      filter={item}
      onRemove={onRemoveGroup || (() => {})}
      onUpdate={(f) => onUpdateGroup?.(item.id, f)}
    />
  );
}