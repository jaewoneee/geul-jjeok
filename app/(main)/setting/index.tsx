import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useProfile } from "@/hooks/database/useProfile";
import { useAuth } from "@/providers/auth";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile } = useProfile();

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
      <ThemedText>{`안녕하세요 ${profile?.username}`}</ThemedText>
      <ThemedButton label="Logout" onPress={onPressLogout} />
    </SafeAreaView>
  );
}
