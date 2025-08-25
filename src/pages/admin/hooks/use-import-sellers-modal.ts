import { create } from "zustand";

interface ImportSellersModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useImportSellersModal = create<ImportSellersModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));