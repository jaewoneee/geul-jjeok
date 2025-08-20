// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isWeb = Platform.OS === "web";

// 웹에선 import 자체를 하지 않도록 분기
let storage: any = undefined;
if (!isWeb) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SecureStore = require("expo-secure-store");

  // SecureStore 어댑터
  storage = {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (e) {
        console.error("SecureStore getItem error:", e);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (e) {
        console.error("SecureStore setItem error:", e);
      }
    },
    removeItem: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (e) {
        console.error("SecureStore removeItem error:", e);
      }
    },
  };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(isWeb ? {} : { storage }), // 네이티브만 SecureStore 사용
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: "pkce",
  },
});
