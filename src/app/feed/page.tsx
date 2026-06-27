"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function FeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Failsafe: stop loading after 5 seconds no matter what
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Failsafe: Forced stop.");
    }, 5000);

    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setLoading(false); // Stop spinning on error
      } finally {
        clearTimeout(timer);
      }
    }

    checkAuth();
    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Syncing live marketplace data... (If this stays, check Console for Errors)</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1>Feed Loaded</h1>
    </div>
  );
}