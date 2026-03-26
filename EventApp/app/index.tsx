import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/auth/login");
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg }}>
      <ActivityIndicator color={Colors.accent} size="large" />
    </View>
  );
}