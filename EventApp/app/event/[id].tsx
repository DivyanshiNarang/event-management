import React, { useState } from "react";
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  Alert, ActivityIndicator, StyleSheet, Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { format } from "date-fns";
import { useEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { Colors } from "@/constants/colors";

const CATEGORY_COLORS: Record<string, string> = {
  Music: "#6c63ff", Tech: "#00d4aa", Art: "#ff6b9d",
  Food: "#ffa94d", Sports: "#4cc9f0", Networking: "#7bed9f", Other: "#8888aa",
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { event, loading, error } = useEvent(id);
  const { user } = useAuth();

  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  React.useEffect(() => {
    if (event && user) {
      setIsAttending(event.attendees.includes(user._id));
    }
  }, [event, user]);

  const handleRsvp = async () => {
    if (!event) return;
    setRsvpLoading(true);
    try {
      const { data } = await api.post(`/events/${event._id}/rsvp`);
      setIsAttending(data.attending);
    } catch (e: any) {
      Alert.alert("Error", e.response?.data?.message || "Could not RSVP.");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    await Share.share({
      message: `Check out "${event.title}" on ${format(new Date(event.date), "MMM d")} at ${event.location}!`,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>😕 {error || "Event not found"}</Text>
        <Button label="Go Back" variant="ghost" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[event.category] || Colors.accent;
  const dateStr  = format(new Date(event.date), "EEEE, MMMM d, yyyy");
  const isFull   = event.maxAttendees ? event.attendees.length >= event.maxAttendees : false;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Cover image */}
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: event.coverImage || `https://picsum.photos/seed/${event._id}/800/400` }}
            style={styles.cover}
          />
          {/* Gradient overlay */}
          <View style={styles.coverOverlay} />

          {/* Top bar */}
          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={{ fontSize: 20, color: Colors.white }}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
              <Text style={{ fontSize: 18 }}>↗️</Text>
            </TouchableOpacity>
          </SafeAreaView>

          {/* Category + price badges */}
          <View style={styles.coverBadges}>
            <View style={[styles.catPill, { backgroundColor: catColor + "33", borderColor: catColor + "66" }]}>
              <Text style={[styles.catPillText, { color: catColor }]}>{event.category}</Text>
            </View>
            <View style={[styles.pricePill, event.price === 0 && { backgroundColor: Colors.accent3 + "33", borderColor: Colors.accent3 + "66" }]}>
              <Text style={[styles.pricePillText, event.price === 0 && { color: Colors.accent3 }]}>
                {event.price === 0 ? "FREE" : `₹${event.price}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>

          <Text style={styles.title}>{event.title}</Text>

          {/* Info rows */}
          <View style={styles.infoCard}>
            <InfoRow icon="📅" label="Date" value={dateStr} />
            <View style={styles.infoDivider} />
            <InfoRow icon="🕐" label="Time" value={event.time} />
            <View style={styles.infoDivider} />
            <InfoRow icon="📍" label="Location" value={event.location} />
            <View style={styles.infoDivider} />
            <InfoRow
              icon="👥" label="Attendees"
              value={`${event.attendees.length}${event.maxAttendees ? ` / ${event.maxAttendees} spots` : " going"}`}
            />
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsWrap}>
                {event.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Attendee count bar */}
          {event.maxAttendees && (
            <View style={styles.capacityWrap}>
              <View style={styles.capacityHeader}>
                <Text style={styles.capacityLabel}>Capacity</Text>
                <Text style={styles.capacityNum}>
                  {event.attendees.length}/{event.maxAttendees}
                </Text>
              </View>
              <View style={styles.capacityBar}>
                <View
                  style={[
                    styles.capacityFill,
                    { width: `${Math.min(100, (event.attendees.length / event.maxAttendees) * 100)}%` as any,
                      backgroundColor: isFull ? Colors.error : Colors.accent3 },
                  ]}
                />
              </View>
              {isFull && <Text style={styles.fullText}>This event is full</Text>}
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky RSVP button */}
      <View style={styles.stickyBottom}>
        <View style={styles.stickyInner}>
          <View>
            <Text style={styles.priceLabel}>
              {event.price === 0 ? "Free event" : `₹${event.price} per person`}
            </Text>
            <Text style={styles.spotsLeft}>
              {event.maxAttendees
                ? `${event.maxAttendees - event.attendees.length} spots left`
                : `${event.attendees.length} attending`}
            </Text>
          </View>
          <Button
            label={isAttending ? "✓ Attending" : isFull ? "Event Full" : "RSVP Now"}
            variant={isAttending ? "secondary" : "primary"}
            loading={rsvpLoading}
            disabled={isFull && !isAttending}
            onPress={handleRsvp}
            style={{ flex: 1, marginLeft: 16 }}
          />
        </View>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: Colors.bg, justifyContent: "center", alignItems: "center" },
  errorText: { color: Colors.textS, fontSize: 16 },
  coverWrap: { height: 280, position: "relative" },
  cover: { width: "100%", height: "100%", resizeMode: "cover" },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    background: "linear-gradient(transparent, rgba(9,9,15,0.8))",
    backgroundColor: "rgba(9,9,15,0.25)",
  },
  topBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backBtn: {
    backgroundColor: "#00000066",
    borderRadius: 20, padding: 8,
    width: 40, height: 40,
    alignItems: "center", justifyContent: "center",
  },
  coverBadges: {
    position: "absolute", bottom: 16, left: 16,
    flexDirection: "row", gap: 8,
  },
  catPill: {
    borderRadius: 100, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  catPillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  pricePill: {
    borderRadius: 100, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
    borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  pricePillText: { fontSize: 11, fontWeight: "700", color: Colors.textP },
  content: { padding: 20 },
  title: {
    fontSize: 24, fontWeight: "800", color: Colors.textP,
    letterSpacing: -0.4, lineHeight: 32, marginBottom: 20,
  },
  infoCard: {
    backgroundColor: Colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 4, marginBottom: 24,
  },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  infoIcon: { fontSize: 20, marginRight: 14 },
  infoText: {},
  infoLabel: { fontSize: 11, color: Colors.textS, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "600", color: Colors.textP },
  infoDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.textP, marginBottom: 10, marginTop: 4 },
  description: { fontSize: 14, color: Colors.textS, lineHeight: 22, marginBottom: 24 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  tag: {
    backgroundColor: Colors.accent + "18",
    borderRadius: 100, borderWidth: 1,
    borderColor: Colors.accent + "44",
    paddingHorizontal: 12, paddingVertical: 5,
  },
  tagText: { color: Colors.accent, fontSize: 12, fontWeight: "600" },
  capacityWrap: { marginBottom: 16 },
  capacityHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  capacityLabel: { fontSize: 13, color: Colors.textS },
  capacityNum: { fontSize: 13, color: Colors.textP, fontWeight: "600" },
  capacityBar: {
    height: 6, backgroundColor: Colors.surface2,
    borderRadius: 3, overflow: "hidden",
  },
  capacityFill: { height: "100%", borderRadius: 3 },
  fullText: { color: Colors.error, fontSize: 12, marginTop: 6 },
  stickyBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.bg,
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingBottom: 24,
  },
  stickyInner: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 16,
  },
  priceLabel: { fontSize: 15, fontWeight: "700", color: Colors.textP },
  spotsLeft: { fontSize: 12, color: Colors.textS, marginTop: 2 },
});
