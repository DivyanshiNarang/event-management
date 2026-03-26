import React from "react";
import {
  TouchableOpacity, Text, ActivityIndicator,
  TouchableOpacityProps, ViewStyle, TextStyle,
} from "react-native";
import { Colors } from "@/constants/colors";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const variants: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: Colors.accent, borderRadius: 14 },
    text: { color: Colors.white, fontWeight: "700" },
  },
  secondary: {
    container: {
      backgroundColor: "transparent",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors.accent,
    },
    text: { color: Colors.accent, fontWeight: "600" },
  },
  ghost: {
    container: { backgroundColor: Colors.surface, borderRadius: 14 },
    text: { color: Colors.textP, fontWeight: "500" },
  },
  danger: {
    container: { backgroundColor: Colors.error, borderRadius: 14 },
    text: { color: Colors.white, fontWeight: "700" },
  },
};

const sizes = {
  sm: { paddingVertical: 8,  paddingHorizontal: 16, fontSize: 13 },
  md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 15 },
  lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 16 },
};

export default function Button({
  label, variant = "primary", loading = false, size = "md", style, ...rest
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        v.container,
        { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal,
          alignItems: "center", justifyContent: "center" },
        style as ViewStyle,
      ]}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color as string} />
      ) : (
        <Text style={[v.text, { fontSize: s.fontSize, letterSpacing: 0.3 }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
