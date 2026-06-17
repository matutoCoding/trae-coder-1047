import { create } from "zustand";

interface AppState {
  sidebarCollapsed: boolean;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  selectedLineId: string | null;
  notifications: number;

  toggleSidebar: () => void;
  setSelectedLineId: (id: string | null) => void;
  setNotifications: (count: number) => void;
}

const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentUser: {
    name: "张工",
    role: "运维管理员",
    avatar: "ZG",
  },
  selectedLineId: null,
  notifications: 5,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedLineId: (id) => set({ selectedLineId: id }),
  setNotifications: (count) => set({ notifications: count }),
}));

export default useAppStore;
