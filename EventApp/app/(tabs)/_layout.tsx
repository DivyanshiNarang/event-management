import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelActive]}>
        {label}
      </Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔖" label="Saved" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    position: "relative",
  },
  iconLabel: {
    fontSize: 10, color: Colors.textS,
    marginTop: 3, fontWeight: "500",
  },
  iconLabelActive: { color: Colors.accent, fontWeight: "700" },
  dot: {
    position: "absolute", bottom: -8,
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});
