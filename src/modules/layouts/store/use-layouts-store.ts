import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LayoutsType, PeekType } from "../types";

type LayoutsStore = {
  layout: LayoutsType;
  peek: PeekType;
  showLine: boolean;
  showIcon: boolean;
  onChangeLayout: (layout: LayoutsType) => void;
  onChangePeek: (peek: PeekType) => void;
  onChangeLine: () => void;
  onChangeIcon: () => void;
}

export const useLayoutsStore = create<LayoutsStore>()(
  persist(
    (set) => ({
      layout: "table",
      peek: "side",
      showLine: false,
      showIcon: false,
      onChangeLayout: (layout) => set({ layout }),
      onChangePeek: (peek) => set({ peek }),
      onChangeLine: () => set((state) => ({ showLine: !state.showLine })),
      onChangeIcon: () => set((state) => ({ showIcon: !state.showIcon })),
    }),
    {
      name: "layout",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)