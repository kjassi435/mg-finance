import { create } from 'zustand'

export type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'emi-calculator'
  | 'apply'
  | 'dashboard'
  | 'admin'
  | 'apply-success'

interface AppUser {
  id: string
  name: string
  email: string
  role: string
  token: string
}

interface AppState {
  currentPage: Page
  user: AppUser | null
  selectedLoanType: string | null
  applicationId: string | null
  isHydrated: boolean
  navigate: (page: Page) => void
  setUser: (user: AppUser | null) => void
  logout: () => void
  setSelectedLoanType: (type: string | null) => void
  setApplicationId: (id: string | null) => void
  hydrate: () => void
}

function getStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('mg_finance_user')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  return null
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'landing',
  user: null,
  selectedLoanType: null,
  applicationId: null,
  isHydrated: false,

  navigate: (page: Page) => set({ currentPage: page }),

  setUser: (user: AppUser | null) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('mg_finance_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('mg_finance_user')
      }
    }
    set({ user })
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mg_finance_user')
    }
    set({ user: null, currentPage: 'landing' })
  },

  setSelectedLoanType: (type: string | null) => set({ selectedLoanType: type }),
  setApplicationId: (id: string | null) => set({ applicationId: id }),

  hydrate: () => {
    const storedUser = getStoredUser()
    if (storedUser) {
      set({
        user: storedUser,
        currentPage: storedUser.role === 'ADMIN' ? 'admin' : 'dashboard',
        isHydrated: true,
      })
    } else {
      set({ isHydrated: true })
    }
  },
}))
