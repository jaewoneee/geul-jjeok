import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  return (
    <SafeAreaView>
      <ThemedText>Setting</ThemedText>
      <ThemedButton label="Logout" />
    </SafeAreaView>
  );
}
