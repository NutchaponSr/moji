import { useGroupingStore } from "@/modules/layouts/store/use-grouping-store";

export const useGrouping = () => {
  const grouping = useGroupingStore((state) => state.grouping);
  const onSelect = useGroupingStore((state) => state.onSelect);

  const isGrouping = grouping !== undefined;

  return {
    grouping,
    isGrouping,
    onSelect,
  }
}