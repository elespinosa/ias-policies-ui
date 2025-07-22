import { create } from 'zustand';

interface UserDataStore {
  userAuthData: any [];
  setUserAuthData: (userAuthData: any []) => void;
}

export const useUserDataStore = create<UserDataStore>((set) => ({
  userAuthData: [],
  setUserAuthData: (userAuthData: any []) => set({ userAuthData }),
})); 