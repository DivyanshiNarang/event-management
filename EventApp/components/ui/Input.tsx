import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  TextInputProps, ViewStyle,
} from "react-native";
import { Colors } from "@/constants/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  containerStyle?: ViewStyle;
}

export default function Input({
  label, error, icon, rightIcon, onRightPress, containerStyle, ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text style={{
          fontSize: 12, letterSpacing: 0.5, color: Colors.textS,
          marginBottom: 8, textTransform: "uppercase",
        }}>
          {label}
        </Text>
      )}
      <View style={{
        flexDirection: "row", alignItems: "center",
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: error ? Colors.error : focused ? Colors.accent : Colors.border,
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}>
        {icon && <View style={{ marginRight: 10, opacity: 0.6 }}>{icon}</View>}
        <TextInput
          style={{
            flex: 1, color: Colors.textP, fontSize: 15,
            paddingVertical: 12,
          }}
          placeholderTextColor={Colors.textS}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={{ padding: 4 }}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ color: Colors.error, fontSize: 12, marginTop: 6 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
