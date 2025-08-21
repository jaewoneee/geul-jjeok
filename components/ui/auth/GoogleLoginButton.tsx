import { useAuth } from "@/providers/auth";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GoogleLoginButton = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (user) {
    return (
      <View>
        <View style={styles.userInfo}>
          {/* <Text style={styles.welcomeText}>환영합니다!</Text>
          <Text style={styles.userText}>이메일: {user.email}</Text>
          <Text style={styles.userText}>
            이름: {user.user_metadata?.full_name || "이름 없음"}
          </Text> */}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={signOut}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles.googleButton]}
      onPress={async () => {
        try {
          await signInWithGoogle();
        } catch (e: any) {
          Alert.alert("로그인 오류", e?.message ?? "로그인에 실패했습니다.");
        }
      }}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Google로 로그인</Text>
      )}
    </TouchableOpacity>
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  userInfo: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default GoogleLoginButton;
