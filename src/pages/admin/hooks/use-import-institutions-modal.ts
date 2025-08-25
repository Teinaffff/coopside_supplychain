import { create } from "zustand";

interface ImportInstitutionsModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useImportInstitutionsModal = create<ImportInstitutionsModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));