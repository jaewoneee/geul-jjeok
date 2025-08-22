import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { signOut } from "@/lib/auth";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const router = useRouter();

  const onPressLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (e: any) {
      Alert.alert("로그아웃 실패", e.message ?? "잠시 후 다시 시도해 주세요.");
    }
  };
  return (
    <SafeAreaView>
      <ThemedText>Setting</ThemedText>
      <ThemedButton label="Logout" onPress={onPressLogout} />
    </SafeAreaView>
  );
}
