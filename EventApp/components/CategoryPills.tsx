import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";

const CATEGORIES = ["All", "Music", "Tech", "Art", "Food", "Sports", "Networking", "Other"];

interface Props {
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryPills({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4, gap: 8 }}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          onPress={() => onSelect(cat)}
          activeOpacity={0.75}
          style={[
            styles.pill,
            selected === cat && styles.pillActive,
          ]}
        >
          <Text style={[styles.pillText, selected === cat && styles.pillTextActive]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  pillText: { color: Colors.textS, fontSize: 13, fontWeight: "500" },
  pillTextActive: { color: Colors.white, fontWeight: "700" },
});
