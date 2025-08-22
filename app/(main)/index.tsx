import PostList from "@/components/ui/main/PostList";
import TodayWritingInput from "@/components/ui/main/TodayPostInput";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function MainScreen() {
  return (
    <SafeAreaView>
      <TodayWritingInput />
      <PostList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
