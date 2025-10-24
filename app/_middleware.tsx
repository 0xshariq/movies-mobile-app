import { useEffect } from 'react'
import { useRouter, usePathname } from 'expo-router'
import { getCurrentUser } from './lib/useAuth'

export default function Middleware() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let mounted = true
    const check = async () => {
      // only protect certain routes
      if (!pathname) return
  const protectedPrefixes = ['/profile', '/saved', '/search']
      const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
      if (!isProtected) return

      try {
        const user = await getCurrentUser()
        if (mounted && !user) {
          // redirect to auth login
          router.replace('/login')
        }
      } catch {
        if (mounted) router.replace('/login')
      }
    }
    check()
    return () => { mounted = false }
  }, [pathname, router])

  return null
}
