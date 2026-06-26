"use client";

import { useEffect, useState } from "react"; // Added useState
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RootPage() {
  const router = useRouter();
  const [error, setError] = useState(false); // Add error state

  useEffect(() => {
    async function checkSession() {
      try {
        // Set a timeout of 5 seconds
        const { data: { session }, error: sessionError } = await Promise.race([
            supabase.auth.getSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
        ]);

        if (sessionError) throw sessionError;

        if (session) {
          router.push("/feed");
        } else {
          router.push("/auth");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setError(true); // Trigger the error state
      }
    }
    checkSession();
  }, [router]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Connection issue. Please refresh or check your internet.</p>
            <button onClick={() => window.location.reload()}>Retry</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center gap-2">
      <div className="w-6 h-6 border-2 border-dark border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-muted">Loading LocalLink...</p>
    </div>
  );
}