// lib/googleAuth.ts
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  // Expo Go 개발환경: auth.expo.io 리다이렉트 URL
  const returnUrl = AuthSession.makeRedirectUri(); // 예: https://auth.expo.io/@user/slug

  // 1) Supabase에 OAuth 시작 요청 (리다이렉트 주소 전달 )
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: returnUrl },
  });
  if (error) throw error;

  // 2) 시스템 브라우저로 열고, returnUrl로 돌아올 때까지 대기
  const result = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    returnUrl
  );

  if (result.type !== "success") {
    throw new Error("로그인이 취소되었거나 실패했습니다.");
  }

  // 3) 돌아온 뒤 세션 확인
  const { data: sessionData, error: sErr } = await supabase.auth.getSession();
  if (sErr) throw sErr;
  return sessionData.session;
}
