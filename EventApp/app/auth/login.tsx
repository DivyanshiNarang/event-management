import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setApiError("");
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      setApiError(e.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* BG gradient blob */}
        <LinearGradient
          colors={[Colors.accent + "33", "transparent"]}
          style={styles.blob}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚡</Text>
          <Text style={styles.appName}>EventApp</Text>
          <Text style={styles.tagline}>Discover what's happening near you</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {apiError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️  {apiError}</Text>
            </View>
          ) : null}

          <Controller
            control={control} name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="you@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control} name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPw}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                rightIcon={
                  <Text style={{ fontSize: 16 }}>{showPw ? "🙈" : "👁️"}</Text>
                }
                onRightPress={() => setShowPw(!showPw)}
              />
            )}
          />

          <Button
            label="Sign In"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 8 }}
          />

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, justifyContent: "center" },
  blob: {
    position: "absolute", top: -80, left: -60,
    width: 300, height: 300, borderRadius: 150,
    opacity: 0.6,
  },
  header: { alignItems: "center", marginBottom: 36 },
  logo: { fontSize: 48, marginBottom: 8 },
  appName: {
    fontSize: 28, fontWeight: "800", color: Colors.textP,
    letterSpacing: -0.5, marginBottom: 6,
  },
  tagline: { fontSize: 14, color: Colors.textS },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: "700", color: Colors.textP, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textS, marginBottom: 24 },
  errorBox: {
    backgroundColor: Colors.error + "18",
    borderRadius: 10, padding: 12,
    marginBottom: 16,
    borderWidth: 1, borderColor: Colors.error + "44",
  },
  errorText: { color: Colors.error, fontSize: 13 },
  forgot: { alignItems: "center", marginTop: 16 },
  forgotText: { color: Colors.textS, fontSize: 13 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footerText: { color: Colors.textS, fontSize: 14 },
  footerLink: { color: Colors.accent, fontSize: 14, fontWeight: "700" },
});
