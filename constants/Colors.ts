/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    subText: "#8A8A8A",
    background: "#fff",
    subBackground: "#F5F6F7",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#333333",
    subBorder: "rgba(142, 142, 142, 1)",
  },
  dark: {
    text: "#ECEDEE",
    subText: "#A1A1A1",
    background: "#151718",
    subBackground: "#1C1F22",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#333333",
    subBorder: "#424242ff",
  },
};
