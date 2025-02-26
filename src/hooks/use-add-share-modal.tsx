import { create } from "zustand";
import { Share } from "../constants/interface/pc/share";

interface useAddShareModalStore {
  isOpen: boolean;
  defaultValues: Partial<Share> | null;
  onOpen: (defaultValues?: Partial<Share> | null) => void;
  onClose: () => void;
}

export const useAddShareModal = create<useAddShareModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
