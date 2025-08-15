import { create } from "zustand";
import { Manufacturer } from "../../../constants/interface/admin/manufacturer";

interface useEditManufacturerModalStore {
  isOpen: boolean;
  defaultValues: Partial<Manufacturer> | null;
  onOpen: (defaultValues?: Partial<Manufacturer> | null) => void;
  onClose: () => void;
}

export const useEditManufacturerModal = create<useEditManufacturerModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));