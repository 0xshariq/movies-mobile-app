import React, { createContext, useContext, useEffect, useState } from 'react'
import { account, databases, Query } from './appwrite'

type ProfileDoc = any
type AccountUser = any

type AuthContextType = {
  user: AccountUser | null
  profile: ProfileDoc | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [profile, setProfile] = useState<ProfileDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || ''
  const usersCollection = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID || ''

  const fetchProfile = async (userId: string) => {
    try {
      // prefer to fetch document by id (we create documents using userId as document id)
      const doc = await databases.getDocument(databaseId, usersCollection, userId)
      setProfile(doc)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching profile')
      try {
        const res = await databases.listDocuments(databaseId, usersCollection, [Query.equal('userId', userId)])
        if (res.documents && res.documents.length > 0) setProfile(res.documents[0])
      } catch (e) {
        setProfile(null)
        setError(e instanceof Error ? e.message : 'Error fetching profile')
      }
    }
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const a = await account.get()
      setUser(a)
      if (a && a.$id) {
        await fetchProfile(a.$id)
      } else {
        setProfile(null)
      }
    } catch (err) {
      setUser(null)
      setProfile(null)
      setError(err instanceof Error ? err.message : 'Error fetching user')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  useEffect(() => {
    // on mount, attempt to refresh session/profile
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

export default AuthProvider
