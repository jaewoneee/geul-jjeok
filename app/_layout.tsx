import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/providers/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    const inTabsGroup = segments[0] === "(main)";

    if (session && inAuthGroup) {
      // 로그인된 상태에서 auth 페이지에 있으면 메인으로 이동
      router.replace("/(main)");
    } else if (!session && inTabsGroup) {
      // 로그인되지 않은 상태에서 tabs 페이지에 있으면 로그인으로 이동
      router.replace("/(auth)");
    }
  }, [session, segments, isLoading]);

  // if (isLoading) {
  //   // 로딩 스피너 컴포넌트
  //   return <LoadingScreen />;
  // }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(main)" />
          <Stack.Screen name="(auth)" />
          {/* <Stack.Screen name="models" options={{ presentation: "modal" }} /> */}
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
