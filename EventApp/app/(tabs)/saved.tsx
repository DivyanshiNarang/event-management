import React from "react";
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSavedEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { Colors } from "@/constants/colors";

export default function SavedScreen() {
  const { events, loading, refetch, toggleSave } = useSavedEvents();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Events</Text>
        <Text style={styles.count}>{events.length}</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(e) => e._id}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🔖</Text>
              <Text style={styles.emptyTitle}>Nothing saved yet</Text>
              <Text style={styles.emptyText}>
                Tap the 🤍 on any event card to save it for later.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard
              event={item}
              compact
              onSave={toggleSave}
              saved={true}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "800", color: Colors.textP, letterSpacing: -0.3 },
  count: {
    backgroundColor: Colors.accent + "22", color: Colors.accent,
    fontSize: 12, fontWeight: "700", paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 100,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { paddingTop: 80, alignItems: "center", paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.textP, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.textS, textAlign: "center", lineHeight: 20 },
});
