import { create } from "zustand";

interface useProfileCompletionModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProfileCompletionModal = create<useProfileCompletionModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
