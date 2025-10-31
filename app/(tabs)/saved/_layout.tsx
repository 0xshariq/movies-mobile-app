import React from "react";
import { View, ActivityIndicator } from "react-native";
import useAuth from "@/lib/useAuth";

export default function SavedLayout({ children }: any) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Auth is optional — allow unauthenticated users to view saved route.
  return <>{children}</>;
}
