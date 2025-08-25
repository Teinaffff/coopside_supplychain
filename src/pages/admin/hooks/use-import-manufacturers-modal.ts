import { create } from "zustand";

interface ImportManufacturersModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useImportManufacturersModal = create<ImportManufacturersModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));