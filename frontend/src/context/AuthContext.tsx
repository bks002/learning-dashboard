import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { login as loginRequest } from '../services/api'
import {
  clearAuthSession,
  getAuthSession,
  setAuthSession,
} from '../services/authStorage'
import type { AuthSession, LoginRequest } from '../types'

interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession())

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await loginRequest(credentials)
    const nextSession: AuthSession = {
      token: response.token,
      userId: response.userId,
      name: response.name,
      email: response.email,
      role: response.role,
    }

    setAuthSession(nextSession)
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    clearAuthSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
