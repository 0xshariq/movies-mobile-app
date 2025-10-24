import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { account } from "../lib/appwrite";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../lib/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refresh } = useAuthContext()

  const schema = z.object({
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
    defaultValues: { email: "", password: "" },
  });

  const signIn = async (data: FormData) => {
    setError(null);
    setLoading(true);
    try {
      await account.createSession(data.email, data.password);
      // refresh AuthContext so pages re-render and profile is loaded
      try { await refresh() } catch {}
      router.replace("/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 p-6 justify-center bg-[rgba(255,255,255,0.03)] rounded-lg">
          <Text className="text-2xl font-bold mb-6 text-white">Login</Text>

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
      <Text className="text-sm mb-2">Password</Text>
      <TextInput
        className="border border-transparent bg-white/5 rounded-md p-3 mb-6 text-white"
        placeholder="••••••"
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

      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
      <Pressable
        className={`py-3 rounded-md items-center ${
          loading ? "bg-gray-400" : "bg-blue-600"
        }`}
        onPress={handleSubmit(signIn)}
        disabled={loading}
      >
        <Text className="text-white font-medium">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
          <Text className="text-center ">Don&apos;t have an account? <Link href="/signup" className="underline">Sign up</Link></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
