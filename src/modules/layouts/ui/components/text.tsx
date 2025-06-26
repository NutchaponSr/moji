import { Input } from "@/components/ui/input";

import { FilterItem } from "@/modules/layouts/ui/components/filter-item";

import { Filter } from "@/modules/layouts/types";

interface Props<T> {
  filter: Filter<T>;
  onRemove: () => void;
  onUpdate: (filter: Filter<T>) => void; 
}

export const Text = <T,>({ 
  filter,
  ...props
}: Props<T>) => {
  return (
    <FilterItem filter={filter} {...props}>
      <Input 
        autoFocus
        type="text"
        value={filter.value}
        placeholder="filter by..."
        onChange={(e) => props.onUpdate({ ...filter, value: e.target.value })}
        className="h-6 rounded-sm bg-input px-2 !text-xs text-tertiary placeholder:text-xs placeholder:text-foreground"
      />
    </FilterItem>
  );
}