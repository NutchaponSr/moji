import { create } from "zustand";

import { ViewOptionsType } from "@/modules/layouts/types";

type ViewOptionsStore = {
  viewOptions: ViewOptionsType | null;
  onBack: () => void;
  onChange: (viewOptions: ViewOptionsType) => void;
}

export const useViewOptionsStore = create<ViewOptionsStore>((set) => ({
  viewOptions: null,
  onBack: () => set({ viewOptions: null }),
  onChange: (viewOptions) => set({ viewOptions }),
}));