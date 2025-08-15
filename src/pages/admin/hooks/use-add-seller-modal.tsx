import { create } from "zustand";
import { Seller } from "../../../constants/interface/admin/seller";

interface useAddSellerModalStore {
  isOpen: boolean;
  defaultValues: Partial<Seller> | null;
  onOpen: (defaultValues?: Partial<Seller> | null) => void;
  onClose: () => void;
}

export const useAddSellerModal = create<useAddSellerModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));