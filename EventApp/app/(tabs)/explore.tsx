import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvents, useSavedEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { Colors } from "@/constants/colors";

const CATEGORY_ITEMS = [
  { label: "Music",      emoji: "🎵", color: "#6c63ff" },
  { label: "Tech",       emoji: "💻", color: "#00d4aa" },
  { label: "Art",        emoji: "🎨", color: "#ff6b9d" },
  { label: "Food",       emoji: "🍕", color: "#ffa94d" },
  { label: "Sports",     emoji: "⚽", color: "#4cc9f0" },
  { label: "Networking", emoji: "🤝", color: "#7bed9f" },
  { label: "Other",      emoji: "✨", color: "#8888aa" },
];

export default function ExploreScreen() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { events, loading } = useEvents(selectedCat || undefined, searchQuery);
  const { events: savedEvents, toggleSave } = useSavedEvents();
  const savedIds = new Set(savedEvents.map((e) => e._id));

  if (!selectedCat && !searchQuery) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search any event..."
            placeholderTextColor={Colors.textS}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => setSearchQuery(search)}
            returnKeyType="search"
          />
        </View>

        <Text style={styles.browseLabel}>Browse by Category</Text>

        <FlatList
          data={CATEGORY_ITEMS}
          numColumns={2}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catCard, { borderColor: item.color + "44" }]}
              onPress={() => setSelectedCat(item.label)}
              activeOpacity={0.8}
            >
              <View style={[styles.catIcon, { backgroundColor: item.color + "22" }]}>
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
              </View>
              <Text style={[styles.catLabel, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { setSelectedCat(null); setSearchQuery(""); setSearch(""); }}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {selectedCat || `"${searchQuery}"`}
        </Text>
        <View style={{ width: 28 }} />
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
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 40 }}>🕵️</Text>
              <Text style={styles.emptyText}>No events in this category yet.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onSave={toggleSave}
              saved={savedIds.has(item._id)}
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "800", color: Colors.textP, letterSpacing: -0.3 },
  searchWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14, marginHorizontal: 20, marginBottom: 24,
    paddingHorizontal: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: Colors.textP, fontSize: 14, paddingVertical: 12 },
  browseLabel: {
    fontSize: 14, color: Colors.textS, fontWeight: "600",
    letterSpacing: 0.5, textTransform: "uppercase",
    paddingHorizontal: 20, marginBottom: 12,
  },
  grid: { paddingHorizontal: 16, gap: 12 },
  catCard: {
    flex: 1, margin: 4,
    backgroundColor: Colors.surface,
    borderRadius: 20, borderWidth: 1,
    padding: 20, alignItems: "center",
  },
  catIcon: {
    width: 60, height: 60, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    marginBottom: 10,
  },
  catLabel: { fontSize: 14, fontWeight: "700" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyWrap: { paddingTop: 60, alignItems: "center", gap: 12 },
  emptyText: { color: Colors.textS, fontSize: 14, textAlign: "center" },
});
