import { Stack } from "expo-router";
import "./globals.css";
import Middleware from './_middleware'
export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
