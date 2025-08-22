import { ThemedButton } from "@/components/ThemedButton";
import { useAuth } from "@/providers/auth";
import { Alert, StyleSheet } from "react-native";

const GoogleLoginButton = () => {
  const { loading, signInWithGoogle } = useAuth();

  return (
    <ThemedButton
      loading={loading}
      label="Google로 로그인"
      onPress={async () => {
        try {
          await signInWithGoogle();
        } catch (e: any) {
          Alert.alert("로그인 오류", e?.message ?? "로그인에 실패했습니다.");
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: { backgroundColor: "#4285F4" },
  signOutButton: { backgroundColor: "#f44336", marginTop: 12 },
  userInfo: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default GoogleLoginButton;
