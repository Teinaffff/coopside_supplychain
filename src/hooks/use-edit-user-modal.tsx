import { create } from "zustand";
import { User } from "../constants/interface/pc/members";

interface useEditUserModalStore {
  isOpen: boolean;
  defaultValues: Partial<User> | null;
  onOpen: (defaultValues?: Partial<User> | null) => void;
  onClose: () => void;
}

export const useEditUserModal = create<useEditUserModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
