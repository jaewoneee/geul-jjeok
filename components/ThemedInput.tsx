import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type TextInputProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedInputProps = TextInputProps & {
  /** 텍스트 컬러 오버라이드 */
  lightColor?: string;
  darkColor?: string;
  /** 배경/보더/플레이스홀더 컬러 오버라이드 */
  bgLightColor?: string;
  bgDarkColor?: string;
  borderLightColor?: string;
  borderDarkColor?: string;
  placeholderLightColor?: string;
  placeholderDarkColor?: string;
  /** 스타일 변형 & 사이즈 */
  variant?: "outline" | "underline";
  size?: "sm" | "md" | "lg";
};

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  (
    {
      style,
      lightColor,
      darkColor,
      bgLightColor,
      bgDarkColor,
      borderLightColor,
      borderDarkColor,
      placeholderLightColor,
      placeholderDarkColor,
      variant = "outline",
      size = "md",
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const textColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "text"
    );
    const backgroundColor = useThemeColor(
      { light: bgLightColor, dark: bgDarkColor },
      "background"
    );
    const borderColor = useThemeColor(
      { light: borderLightColor, dark: borderDarkColor },
      "border"
    );
    const placeholderTextColor = useThemeColor(
      {
        light: placeholderLightColor ?? "#8A8A8A",
        dark: placeholderDarkColor ?? "#A1A1A1",
      },
      "text"
    );

    const [focused, setFocused] = useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor}
        style={[
          { color: textColor },
          styles.base,
          size === "sm" && styles.sm,
          size === "md" && styles.md,
          size === "lg" && styles.lg,
          variant === "outline" && [
            styles.outline,
            { backgroundColor, borderColor, borderWidth: focused ? 2 : 1 },
          ],
          variant === "underline" && [
            styles.underline,
            {
              borderBottomColor: borderColor,
              borderBottomWidth: focused ? 2 : 1,
            },
          ],
          style,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
    );
  }
);

ThemedInput.displayName = "ThemedInput";

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
  sm: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  md: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  lg: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  outline: {
    borderStyle: "solid",
  },
  underline: {
    paddingHorizontal: 0,
    borderRadius: 0,
  },
});
