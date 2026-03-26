import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" backgroundColor={Colors.bg} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="event/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}