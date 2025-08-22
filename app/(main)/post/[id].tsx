import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <ThemedText>{id}</ThemedText>
    </SafeAreaView>
  );
}
