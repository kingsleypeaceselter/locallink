"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/feed");
        } else {
          router.push("/auth");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        router.push("/auth");
      }
    }
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center gap-2">
      <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-muted">Loading LocalLink...</p>
    </div>
  );
}