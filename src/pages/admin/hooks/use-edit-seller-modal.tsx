import { create } from "zustand";
import { Seller } from "../../../constants/interface/admin/seller";

interface useEditSellerModalStore {
  isOpen: boolean;
  defaultValues: Partial<Seller> | null;
  onOpen: (defaultValues?: Partial<Seller> | null) => void;
  onClose: () => void;
}

export const useEditSellerModal = create<useEditSellerModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));