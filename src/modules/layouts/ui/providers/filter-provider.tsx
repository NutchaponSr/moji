import { Text } from "@/modules/layouts/ui/components/text";

import { Filter } from "@/modules/layouts/types";

const filterComponents = {
  text: Text,
} as const;

interface Props<T> {
  filter: Filter<T>;
  onRemove: () => void;
  onUpdate: (filter: Filter<T>) => void;
}

export const FilterProvider = <T,>({ filter, ...props }: Props<T>) => {
  const FilterComponent = filterComponents[filter.columnType as keyof typeof filterComponents];

  if (!FilterComponent) return null;

  return <FilterComponent filter={filter} {...props} />
}