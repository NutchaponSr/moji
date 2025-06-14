import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LayoutsType } from "../types";

type LayoutsStore = {
  layout: LayoutsType;
  onChangeLayout: (layout: LayoutsType) => void;
}

export const useLayoutsStore = create<LayoutsStore>()(
  persist(
    (set) => ({
      layout: "table",
      onChangeLayout: (layout) => set({ layout }),
    }),
    {
      name: "layout",
      storage: createJSONStorage(() => localStorage),
    }
  )
)