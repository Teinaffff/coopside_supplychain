import { create } from "zustand";
import { Agent } from "../../../constants/interface/admin/agent";

interface useEditAgentModalStore {
  isOpen: boolean;
  defaultValues: Agent | null;
  onOpen: (defaultValues?: Agent | null) => void;
  onClose: () => void;
}

export const useEditAgentModal = create<useEditAgentModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
