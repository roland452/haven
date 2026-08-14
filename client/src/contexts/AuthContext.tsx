import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { apiLogin, apiLogout, apiMe, apiSignup } from '../lib/api'
import { PublicUser, UserRole } from '../types'

const STORAGE_KEY = 'haven.currentUser'

function readCachedUser(): PublicUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PublicUser) : null
  } catch {
    return null
  }
}

function cacheUser(user: PublicUser | null) {
  try {
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // sessionStorage can throw in private/incognito modes — safe to ignore,
    // the app just falls back to the /me check instead
  }
}

interface AuthContextValue {
  currentUser: PublicUser | null
  authLoading: boolean
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    institutionDetails?: {
      institutionDescription: string
      founderName: string
    }
  ) => Promise<string | null>
  login: (email: string, password: string) => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Seed from the cached account immediately so the header shows "signed in"
  // right away instead of flashing signed-out and prompting a login modal
  // on the very first click, before the background /me check has returned.
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(readCachedUser)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    // Confirms the cached user still has a valid session cookie, and
    // clears everything if the token has actually expired or was revoked.
    apiMe().then((user) => {
      if (cancelled) return
      setCurrentUser(user)
      cacheUser(user)
      setAuthLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function signup(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    institutionDetails?: {
      institutionDescription: string
      founderName: string
    }
  ): Promise<string | null> {
    if (!name.trim() || !email.trim() || password.length < 6) {
      return 'Please fill in every field. Passwords need at least 6 characters.'
    }
    if (
      role === 'institution' &&
      (!institutionDetails?.institutionDescription.trim() ||
        !institutionDetails?.founderName.trim())
    ) {
      return 'Please fill in the founder name and a short description.'
    }
    const { user, error } = await apiSignup(name, email, password, role, institutionDetails)
    if (error || !user) return error || 'Could not create account.'
    setCurrentUser(user)
    cacheUser(user)
    return null
  }

  async function login(email: string, password: string): Promise<string | null> {
    const { user, error } = await apiLogin(email, password)
    if (error || !user) return error || 'Could not log in.'
    setCurrentUser(user)
    cacheUser(user)
    return null
  }

  function logout() {
    setCurrentUser(null)
    cacheUser(null)
    void apiLogout()
  }

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
