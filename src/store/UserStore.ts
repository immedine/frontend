import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  user: {dark: false, loading: true},
  setUser: (user) => set((state) => {
    return  { ...state, user }
  }),
}));
