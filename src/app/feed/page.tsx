"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Master Array with all 13 Global Profiles (Tech + Skilled Trades) fully restored
const MOCK_SKIPS = [
  {
    id: "mock-1",
    name: "Alex Johnson",
    location: "London, UK",
    skill_offered: "Java Software Engineering",
    exchange_type: "paid",
    charge_amount: "45",
    category: "Digital",
    skill_wanted: "",
    rating: 4.9,
    reviews_count: 32,
    bio: "Senior Java engineer available for backend system setup, API architecture, or custom tutoring.",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-2",
    name: "Mariam Ali",
    location: "Heliopolis, Cairo",
    skill_offered: "Web Development (HTML/CSS/JS)",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Digital",
    skill_wanted: "Advanced English",
    rating: 4.8,
    reviews_count: 14,
    bio: "Can help you construct your responsive frontend portfolio from scratch using Tailwind CSS.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-3",
    name: "Oliver Müller",
    location: "Berlin, Germany",
    skill_offered: "Cybersecurity Training",
    exchange_type: "paid",
    charge_amount: "35",
    category: "Digital",
    skill_wanted: "",
    rating: 5.0,
    reviews_count: 8,
    bio: "Let's trade! I can teach you system hardening and basic network penetration defense fundamentals.",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-4",
    name: "Emma Dupont",
    location: "Paris, France",
    skill_offered: "Fashion Design & Tailoring",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Digital",
    skill_wanted: "Social Media Marketing",
    rating: 4.7,
    reviews_count: 19,
    bio: "Experienced dressmaker. I can teach you pattern drafting and sewing basics if you help me grow my brand.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-5",
    name: "Sarah Joshua",
    location: "New York, USA",
    skill_offered: "Cloud Architecture (AWS)",
    exchange_type: "paid",
    charge_amount: "60",
    category: "Digital",
    skill_wanted: "",
    rating: 4.9,
    reviews_count: 27,
    bio: "Deploying apps to the cloud can be tricky! Let me show you simple hosting pipelines.",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-6",
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    skill_offered: "Conversational Japanese",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Digital",
    skill_wanted: "Python Programming",
    rating: 4.6,
    reviews_count: 11,
    bio: "Native speaker offering friendly, structured speech practice. Looking to get into data science automation.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-7",
    name: "Carlos Mendez",
    location: "Madrid, Spain",
    skill_offered: "Professional Sourdough Baking",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Trades",
    skill_wanted: "Financial Bookkeeping",
    rating: 4.9,
    reviews_count: 34,
    bio: "I can teach you the secrets of artisanal bread making and fermentation from home.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-8",
    name: "Amara Nwosu",
    location: "Lagos, Nigeria",
    skill_offered: "Graphic Design & Branding",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Digital",
    skill_wanted: "Photography & Lighting",
    rating: 4.8,
    reviews_count: 15,
    bio: "Creating logos and brand identities is my day job. I want to learn studio lighting setups.",
    avatar_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-9",
    name: "Liam O'Connor",
    location: "Dublin, Ireland",
    skill_offered: "Traditional Finish Carpentry",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Trades",
    skill_wanted: "Spanish Language",
    rating: 4.9,
    reviews_count: 41,
    bio: "Handcrafting wooden tables and home decor. Wanting to learn basic conversational Spanish before traveling.",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-10",
    name: "Sofia Rossi",
    location: "Rome, Italy",
    skill_offered: "Oil Painting Techniques",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Digital",
    skill_wanted: "Excel & Data Management",
    rating: 4.8,
    reviews_count: 5,
    bio: "Fine arts graduate ready to guide you through canvas blending. In return, teach me how to manage client metrics.",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-11",
    name: "Ahmed Hassan",
    location: "Bab al-Louq, Cairo",
    skill_offered: "Master Plumbing & Pipe Repair",
    exchange_type: "paid",
    charge_amount: "20",
    category: "Trades",
    skill_wanted: "",
    rating: 4.9,
    reviews_count: 56,
    bio: "Professional plumber with 10 years experience. Available for smart installations, deep leak detection, and home emergency services.",
    avatar_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-12",
    name: "John Smith",
    location: "New York, USA",
    skill_offered: "Custom Carpentry & Cabinetry",
    exchange_type: "swap",
    charge_amount: "0",
    category: "Trades",
    skill_wanted: "Basic Website Setup",
    rating: 4.7,
    reviews_count: 22,
    bio: "I build heavy wooden structures, custom tables, and modern cabinets. Wanting to trade structural woodwork for a responsive business landing page.",
    avatar_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "mock-13",
    name: "Samuel Osei",
    location: "Accra, Ghana",
    skill_offered: "Bricklaying & Structural Masonry",
    exchange_type: "paid",
    charge_amount: "15",
    category: "Trades",
    skill_wanted: "",
    rating: 4.8,
    reviews_count: 18,
    bio: "Expert in structural block matching, alignment brickwork, stone masonry, and durable plaster fencing repairs.",
    avatar_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

export default function FeedPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Dynamic combined listings state
  const [allListings, setAllListings] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState<"all" | "swap" | "paid">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Digital" | "Trades">("all");

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUserEmail(user.email ?? "Neighbor");

      try {
        // 1. Fetch live profiles from your database
        const { data: liveProfiles, error } = await supabase
          .from("profiles")
          .select("*")
          .not("skill_offered", "is", null) 
          .order("updated_at", { ascending: false });

        if (error) throw error;

        const formattedLiveProfiles = (liveProfiles || []).map((p: any) => ({
          id: p.id,
          name: p.name || "Anonymous Member",
          location: p.location || "Remote / Unspecified",
          skill_offered: p.skill_offered || "General Skills",
          exchange_type: p.exchange_type || "paid",
          charge_amount: String(p.charge_amount || "0"),
          category: p.skill_classification?.toLowerCase().includes("trades") ? "Trades" : "Digital",
          skill_wanted: p.skill_wanted || "",
          rating: 5.0,
          reviews_count: 0,
          bio: p.bio || "No summary profile description provided.",
          avatar_url: p.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        }));

        // 2. Combine profiles
        setAllListings([...formattedLiveProfiles, ...MOCK_SKIPS]);
        
      } catch (err) {
        console.error("Database fetch error, falling back to mocks:", err);
        setAllListings(MOCK_SKIPS);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkUserAndFetchData();
  }, [router]);

  const filteredProfiles = allListings.filter((profile) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (profile.skill_offered?.toLowerCase().includes(query)) ||
      (profile.location?.toLowerCase().includes(query)) ||
      (profile.name?.toLowerCase().includes(query));

    const matchesModel = modelFilter === "all" || profile.exchange_type === modelFilter;
    const matchesCategory = categoryFilter === "all" || profile.category === categoryFilter;

    return matchesSearch && matchesModel && matchesCategory;
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-40 p-5">
        <div className="mb-8">
          <button onClick={() => router.push("/feed")} className="text-xl font-bold text-emerald-700 focus:outline-none">
            📌 LocalLink
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700">🏠 Home Feed</button>
          <button onClick={() => router.push("/messages")} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">💬 Messages</button>
          <button onClick={() => router.push("/profile")} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">👤 Edit My Profile</button>
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 md:ml-64 px-4 md:px-8 py-8 mb-20 md:mb-0">
        
        {/* HYPER-SHINING CHROMATIC BUILDING GLASS REFLECTION FACADE BANNER */}
        <div className="relative overflow-hidden rounded-2xl mb-6 p-6 md:p-8 border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.25)] bg-slate-950/95 transition-all duration-300">
          
          {/* BACKGROUND LAYER 1: Deep Skyscraper Metallic Glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950/80 to-slate-950 opacity-100 pointer-events-none" />
          
          {/* BACKGROUND LAYER 2: Highly Definition Warped Skyscraper Light Flares */}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.25)_0%,transparent_35%,rgba(255,255,255,0.18)_48%,transparent_52%,rgba(255,255,255,0.22)_70%,transparent_100%)] pointer-events-none" />
          
          {/* BACKGROUND LAYER 3: Hard Diagonal Light Shard Rays (Direct reference to image_e9b085.png shards) */}
          <div className="absolute top-0 right-1/4 w-[12%] h-[200%] bg-white/10 -rotate-[28deg] transform origin-top pointer-events-none blur-[2px]" />
          <div className="absolute top-0 left-1/3 w-[6%] h-[200%] bg-white/5 -rotate-[28deg] transform origin-top pointer-events-none blur-[1px]" />
          <div className="absolute top-0 right-1/3 w-[4%] h-[200%] bg-white/15 -rotate-[28deg] transform origin-top pointer-events-none" />

          {/* BACKGROUND LAYER 4: High Intensity Lens Glow Emitting Underneath Glass Edge */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Clickable Header Headline back to feed */}
              <button 
                onClick={() => router.push("/feed")}
                className="group flex items-center gap-2.5 text-left focus:outline-none"
              >
                <span className="text-xl md:text-2xl filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)] transition-transform group-hover:scale-110 duration-200">📌</span>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] antialiased">
                  LocalLink <span className="font-light text-slate-300 border-l border-white/30 pl-2.5 ml-1 tracking-wide">Global Skills Marketplace</span>
                </h1>
              </button>

              <p className="text-sm md:text-base text-slate-100 font-semibold max-w-2xl leading-relaxed tracking-wide antialiased filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Explore digital platforms or book real-world hands-on manual trades verified by community reviews.
              </p>
            </div>

            {/* High Definition Crystal Metallic User Badge Grid Element */}
            <div className="bg-white/10 border border-white/40 px-4 py-2.5 rounded-xl self-start md:self-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <p className="text-[10px] font-black text-emerald-300 tracking-widest uppercase mb-0.5 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Welcome Back</p>
              <p className="text-sm font-extrabold text-white tracking-wide antialiased filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{userEmail}</p>
            </div>
          </div>
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
                  <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm flex-shrink-0" />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-sm text-slate-800 truncate">{profile.name}</h3>
                    <p className="text-xs text-slate-400 truncate">📍 {profile.location}</p>
                    
                    {/* LIVE RATING & TRUST BADGE */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-500 text-xs">⭐</span>
                      <span className="text-xs font-bold text-slate-700">{profile.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400">({profile.reviews_count} reviews)</span>
                    </div>
                  </div>
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase flex-shrink-0">{profile.category}</span>
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

              {/* Dynamic redirection router button */}
              <button 
                onClick={() => router.push(`/profile/${profile.id}`)}
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