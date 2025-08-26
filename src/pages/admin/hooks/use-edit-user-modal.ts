import { create } from "zustand";
import { AdminUser } from "../../../constants/interface/admin/user";

interface useEditUserModalStore {
  isOpen: boolean;
  user: AdminUser | null;
  onOpen: (user?: AdminUser | null) => void;
  onClose: () => void;
}

export const useEditUserModal = create<useEditUserModalStore>((set) => ({
  isOpen: false,
  user: null,
  onOpen: (user = null) => set({ isOpen: true, user }),
  onClose: () => set({ isOpen: false, user: null }),
}));
