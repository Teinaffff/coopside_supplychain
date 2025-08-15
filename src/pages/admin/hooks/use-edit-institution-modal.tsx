import { create } from "zustand";
import { Institution } from "../../../constants/interface/admin/institution";

interface useEditInstitutionModalStore {
  isOpen: boolean;
  defaultValues: Partial<Institution> | null;
  onOpen: (defaultValues?: Partial<Institution> | null) => void;
  onClose: () => void;
}

export const useEditInstitutionModal = create<useEditInstitutionModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));