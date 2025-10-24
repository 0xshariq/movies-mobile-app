import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  View,
  Pressable,
} from "react-native";
import useAuth from "../lib/useAuth";
import { useToast } from "../lib/ToastProvider";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
};
const TabsLayout = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth()
  const { show } = useToast()
  return (
    <View className="flex-1">
      <View className="w-full flex-row justify-end items-center p-4">
        {!loading && user ? (
          <>
            <Text className="text-sm text-white mr-4">{user.email}</Text>
            <Pressable
              onPress={async () => {
                try {
                  await logout?.()
                  show('Logged out')
                  router.replace('/login')
                } catch (err: any) {
                  console.error(err)
                  show('Logout failed')
                }
              }}
              className="bg-white px-3 py-2 rounded-md"
            >
              <Text className="text-sm text-black">Logout</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={() => router.push("/login")} className="mr-4">
              <Text className="text-sm text-white">Login</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/signup")}
              className="bg-white px-3 py-2 rounded-md"
            >
              <Text className="text-sm text-black">Sign up</Text>
            </Pressable>
          </>
        )}
      </View>

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            backgroundColor: "#0f0d23",
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 52,
            position: "absolute",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#0f0d23",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <TabIcon focused={focused} icon={icons.home} title="Home" />
              );
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <TabIcon focused={focused} icon={icons.search} title="Search" />
              );
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <TabIcon
                  focused={focused}
                  icon={icons.person}
                  title="Profile"
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <TabIcon focused={focused} icon={icons.save} title="Saved" />
              );
            },
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;
