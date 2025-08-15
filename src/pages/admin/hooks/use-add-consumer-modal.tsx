import { create } from "zustand";
import { Consumer } from "../../../constants/interface/admin/consumer";

interface useAddConsumerModalStore {
  isOpen: boolean;
  defaultValues: Partial<Consumer> | null;
  onOpen: (defaultValues?: Partial<Consumer> | null) => void;
  onClose: () => void;
}

export const useAddConsumerModal = create<useAddConsumerModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));