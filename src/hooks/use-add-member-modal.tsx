import { create } from "zustand";
import { Member } from "../constants/interface/pc/members";

interface useAddMemberModalStore {
  isOpen: boolean;
  defaultValues: Partial<Member> | null;
  onOpen: (defaultValues?: Partial<Member> | null) => void;
  onClose: () => void;
}

export const useAddMemberModal = create<useAddMemberModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false }),
}));
