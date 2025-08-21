import { create } from "zustand";

interface useAddBranchModalStore {
  isOpen: boolean;
  institutionId: string | null;
  onOpen: (institutionId: string) => void;
  onClose: () => void;
}

export const useAddBranchModal = create<useAddBranchModalStore>((set) => ({
  isOpen: false,
  institutionId: null,
  onOpen: (institutionId: string) => set({ isOpen: true, institutionId }),
  onClose: () => set({ isOpen: false, institutionId: null }),
}));
