import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  Alert, StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useSavedEvents } from "@/hooks/useEvents";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { Colors } from "@/constants/colors";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  bio:  z.string().max(160, "Max 160 characters").optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { events: savedEvents } = useSavedEvents();

  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || "", bio: user?.bio || "" },
  });

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to change your avatar.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const uri  = result.assets[0].uri;
        const form = new FormData();
        form.append("avatar", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
        await api.put("/users/avatar", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await refreshUser();
      } catch {
        Alert.alert("Upload failed", "Could not update profile picture.");
      } finally {
        setUploading(false);
      }
    }
  };

  const onSave = async (data: FormData) => {
    setSaving(true);
    try {
      await api.put("/users/profile", data);
      await refreshUser();
      setEditing(false);
    } catch {
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)} style={styles.editBtn}>
            <Text style={styles.editBtnText}>{editing ? "Cancel" : "✏️ Edit"}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarWrap}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
            {uploading && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color={Colors.white} />
              </View>
            )}
            <View style={styles.cameraBtn}>
              <Text style={{ fontSize: 14 }}>📷</Text>
            </View>
          </TouchableOpacity>

          {!editing && (
            <>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              {user?.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
            </>
          )}
        </View>

        {/* Edit form */}
        {editing && (
          <View style={styles.editForm}>
            <Controller control={control} name="name"
              render={({ field: { onChange, value } }) => (
                <Input label="Name" value={value} onChangeText={onChange}
                  error={errors.name?.message} />
              )}
            />
            <Controller control={control} name="bio"
              render={({ field: { onChange, value } }) => (
                <Input label="Bio" value={value} onChangeText={onChange}
                  placeholder="Tell people about yourself..."
                  multiline numberOfLines={3}
                  error={errors.bio?.message} />
              )}
            />
            <Button label="Save Changes" loading={saving} onPress={handleSubmit(onSave)} />
          </View>
        )}

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{savedEvents.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{user?.joinedGroups?.length || 0}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : "—"}
            </Text>
            <Text style={styles.statLabel}>Member since</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {[
            { icon: "🔔", label: "Notifications" },
            { icon: "🔒", label: "Privacy & Security" },
            { icon: "❓", label: "Help & Support" },
            { icon: "ℹ️",  label: "About" },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Button label="Sign Out" variant="danger" onPress={handleLogout} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "800", color: Colors.textP, letterSpacing: -0.3 },
  editBtn: {
    backgroundColor: Colors.surface, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border,
  },
  editBtnText: { color: Colors.textP, fontSize: 13, fontWeight: "600" },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatarWrap: { position: "relative", marginBottom: 14 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: Colors.accent },
  avatarPlaceholder: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.accent + "33",
    borderWidth: 3, borderColor: Colors.accent,
    alignItems: "center", justifyContent: "center",
  },
  avatarInitial: { fontSize: 36, fontWeight: "800", color: Colors.accent },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48, backgroundColor: "#00000077",
    alignItems: "center", justifyContent: "center",
  },
  cameraBtn: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 12, padding: 4,
    borderWidth: 2, borderColor: Colors.bg,
  },
  name: { fontSize: 20, fontWeight: "800", color: Colors.textP, marginBottom: 4 },
  email: { fontSize: 13, color: Colors.textS, marginBottom: 8 },
  bio: { fontSize: 13, color: Colors.textS, textAlign: "center", paddingHorizontal: 40, lineHeight: 18 },
  editForm: { paddingHorizontal: 20, marginBottom: 8 },
  stats: {
    flexDirection: "row", backgroundColor: Colors.surface,
    borderRadius: 20, marginHorizontal: 20, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "800", color: Colors.textP },
  statLabel: { fontSize: 11, color: Colors.textS, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.4 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  menu: {
    backgroundColor: Colors.surface, borderRadius: 20,
    marginHorizontal: 20, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border, overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuIcon: { fontSize: 18, marginRight: 14 },
  menuLabel: { flex: 1, color: Colors.textP, fontSize: 14, fontWeight: "500" },
  menuArrow: { color: Colors.textS, fontSize: 20 },
});
