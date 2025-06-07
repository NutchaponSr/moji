import { SettingsModal } from "@/types/modal";
import { create } from "zustand";

export const useSettingsModal = create<SettingsModal>((set) => ({
  type: "preference",
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onChange: (type) => set({ type }),
}))