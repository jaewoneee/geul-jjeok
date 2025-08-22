import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, updated_at")
        .eq("id", user.id)
        .single();

      if (!mounted) return;
      if (error) setError(error.message);
      else setProfile(data);
      setLoading(false);
    };

    load();

    // 실시간 반영(선택)
    const channel = supabase
      .channel("profiles-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfile((prev) => ({
            ...(prev ?? ({} as Profile)),
            ...(payload.new as Profile),
          }));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { profile, loading, error };
}
