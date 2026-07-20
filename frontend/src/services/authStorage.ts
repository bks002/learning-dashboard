import type { AuthSession } from '../types'

const STORAGE_KEY = 'learning_dashboard_auth'

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuthToken(): string | null {
  return getAuthSession()?.token ?? null
}
