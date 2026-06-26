"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function FeedPage() {
  const router = useRouter();
  const [debugStatus, setDebugStatus] = useState("Initializing...");

  useEffect(() => {
    const runDebug = async () => {
      try {
        setDebugStatus("Checking Auth...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setDebugStatus("No user, redirecting...");
          router.push("/auth");
          return;
        }

        setDebugStatus("User found! Fetching profiles...");
        const { data, error } = await supabase.from("profiles").select("*").limit(5);

        if (error) {
          setDebugStatus("Database Error: " + error.message);
        } else {
          setDebugStatus("Success! Loaded " + (data?.length || 0) + " profiles.");
        }
      } catch (err) {
        setDebugStatus("Crash: " + (err as Error).message);
      }
    };

    runDebug();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <h1 className="text-xl font-bold mb-4">Diagnostic Feed</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-700 font-mono text-sm">{debugStatus}</p>
        <button 
          onClick={() => router.push("/auth")} 
          className="mt-4 text-xs text-emerald-600 underline"
        >
          Force Redirect to Auth
        </button>
      </div>
    </div>
  );
}