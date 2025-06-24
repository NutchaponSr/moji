import { useShallow } from "zustand/react/shallow";

import { useFilterStore } from "@/modules/layouts/store/use-filter-store";

export const useFilter = () => {
  const filterGroup = useFilterStore((state) => state.filterGroup);

  const {
    setFilterGroup,
    addFilter,
    updateFilter,
    removeFilter,
    addFilterGroup,
    updateGroup,
    removeGroup,
    setConnector,
  } = useFilterStore(useShallow((state) => ({
    setFilterGroup: state.setFilterGroup,
    addFilter: state.addFilter,
    updateFilter: state.updateFilter,
    removeFilter: state.removeFilter,
    addFilterGroup: state.addFilterGroup,
    updateGroup: state.updateGroup,
    removeGroup: state.removeGroup,
    setConnector: state.setConnector,
  })));

  const filters = filterGroup.filters;
  const groups = filterGroup.groups;
  const connector = filterGroup.connector;

  const isFiltering = filters.length > 0 || groups.length > 0;

  const allFilters = [
    ...filters,
    ...groups,
  ].sort((a, b) => a.id - b.id);

  return {
    allFilters,
    filterGroup,
    filters,
    groups,
    connector,
    isFiltering,

    // Actions
    setFilterGroup,
    addFilter,
    updateFilter,
    removeFilter,
    addFilterGroup,
    updateGroup,
    removeGroup,
    setConnector,
  };
}