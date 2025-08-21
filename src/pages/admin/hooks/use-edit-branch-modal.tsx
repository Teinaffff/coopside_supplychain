import { create } from "zustand";

interface Branch {
  id: number;
  institutionId: number;
  branchName: string;
  address: string;
  phoneNumber: string;
  email: string;
  branchManager: string;
  isActive: boolean;
}

interface useEditBranchModalStore {
  isOpen: boolean;
  defaultValues: Partial<Branch> | null;
  onOpen: (defaultValues?: Partial<Branch> | null) => void;
  onClose: () => void;
}

export const useEditBranchModal = create<useEditBranchModalStore>((set) => ({
  isOpen: false,
  defaultValues: null,
  onOpen: (defaultValues = null) => set({ isOpen: true, defaultValues }),
  onClose: () => set({ isOpen: false, defaultValues: null }),
}));
