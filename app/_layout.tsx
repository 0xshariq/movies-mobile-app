import { Stack } from "expo-router";
import './globals.css';
export default function RootLayout() {
  return <Stack>
    <Stack.Screen 
      name="index"
      options={
        {
          title: 'Home',
          headerShown: false,
        }
      }
    />
    <Stack.Screen 
     name='(tabs)'
     options={{
      headerShown: false
     }}
    />
    <Stack.Screen 
      name="movie/[id]"
      options={{
      title: "Movie-Detail",
      headerShown: false
     }} 
    />
  </Stack>;
}
