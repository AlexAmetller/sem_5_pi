import create from 'zustand'
import { User } from '../types/auth'
import { getUser } from '../utils/auth'

export interface AppState {
  showDrawer: boolean
  openDrawer: () => void
  closeDrawer: () => void
  setUser: (user: User | undefined) => void
  user: User | undefined
}

export const useAppStore = create<AppState>((set) => ({
  showDrawer: false,
  user: getUser(),
  openDrawer: () => set((state) => ({ ...state, showDrawer: true })),
  closeDrawer: () => set((state) => ({ ...state, showDrawer: false })),
  setUser: (user) => set((state) => ({ ...state, user })),
}))
