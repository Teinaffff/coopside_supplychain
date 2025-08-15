import { create } from "zustand";
import { Agent } from "../../../constants/interface/admin/agent";

interface useAddAgentModalStore {
  isOpen: boolean;
  defaultValues: Partial<Agent> | null;
  onOpen: (defaultValues?: Partial<Agent> | null) => void;
  onClose: () => void;
}

export const useAddAgentModal = create<useAddAgentModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
