import { Filter, FilterGroup } from "../types";

export const useFilterGroup = <T,>(group: FilterGroup<T>, onUpdate: (updatedGroup: FilterGroup<T>) => void) => {
  const addGroup = () => {
    onUpdate({
      ...group,
      groups: [
        ...group.groups,
        {
          id: Date.now(),
          filters: [],
          groups: [],
          connector: "and",
        },
      ],
    });
  };

  const updateFilter = (filterId: number, updatedFilter: Filter<T>) => {
    onUpdate({
      ...group,
      filters: group.filters.map((f) => f.id === filterId ? updatedFilter : f),
    });
  };

  const updateGroup = (groupId: number, updatedGroup: FilterGroup<T>) => {
    onUpdate({
      ...group,
      groups: group.groups.map((g) => g.id === groupId ? updatedGroup : g),
    });
  };
  
  const removeFilter = (filterId: number) => {
    onUpdate({
      ...group,
      filters: group.filters.filter((f) => f.id !== filterId),
    });
  };

  const removeGroup = (groupId: number) => {
    onUpdate({
      ...group,
      groups: group.groups.filter((g) => g.id !== groupId),
    });
  };

  return {
    addGroup,
    updateFilter,
    updateGroup,
    removeFilter,
    removeGroup,
  };
}