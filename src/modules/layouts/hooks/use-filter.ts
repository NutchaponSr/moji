import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useFilterStore } from "@/modules/layouts/store/use-filter-store";

export const useFilter = () => {
  const store = useFilterStore(useShallow((state) => ({
    filterGroup: state.filterGroup,
    setFilterGroup: state.setFilterGroup,
    addFilter: state.addFilter,
    updateFilter: state.updateFilter,
    removeFilter: state.removeFilter,
    addFilterGroup: state.addFilterGroup,
    updateGroup: state.updateGroup,
    removeGroup: state.removeGroup,
    setConnector: state.setConnector,
  })));

  const { filters, groups, connector } = store.filterGroup;

  const isFiltering = useMemo(() => 
    filters.length > 0 || groups.length > 0, 
    [filters.length, groups.length]
  );

  const sortedItems = useMemo(() => 
    [...filters, ...groups].sort((a, b) => a.id - b.id), 
  [filters, groups]);

  return {
    ...store,
    sortedItems,
    filters,
    groups,
    connector,
    isFiltering,
  };
}