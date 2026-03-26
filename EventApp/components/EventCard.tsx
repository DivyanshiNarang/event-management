import React from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { format } from "date-fns";
import { Event } from "@/lib/types";
import { Colors } from "@/constants/colors";

interface Props {
  event: Event;
  onSave?: (id: string) => void;
  saved?: boolean;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Music:       "#6c63ff",
  Tech:        "#00d4aa",
  Art:         "#ff6b9d",
  Food:        "#ffa94d",
  Sports:      "#4cc9f0",
  Networking:  "#7bed9f",
  Other:       "#8888aa",
};

export default function EventCard({ event, onSave, saved, compact }: Props) {
  const catColor = CATEGORY_COLORS[event.category] || Colors.accent;
  const dateStr  = format(new Date(event.date), "EEE, MMM d");

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compact}
        activeOpacity={0.8}
        onPress={() => router.push(`/event/${event._id}`)}
      >
        <Image
          source={{ uri: event.coverImage || "https://picsum.photos/seed/" + event._id + "/80/80" }}
          style={styles.compactImg}
        />
        <View style={styles.compactInfo}>
          <Text style={[styles.catBadge, { color: catColor }]}>{event.category}</Text>
          <Text style={styles.compactTitle} numberOfLines={2}>{event.title}</Text>
          <Text style={styles.compactMeta}>{dateStr} · {event.location}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/event/${event._id}`)}
    >
      {/* Cover */}
      <View style={styles.coverWrap}>
        <Image
          source={{ uri: event.coverImage || "https://picsum.photos/seed/" + event._id + "/400/200" }}
          style={styles.cover}
        />
        {/* Category badge */}
        <View style={[styles.catPill, { backgroundColor: catColor + "22", borderColor: catColor + "55" }]}>
          <Text style={[styles.catPillText, { color: catColor }]}>{event.category}</Text>
        </View>
        {/* Save button */}
        {onSave && (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => onSave(event._id)}
          >
            <Text style={{ fontSize: 18 }}>{saved ? "🔖" : "🤍"}</Text>
          </TouchableOpacity>
        )}
        {/* Free badge */}
        {event.price === 0 && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📅</Text>
          <Text style={styles.metaText}>{dateStr}</Text>
          <Text style={[styles.metaIcon, { marginLeft: 12 }]}>🕐</Text>
          <Text style={styles.metaText}>{event.time}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.attendees}>
            👥 {event.attendees.length}
            {event.maxAttendees ? `/${event.maxAttendees}` : ""} going
          </Text>
          <Text style={styles.price}>
            {event.price === 0 ? "Free" : `₹${event.price}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coverWrap: { position: "relative", height: 180 },
  cover: { width: "100%", height: "100%", resizeMode: "cover" },
  catPill: {
    position: "absolute", top: 12, left: 12,
    borderRadius: 100, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  catPillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  saveBtn: {
    position: "absolute", top: 10, right: 12,
    backgroundColor: "#00000055", borderRadius: 20,
    padding: 6,
  },
  freeBadge: {
    position: "absolute", bottom: 12, right: 12,
    backgroundColor: Colors.accent3,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  freeText: { color: Colors.bg, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  content: { padding: 16 },
  title: { color: Colors.textP, fontSize: 17, fontWeight: "700", marginBottom: 10, lineHeight: 24 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  metaIcon: { fontSize: 13, marginRight: 5 },
  metaText: { color: Colors.textS, fontSize: 13, flex: 1 },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border },
  attendees: { color: Colors.textS, fontSize: 13 },
  price: { color: Colors.accent, fontSize: 14, fontWeight: "700" },
  // compact
  compact: {
    flexDirection: "row", backgroundColor: Colors.surface,
    borderRadius: 14, overflow: "hidden", marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border, padding: 10,
  },
  compactImg: { width: 72, height: 72, borderRadius: 10, resizeMode: "cover" },
  compactInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  catBadge: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  compactTitle: { color: Colors.textP, fontSize: 14, fontWeight: "600", marginBottom: 4, lineHeight: 19 },
  compactMeta: { color: Colors.textS, fontSize: 12 },
});
