import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { account, functions } from "../lib/appwrite";
import { Link, useRouter } from "expo-router";
import { useAuthContext } from "../lib/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { refresh } = useAuthContext()

  const createAccount = async (data: FormData) => {
    setLoading(true);
    try {
      // call server-side Appwrite Function which will create the Appwrite account and the user profile document
      const functionId = process.env.EXPO_PUBLIC_APPWRITE_CREATE_USER_FUNCTION_ID || ''
      if (!functionId) throw new Error('Server function not configured')

      const payload = { email: data.email, password: data.password, username: data.name }
      await functions.createExecution(functionId, JSON.stringify(payload))

      // after server created the user, create a client session and refresh context
      await account.createSession(data.email, data.password)
      await refresh()
      setValue('email', '')
      setValue('password', '')
      setValue('name', '')
      router.replace('/profile')
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 p-6 justify-center bg-[rgba(255,255,255,0.03)] rounded-lg">
      <Text className="text-2xl font-bold mb-6 text-white">Create an account</Text>

      <Text className="text-sm mb-2 text-white">Name</Text>
      <TextInput
        className="border border-transparent bg-white/5 rounded-md p-3 mb-4 text-white"
        placeholder="Your name"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setValue("name", v);
        }}
      />
      {errors.name ? (
        <Text className="text-red-500 mb-2">{errors.name.message}</Text>
      ) : null}

      <Text className="text-sm mb-2 text-white">Email</Text>
      <TextInput
        className="border border-transparent bg-white/5 rounded-md p-3 mb-4 text-white"
        placeholder="email@example.com"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setValue("email", v);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? (
        <Text className="text-red-500 mb-2">{errors.email.message}</Text>
      ) : null}

      <Text className="text-sm mb-2 text-white">Password</Text>
      <TextInput
        className="border border-transparent bg-white/5 rounded-md p-3 mb-6 text-white"
        placeholder="••••••••"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setValue("password", v);
        }}
        secureTextEntry
      />
      {errors.password ? (
        <Text className="text-red-500 mb-2">{errors.password.message}</Text>
      ) : null}

      <Pressable
        className={`py-3 rounded-md items-center ${
          loading ? "bg-gray-400" : "bg-violet-600"
        }`}
        onPress={handleSubmit(createAccount)}
        disabled={loading}
      >
        <Text className="text-white font-medium">
          {loading ? "Creating..." : "Create account"}
        </Text>
      </Pressable>
      <Text className="text-center">Already have an account? <Link href="/login" className="underline">Log in</Link></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
