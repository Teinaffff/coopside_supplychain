import { create } from "zustand";

interface ImportUsersModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useImportUsersModal = create<ImportUsersModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));