import { useCallback } from "react";

import { Filter, FilterGroup } from "@/modules/layouts/types";

export const useFilterGroup = <T,>(group: FilterGroup<T>, onUpdate: (updatedGroup: FilterGroup<T>) => void) => {
  const addGroup = useCallback(() => {
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
  }, [group, onUpdate]);

  const updateFilter = useCallback((filterId: number, updatedFilter: Filter<T>) => {
    onUpdate({
      ...group,
      filters: group.filters.map((f) => f.id === filterId ? updatedFilter : f),
    });
  }, [group, onUpdate]);

  const updateGroup = useCallback((groupId: number, updatedGroup: FilterGroup<T>) => {
    onUpdate({
      ...group,
      groups: group.groups.map((g) => g.id === groupId ? updatedGroup : g),
    });
  }, [group, onUpdate]);
  
  const removeFilter = useCallback((filterId: number) => {
    onUpdate({
      ...group,
      filters: group.filters.filter((f) => f.id !== filterId),
    });
  }, [group, onUpdate]);

  const updateConnector = useCallback((connector: "and" | "or") => {
    onUpdate({
      ...group,
      connector,
    });
  }, [group, onUpdate]);

  const removeGroup = useCallback((groupId: number) => {
    onUpdate({
      ...group,
      groups: group.groups.filter((g) => g.id !== groupId),
    });
  }, [group, onUpdate]);

  return {
    addGroup,
    updateFilter,
    updateGroup,
    updateConnector,
    removeFilter,
    removeGroup,
  };
}