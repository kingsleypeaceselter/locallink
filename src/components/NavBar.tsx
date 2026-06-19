"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NavBar() {
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      // 1. Get the current active session user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Fetch only the avatar_url from the profiles database table
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (data && !error && data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    };

    fetchUserAvatar();

    // Optional: Listen for auth state alterations to clear/update instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserAvatar();
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: "Feed", href: "/feed", icon: "🌐" },
    { label: "My Skills", href: "/skills", icon: "⭐" },
    { label: "Swaps", href: "/swaps", icon: "🔄" },
    { label: "Messages", href: "/messages", icon: "💬" },
  ];

  const isProfileActive = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-light-gray z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {/* Core Nav Items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-forest font-semibold" : "text-muted hover:text-dark"
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Dynamic Profile/Avatar Nav Item */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
            isProfileActive ? "text-forest font-semibold" : "text-muted hover:text-dark"
          }`}
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className={`w-6 h-6 rounded-full object-cover mb-0.5 border ${
                isProfileActive ? "border-forest" : "border-gray-300"
              }`}
            />
          ) : (
            <span className="text-xl mb-0.5">👤</span>
          )}
          <span className="text-[10px] tracking-tight">Profile</span>
        </Link>
      </div>
    </nav>
  );
}