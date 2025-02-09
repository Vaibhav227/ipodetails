import { create } from 'zustand'
import { type User } from './index.d'
const userStore = create<{
  user: User
  setUser: (user: User) => void
}>((set) => ({
  user: {
    name: '',
    email: '',
    avatar: '',
  },
  setUser: (user: User) => set({ user }),
}))

export default userStore
