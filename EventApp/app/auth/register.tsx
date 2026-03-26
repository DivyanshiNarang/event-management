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
  name:            z.string().min(2, "Name must be at least 2 characters"),
  email:           z.string().email("Enter a valid email"),
  password:        z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { register: registerUser } = useAuth();
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
      await registerUser(data.name, data.email, data.password);
    } catch (e: any) {
      setApiError(e.response?.data?.message || "Registration failed. Try again.");
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

        <LinearGradient
          colors={[Colors.accent2 + "33", "transparent"]}
          style={styles.blob}
          start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
        />

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join thousands discovering events near you</Text>
        </View>

        <View style={styles.card}>

          {apiError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️  {apiError}</Text>
            </View>
          ) : null}

          <Controller control={control} name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Full Name"
                placeholder="John Doe"
                autoCapitalize="words"
                value={value} onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller control={control} name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="you@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value} onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller control={control} name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="Min. 6 characters"
                secureTextEntry={!showPw}
                value={value} onChangeText={onChange}
                error={errors.password?.message}
                rightIcon={<Text style={{ fontSize: 16 }}>{showPw ? "🙈" : "👁️"}</Text>}
                onRightPress={() => setShowPw(!showPw)}
              />
            )}
          />

          <Controller control={control} name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Re-enter password"
                secureTextEntry={!showPw}
                value={value} onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Text style={styles.terms}>
            By signing up, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <Button
            label="Create Account"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 8 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, paddingTop: 50 },
  blob: {
    position: "absolute", top: -60, right: -80,
    width: 280, height: 280, borderRadius: 140, opacity: 0.5,
  },
  back: { marginBottom: 24 },
  header: { marginBottom: 28 },
  title: { fontSize: 26, fontWeight: "800", color: Colors.textP, marginBottom: 6, letterSpacing: -0.3 },
  subtitle: { fontSize: 14, color: Colors.textS, lineHeight: 20 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: Colors.border,
  },
  errorBox: {
    backgroundColor: Colors.error + "18", borderRadius: 10, padding: 12,
    marginBottom: 16, borderWidth: 1, borderColor: Colors.error + "44",
  },
  errorText: { color: Colors.error, fontSize: 13 },
  terms: { fontSize: 12, color: Colors.textS, marginBottom: 16, lineHeight: 18 },
  termsLink: { color: Colors.accent },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 28, marginBottom: 20 },
  footerText: { color: Colors.textS, fontSize: 14 },
  footerLink: { color: Colors.accent, fontSize: 14, fontWeight: "700" },
});
