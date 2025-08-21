import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 최초 세션 로드 + 변동 구독
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Google OAuth (모바일 딥링크)
  const signInWithGoogle = async () => {
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: "geuljjeok", // app.json/app.config 에 등록한 scheme
    });

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

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
    if (result.type === "success" && result.url) {
      const parsed = new URL(result.url);
      const code = parsed.searchParams.get("code");
      const errDesc = parsed.searchParams.get("error_description");
      if (errDesc) throw new Error(errDesc);
      if (!code) throw new Error("인가 코드 없음");

      const { error: exchErr } = await supabase.auth.exchangeCodeForSession(
        code
      );
      if (exchErr) throw exchErr;
      // 이후 onAuthStateChange 로 user/session 이 업데이트됩니다.
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = useMemo(
    () => ({ user, session, loading, signInWithGoogle, signOut }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
