import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const GoogleLoginButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 현재 로그인된 사용자 확인
    checkUser();

    // Auth 상태 변경 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("사용자 정보 확인 중 오류:", error);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // app.json(expo) 혹은 app.config에서 설정한 scheme 사용 (예: "geuljjeok")
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "geuljjeok",
        // 필요시 path: "auth/callback" 등 지정 가능
      });

      // 브라우저 자동 이동 막고 URL만 받기
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("OAuth URL 생성 실패");

      // 사용자가 로그인 완료하면 redirectUrl로 돌아옴
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const parsed = new URL(result.url);
        const code = parsed.searchParams.get("code");
        const error_description = parsed.searchParams.get("error_description");
        if (error_description) throw new Error(error_description);
        if (!code) throw new Error("인가 코드가 없습니다.");

        // 여기서 세션 교환 (PKCE)
        const { data: sessionData, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) throw exchangeError;

        Alert.alert("로그인 성공", "환영합니다!");
      }
    } catch (err: any) {
      console.error("Google 로그인 오류:", err);
      Alert.alert("로그인 오류", err?.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      Alert.alert("로그아웃", "성공적으로 로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      Alert.alert("로그아웃 오류", "로그아웃에 실패했습니다.");
    }
  };

  const getUserProfile = async () => {
    if (!user) return;

    try {
      // 사용자 프로필 정보 가져오기 (profiles 테이블이 있다고 가정)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("프로필 조회 오류:", error);
    }
  };

  const createOrUpdateProfile = async () => {
    if (!user) return;

    try {
      const updates = {
        id: user.id,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        email: user.email,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
    }
  };
  console.log(user);
  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>환영합니다!</Text>
          <Text style={styles.userText}>이메일: {user.email}</Text>
          <Text style={styles.userText}>
            이름: {user.user_metadata?.full_name || "이름 없음"}
          </Text>
          {user.user_metadata?.avatar_url && (
            <Text style={styles.userText}>프로필 사진이 있습니다</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={signOut}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.profileButton]}
          onPress={createOrUpdateProfile}
        >
          <Text style={styles.buttonText}>프로필 업데이트</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google 로그인</Text>

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={signInWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Google로 로그인</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  signOutButton: {
    backgroundColor: "#f44336",
  },
  profileButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  userText: {
    fontSize: 14,
    marginVertical: 2,
    color: "#666",
  },
});

export default GoogleLoginButton;
