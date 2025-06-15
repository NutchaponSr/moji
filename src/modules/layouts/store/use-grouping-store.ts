import { create } from "zustand";

type GroupingStore = {
  grouping: string | undefined;
  onSelect: (id: string) => void;
}

export const useGroupingStore = create<GroupingStore>((set) => ({
  grouping: undefined,
  onSelect: (id) => set({ grouping: id }),
}));