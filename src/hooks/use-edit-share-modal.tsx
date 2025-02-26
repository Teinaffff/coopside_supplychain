import { create } from "zustand";
import { Share } from "../constants/interface/pc/share";

interface useEditShareModalStore {
  isOpen: boolean;
  defaultValues: Partial<Share> | null;
  onOpen: (defaultValues?: Partial<Share> | null) => void;
  onClose: () => void;
}

export const useEditShareModal = create<useEditShareModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
