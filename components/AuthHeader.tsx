import React from 'react'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import useAuth from '../app/lib/useAuth'
import theme from '@/constants/theme'

export default function AuthHeader() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  // Use tailwind classnames for layout and the theme tokens for precise colors
  // container: rounded, padded, border; align items to end

  if (loading) {
    return (
      <View className="w-[140px] items-end">
        <ActivityIndicator size="small" color={theme.UI_TEXT_PRIMARY} />
      </View>
    )
  }

  if (user && profile) {
    return (
      <View className="rounded-lg py-2 px-3 border items-end bg-tab-bg border-tab-border">
        <Text className="text-ui-primary font-semibold">{profile.username || profile.email}</Text>
        <Text className="text-ui-secondary text-xs">{profile.email}</Text>
      </View>
    )
  }

  return (
    <View className="flex-row">
      <Pressable onPress={() => router.push('/login')} className="mr-2 px-3 py-2 rounded-md">
        <Text className="text-white">Login</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/signup')} className="px-3 py-2 rounded-md bg-white">
        <Text className="text-tab-bg">Sign up</Text>
      </Pressable>
    </View>
  )
}
