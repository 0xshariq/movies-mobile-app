import React, { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { account } from '../lib/appwrite'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })

  type FormData = z.infer<typeof schema>
  const { handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  const signIn = async (data: FormData) => {
    setError(null)
    setLoading(true)
    try {
      await account.createSession(data.email, data.password)
      router.replace('/profile')
    } catch (err: any) {
      console.error(err)
      setError(err.message || JSON.stringify(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 p-6 justify-center bg-white">
  <Text className="text-2xl font-bold mb-6">Login</Text>

      <Text className="text-sm mb-2">Email</Text>
  <TextInput className="border border-gray-300 rounded-md p-3 mb-4" placeholder="email@example.com" value={email} onChangeText={(v) => { setEmail(v); setValue('email', v) }} keyboardType="email-address" autoCapitalize="none" />
  {errors.email ? <Text className="text-red-500 mb-2">{errors.email.message}</Text> : null}
      <Text className="text-sm mb-2">Password</Text>
      <TextInput className="border border-gray-300 rounded-md p-3 mb-6" placeholder="••••••" value={password} onChangeText={(v) => { setPassword(v); setValue('password', v) }} secureTextEntry />
      {errors.password ? <Text className="text-red-500 mb-2">{errors.password.message}</Text> : null}

      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
      <Pressable className={`py-3 rounded-md items-center ${loading ? 'bg-gray-400' : 'bg-blue-600'}`} onPress={handleSubmit(signIn)} disabled={loading}>
        <Text className="text-white font-medium">{loading ? 'Logging in...' : 'Login'}</Text>
      </Pressable>
    </View>
  )
}

export default Login