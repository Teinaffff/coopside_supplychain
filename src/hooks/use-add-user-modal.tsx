import { create } from "zustand";
import { User } from "../constants/interface/user";

interface useAddUserModalStore {
  isOpen: boolean;
  defaultValues: Partial<User> | null;
  onOpen: (defaultValues?: Partial<User> | null) => void;
  onClose: () => void;
}

export const useAddUserModal = create<useAddUserModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
