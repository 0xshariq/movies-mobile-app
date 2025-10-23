import { useEffect, useState } from 'react'
import { account } from './appwrite'

export default function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchUser = async () => {
      try {
        const res = await account.get()
        if (mounted) setUser(res)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchUser()
    return () => { mounted = false }
  }, [])

  return { user, loading }
}

export async function getCurrentUser() {
  try {
    return await account.get()
  } catch {
    return null
  }
}
