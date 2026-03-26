import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  RefreshControl, ActivityIndicator, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useEvents, useSavedEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import CategoryPills from "@/components/CategoryPills";
import { Colors } from "@/constants/colors";

export default function HomeScreen() {
  const { user } = useAuth();
  const [category, setCategory]   = useState("All");
  const [search, setSearch]       = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { events, loading, refetch } = useEvents(category, searchQuery);
  const { events: savedEvents, toggleSave } = useSavedEvents();
  const savedIds = new Set(savedEvents.map((e) => e._id));

  const handleSearch = () => setSearchQuery(search);

  const featuredEvents = events.filter((e) => e.attendees.length > 0).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={Colors.accent} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hey, {user?.name?.split(" ")[0] || "there"} 👋
            </Text>
            <Text style={styles.subGreeting}>What are you looking for today?</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={{ fontSize: 20 }}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, locations..."
            placeholderTextColor={Colors.textS}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(""); setSearchQuery(""); }}>
              <Text style={{ color: Colors.textS, fontSize: 18, paddingRight: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <CategoryPills selected={category} onSelect={setCategory} />

        {/* Featured */}
        {!searchQuery && featuredEvents.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 20 }]}>
              <Text style={styles.sectionTitle}>🔥 Trending</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
              {featuredEvents.map((event) => (
                <View key={event._id} style={styles.featuredCard}>
                  <EventCard
                    event={event}
                    onSave={toggleSave}
                    saved={savedIds.has(event._id)}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* All Events */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "All Events"}
          </Text>
          <Text style={styles.count}>{events.length}</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={Colors.accent} size="large" />
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>🎭</Text>
              <Text style={styles.emptyTitle}>No events found</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Try a different search term."
                  : "Check back later for new events!"}
              </Text>
            </View>
          ) : (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onSave={toggleSave}
                saved={savedIds.has(event._id)}
              />
            ))
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: "800", color: Colors.textP, letterSpacing: -0.3 },
  subGreeting: { fontSize: 13, color: Colors.textS, marginTop: 3 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent + "33",
    borderWidth: 2, borderColor: Colors.accent,
    alignItems: "center", justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14, marginHorizontal: 20, marginBottom: 4,
    paddingHorizontal: 14, paddingVertical: 2,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: Colors.textP, fontSize: 14, paddingVertical: 12 },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.textP },
  seeAll: { fontSize: 13, color: Colors.accent, fontWeight: "600" },
  count: {
    backgroundColor: Colors.accent + "22", color: Colors.accent,
    fontSize: 12, fontWeight: "700", paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 100,
  },
  featuredCard: { width: 300 },
  loadingWrap: { paddingVertical: 60, alignItems: "center" },
  emptyWrap: { paddingVertical: 60, alignItems: "center" },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: Colors.textP, marginBottom: 8 },
  emptyText: { fontSize: 13, color: Colors.textS, textAlign: "center" },
});
