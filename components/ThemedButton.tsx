import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type ThemedButtonProps = Omit<PressableProps, "style" | "children"> & {
  /** 라벨 텍스트 (children 사용 시 생략 가능) */
  label?: string;

  /** 텍스트 컬러 오버라이드 */
  lightColor?: string;
  darkColor?: string;

  /** 배경/보더 컬러 오버라이드 */
  bgLightColor?: string;
  bgDarkColor?: string;
  borderLightColor?: string;
  borderDarkColor?: string;

  /** variant & size */
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";

  /** 좌/우 아이콘 */
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  /** 가로 꽉 채우기 */
  fullWidth?: boolean;

  /** 로딩 표시 */
  loading?: boolean;

  /** 일반 children만 허용 (함수형 children 제외) */
  children?: React.ReactNode;

  /** 스타일 오버라이드 */
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const ThemedButton = forwardRef<View, ThemedButtonProps>(
  (
    {
      label,
      children,
      lightColor,
      darkColor,
      bgLightColor,
      bgDarkColor,
      borderLightColor,
      borderDarkColor,
      variant = "solid",
      size = "md",
      leftIcon,
      rightIcon,
      fullWidth,
      loading = false,
      disabled,
      onPress,
      containerStyle,
      textStyle,
      accessibilityLabel,
      ...rest
    },
    ref
  ) => {
    // 색상 토큰 계산
    const textColorBase = useThemeColor(
      { light: lightColor, dark: darkColor },
      "text"
    );
    const backgroundBase = useThemeColor(
      { light: bgLightColor, dark: bgDarkColor },
      "subBackground"
    );
    const borderBase = useThemeColor(
      { light: borderLightColor, dark: borderDarkColor },
      "subBorder"
    );
    // SOLID에서 대비용 라벨 컬러 (일반적으로 theme.background)
    const contrastOnSolid = useThemeColor({}, "background");

    const isDisabled = disabled || loading;

    const handlePress = (e: GestureResponderEvent) => {
      if (isDisabled) return;
      onPress?.(e);
    };
    console.log(backgroundBase, borderBase, textColorBase);
    // 사이즈별 스타일
    const sizeBox =
      size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;
    const sizeText =
      size === "sm"
        ? styles.textSm
        : size === "lg"
        ? styles.textLg
        : styles.textMd;

    // 라벨 컬러 결정 (solid면 대비색, 그 외엔 텍스트 기본)
    // const labelLight = variant === "solid" ? contrastOnSolid : lightColor;
    // const labelDark = variant === "solid" ? contrastOnSolid : darkColor;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        disabled={isDisabled}
        onPress={handlePress}
        style={({ pressed }) => [
          { opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1 },
          fullWidth ? { alignSelf: "stretch" } : null,
        ]}
        {...rest}
      >
        {/* 배경/보더는 ThemedView에서 */}
        <ThemedView
          // solid일 때만 배경을 theme.tint(또는 오버라이드)로 강제
          lightColor={variant === "solid" ? backgroundBase : undefined}
          darkColor={variant === "solid" ? backgroundBase : undefined}
          style={[
            styles.base,
            sizeBox,
            variant !== "solid" && { backgroundColor: "transparent" },
            variant === "outline" && {
              borderWidth: 1,
              borderColor: borderBase,
            },
            containerStyle,
          ]}
        >
          <View style={styles.content}>
            {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

            {loading ? (
              <ActivityIndicator size="small" color={contrastOnSolid} />
            ) : children ? (
              children
            ) : (
              <ThemedText
                type="defaultSemiBold"
                lightColor={textColorBase}
                darkColor={textColorBase}
                style={[sizeText, textStyle]}
                numberOfLines={1}
              >
                {label}
              </ThemedText>
            )}

            {rightIcon ? (
              <View style={styles.iconRight}>{rightIcon}</View>
            ) : null}
          </View>
        </ThemedView>
      </Pressable>
    );
  }
);

ThemedButton.displayName = "ThemedButton";

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
  },
  sm: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
  },
  md: {
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 10,
  },
  lg: {
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    minHeight: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  iconLeft: { marginRight: 4 },
  iconRight: { marginLeft: 4 },
  textSm: { fontSize: 14 },
  textMd: { fontSize: 16 },
  textLg: { fontSize: 17 },
});
