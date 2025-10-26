import { useAuthContext } from './AuthProvider'
import { account } from './appwrite'

export default function useAuth() {
  // helper hook kept for compatibility
  try {
    const ctx = useAuthContext()
    return { user: ctx.user?.account ?? null, profile: ctx.user?.profile ?? null, loading: ctx.loading, refresh: ctx.refresh, logout: ctx.logout }
  } catch {
    // fallback if AuthProvider isn't mounted
    return { user: null, profile: null, loading: true }
  }
}

export async function getCurrentUser() {
  try {
    return await account.get()
  } catch {
    return null
  }
}
