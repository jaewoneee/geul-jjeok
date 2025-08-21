// app/auth/index.tsx
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import GoogleLoginButton from "./_components/GoogleLoginButton";

type Mode = "signin" | "signup";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    setMsg(null);
    if (!email || !pw) return setErr("이메일/비밀번호를 입력하세요.");
    if (mode === "signup" && pw !== pw2)
      return setErr("비밀번호가 일치하지 않습니다.");

    try {
      setBusy(true);
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: pw,
        });
        if (error) throw error;
        setMsg("로그인 성공!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pw });
        if (error) throw error;
        setMsg("가입 완료! 확인 메일이 발송되었을 수 있어요.");
      }
    } catch (e: any) {
      setErr(e.message ?? "에러가 발생했어요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 14 }}>
        <ThemedText style={{ fontSize: 24, fontWeight: "700" }}>
          {mode === "signin" ? "로그인" : "회원가입"}
        </ThemedText>
        <ThemedInput
          placeholder="이메일"
          autoCapitalize="none"
          variant="outline"
          size="md"
          value={email}
          onChangeText={setEmail}
        />
        <ThemedInput
          placeholder="비밀번호"
          autoCapitalize="none"
          variant="outline"
          size="md"
          secureTextEntry
          value={pw}
          onChangeText={setPw}
        />
        {mode === "signup" && (
          <ThemedInput
            placeholder="비밀번호 확인"
            autoCapitalize="none"
            variant="outline"
            size="md"
            secureTextEntry
            value={pw2}
            onChangeText={setPw2}
          />
        )}

        {!!err && <ThemedText style={{ color: "crimson" }}>{err}</ThemedText>}
        {!!msg && <ThemedText style={{ color: "teal" }}>{msg}</ThemedText>}

        <TouchableOpacity
          onPress={submit}
          disabled={busy}
          style={[btn, busy && { opacity: 0.5 }]}
        >
          {busy ? (
            <ActivityIndicator />
          ) : (
            <ThemedText style={btnText}>
              {mode === "signin" ? "로그인" : "가입하기"}
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          <ThemedText
            style={{
              textAlign: "center",
              marginTop: 8,
              textDecorationLine: "underline",
            }}
          >
            {mode === "signin"
              ? "계정이 없나요? 가입하기"
              : "이미 계정이 있나요? 로그인"}
          </ThemedText>
        </TouchableOpacity>
        {/* 구글 로그인*/}
        <GoogleLoginButton />
      </View>
    </SafeAreaView>
  );
}

const btn = {
  backgroundColor: "#111",
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: "center",
} as const;

const btnText = { color: "white", fontWeight: "600" } as const;
