import { Stack } from "expo-router";
import "./globals.css";
import Middleware from './_middleware'
import { AuthProvider } from './lib/AuthProvider'
import { ToastProvider } from './lib/ToastProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <Middleware />
          <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              title: "Movie-Detail",
              headerShown: false,
            }}
          />
        </Stack>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
