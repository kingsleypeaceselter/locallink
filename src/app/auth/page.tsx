"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// TypeScript interface defining what a Profile looks like
interface Profile {
  id: string;
  name: string;
  location: string;
  skill_offered: string;
  exchange_type: "swap" | "paid";
  charge_amount: string;
  category: "Digital" | "Trades";
  skill_wanted: string;
  bio: string;
  rating: number;
  reviews_count: number;
  avatar_url: string;
}

export default function FeedPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Dynamic State for Live Profiles
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState<"all" | "swap" | "paid">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Digital" | "Trades">("all");

  useEffect(() => {
    const initializeFeed = async () => {
      // 1. Check user authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUserEmail(user.email ?? "Neighbor");
      setCheckingAuth(false);

      // 2. Fetch Live Profiles from Supabase
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProfiles(data as Profile[]);
        } else {
          // Fallback array if your database table is still completely empty
          setProfiles([
            {
              id: "fallback-1",
              name: "Ahmed Hassan",
              location: "Bab al-Louq, Cairo",
              skill_offered: "Master Plumbing & Pipe Repair",
              exchange_type: "paid",
              charge_amount: "20",
              category: "Trades",
              skill_wanted: "",
              rating: 4.9,
              reviews_count: 56,
              bio: "Professional plumber with 10 years experience. Available for deep leak detection.",
              avatar_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&h=150&q=80",
            },
            {
              id: "fallback-2",
              name: "Mariam Ali",
              location: "Heliopolis, Cairo",
              skill_offered: "Web Development (HTML/CSS/JS)",
              exchange_type: "swap",
              charge_amount: "0",
              category: "Digital",
              skill_wanted: "Advanced English",
              rating: 4.8,
              reviews_count: 14,
              bio: "Can help you construct your responsive frontend portfolio from scratch.",
              avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setLoadingProfiles(false);
      }
    };

    initializeFeed();
  }, [router]);

  // Combined Compound Filter Logic on live database state
  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (profile.skill_offered?.toLowerCase() || "").includes(query) ||
      (profile.location?.toLowerCase() || "").includes(query) ||
      (profile.name?.toLowerCase() || "").includes(query);

    const matchesModel = modelFilter === "all" || profile.exchange_type === modelFilter;
    const matchesCategory = categoryFilter === "all" || profile.category === categoryFilter;

    return matchesSearch && matchesModel && matchesCategory;
  });

  if (checkingAuth || loadingProfiles) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold animate-pulse">Syncing live marketplace data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-40 p-5">
        <div className="mb-8"><span className="text-xl font-bold text-emerald-700">📌 LocalLink</span></div>
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700">🏠 Home Feed</button>
          <button onClick={() => router.push("/messages")} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">💬 Messages</button>
          <button onClick={() => router.push("/profile")} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">👤 My Profile</button>
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 md:ml-64 px-4 md:px-8 py-8 mb-20 md:mb-0">
        
        {/* BANNER */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl p-6 text-white mb-6 shadow-md">
          <h1 className="text-2xl font-bold mb-1">Global Skills Marketplace</h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Connected Live to Cloud Database. Explore digital platforms or book real-world hands-on manual trades.
          </p>
        </div>

        {/* CONTROLS BLOCK */}
        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm mb-6 space-y-4">
          <input
            type="text"
            placeholder="🔍 Search specific skills (e.g. plumber, web dev, carpenter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl py-3 px-4 text-slate-700 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
          />
          
          <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100">
            {/* Category Sorting */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skill Type</span>
              <div className="flex gap-1.5">
                {(["all", "Digital", "Trades"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-xs px-3 py-1.5 font-semibold rounded-lg transition-all border ${
                      categoryFilter === cat ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {cat === "all" ? "All Skills" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Model Sorting */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deal Structure</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setModelFilter("all")}
                  className={`text-xs px-3 py-1.5 font-semibold rounded-lg border ${modelFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200"}`}
                >
                  All Transactions
                </button>
                <button
                  onClick={() => setModelFilter("swap")}
                  className={`text-xs px-3 py-1.5 font-semibold rounded-lg border ${modelFilter === "swap" ? "bg-emerald-700 text-white border-emerald-700" : "bg-emerald-50 text-emerald-800 border-emerald-100"}`}
                >
                  🔄 Free Swaps
                </button>
                <button
                  onClick={() => setModelFilter("paid")}
                  className={`text-xs px-3 py-1.5 font-semibold rounded-lg border ${modelFilter === "paid" ? "bg-blue-700 text-white border-blue-700" : "bg-blue-800 border-blue-100"}`}
                >
                  💵 Paid Only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FEED METRICS */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Available Listings</span>
          <span className="text-xs text-slate-500 font-semibold">{filteredProfiles.length} profiles listed</span>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <img src={profile.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm flex-shrink-0" />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm text-slate-800 truncate">{profile.name}</h3>
                    <p className="text-xs text-slate-400 truncate">📍 {profile.location}</p>
                    
                    {/* LIVE RATING & TRUST BADGE */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">⭐</span>
                      <span className="text-xs font-bold text-slate-700">{(profile.rating || 5.0).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">({profile.reviews_count || 0} reviews)</span>
                    </div>
                  </div>
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase flex-shrink-0">{profile.category || "Digital"}</span>
                </div>

                <p className="text-xs text-slate-600 italic mb-4 line-clamp-3">&ldquo;{profile.bio}&rdquo;</p>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block mb-0.5">Renders Skill:</span>
                    <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">{profile.skill_offered}</span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-0.5">Cost Structure:</span>
                    {profile.exchange_type === "swap" ? (
                      <span className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-100">🔄 Swap: {profile.skill_wanted}</span>
                    ) : (
                      <span className="inline-block bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">💵 Paid: ${profile.charge_amount} / hr</span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert(`Opening workspace message panel with ${profile.name}...`)}
                className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 text-xs font-bold mt-5 transition-all"
              >
                {profile.exchange_type === "swap" ? "Request Trade Swap →" : "Book Professional Service →"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}