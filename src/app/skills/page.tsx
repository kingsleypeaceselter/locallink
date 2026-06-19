"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/feed");
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white border border-light-gray rounded-2xl p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">
            SkillSwap
          </h1>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Barter your skills, connect with your neighbors, and learn something new without spending a dime.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/auth" className="btn-primary text-sm py-2.5 font-semibold text-center block w-full">
            Get Started
          </Link>
        </div>
      </div>
    </div> 
  );
}