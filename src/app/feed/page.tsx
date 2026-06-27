"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function FeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Failsafe: Force stop the spinner after 6 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) router.push("/auth");
        else setLoading(false);
      } catch (e) {
        console.error("Auth check failed", e);
        setLoading(false); // Stop spinning if error occurs
      } finally {
        clearTimeout(timer);
      }
    };
    init();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  return <div>Feed Loaded Successfully</div>;
}