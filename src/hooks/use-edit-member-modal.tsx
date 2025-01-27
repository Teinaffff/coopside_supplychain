import { create } from "zustand";
import { Member } from "../constants/interface/pc/members";

interface useEditMemberModalStore {
  isOpen: boolean;
  defaultValues: Partial<Member> | null;
  onOpen: (defaultValues?: Partial<Member> | null) => void;
  onClose: () => void;
}

export const useEditMemberModal = create<useEditMemberModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
