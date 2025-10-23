import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { account, databases } from "../lib/appwrite";
import { useRouter } from "expo-router";
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

  const createAccount = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await account.create(
        "unique()",
        data.email,
        data.password,
        data.name
      );

      const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "";
      const usersCollection =
        process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users";
      if (databaseId) {
        await databases.createDocument(
          databaseId,
          usersCollection,
          "unique()",
          {
            appwriteId: user.$id,
            email: data.email,
            name: data.name,
          }
        );
      }

      // create session and redirect to profile
      await account.createSession(data.email, data.password);
      setValue("email", "");
      setValue("password", "");
      setValue("name", "");
      router.replace("/profile");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center bg-white">
      <Text className="text-2xl font-bold mb-6">Create an account</Text>

      <Text className="text-sm mb-2">Name</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
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

      <Text className="text-sm mb-2">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
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
        className="border border-gray-300 rounded-md p-3 mb-6"
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
          loading ? "bg-gray-400" : "bg-blue-600"
        }`}
        onPress={handleSubmit(createAccount)}
        disabled={loading}
      >
        <Text className="text-white font-medium">
          {loading ? "Creating..." : "Create account"}
        </Text>
      </Pressable>
    </View>
  );
};

export default Signup;
