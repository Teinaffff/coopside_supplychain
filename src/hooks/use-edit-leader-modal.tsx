import { create } from "zustand";
import { Leader } from "../constants/interface/pc/leadership";

interface useEditLeaderModalStore {
  isOpen: boolean;
  defaultValues: Partial<Leader> | null;
  onOpen: (defaultValues?: Partial<Leader> | null) => void;
  onClose: () => void;
}

export const useEditLeaderModal = create<useEditLeaderModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
