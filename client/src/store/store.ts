import { create } from "zustand";

interface IUseStore {
  activeId: number;
  updateActiveId: (index: number) => void;
}

const useStore = create<IUseStore>((set) => ({
  activeId: 0,
  updateActiveId: (index: number) =>
    set(() => ({
      activeId: index,
    })),
}));
export default useStore;
