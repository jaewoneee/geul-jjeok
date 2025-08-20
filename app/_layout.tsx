import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log({ session });
      setSession(session);
      setIsLoading(false);
    });

    // 세션 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (session && inAuthGroup) {
      console.log(1);
      // 로그인된 상태에서 auth 페이지에 있으면 메인으로 이동
      router.replace("/(tabs)");
    } else if (!session && inTabsGroup) {
      console.log(2);
      // 로그인되지 않은 상태에서 tabs 페이지에 있으면 로그인으로 이동
      router.replace("/(auth)");
    } else {
      console.log(3);
      router.replace("/(tabs)");
    }
  }, [session, segments, isLoading]);

  // if (isLoading) {
  //   // 로딩 스피너 컴포넌트
  //   return <LoadingScreen />;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      {/* <Stack.Screen name="models" options={{ presentation: "modal" }} /> */}
    </Stack>
  );
}
