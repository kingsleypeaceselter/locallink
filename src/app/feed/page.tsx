"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// MOCK DATA
const MOCK_SKIPS = [
  { id: "mock-1", name: "Alex Johnson", location: "London, UK", skill_offered: "Java Software Engineering", exchange_type: "paid", charge_amount: "45", category: "Digital", skill_wanted: "", rating: 4.9, reviews_count: 32, bio: "Senior Java engineer available for backend system setup, API architecture, or custom tutoring.", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-2", name: "Mariam Ali", location: "Heliopolis, Cairo", skill_offered: "Web Development (HTML/CSS/JS)", exchange_type: "swap", charge_amount: "0", category: "Digital", skill_wanted: "Advanced English", rating: 4.8, reviews_count: 14, bio: "Can help you construct your responsive frontend portfolio from scratch using Tailwind CSS.", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-3", name: "Oliver Müller", location: "Berlin, Germany", skill_offered: "Cybersecurity Training", exchange_type: "paid", charge_amount: "35", category: "Digital", skill_wanted: "", rating: 5.0, reviews_count: 8, bio: "Let's trade! I can teach you system hardening and basic network penetration defense fundamentals.", avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-4", name: "Emma Dupont", location: "Paris, France", skill_offered: "Fashion Design & Tailoring", exchange_type: "swap", charge_amount: "0", category: "Digital", skill_wanted: "Social Media Marketing", rating: 4.7, reviews_count: 19, bio: "Experienced dressmaker. I can teach you pattern drafting and sewing basics if you help me grow my brand.", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-5", name: "Sarah Joshua", location: "New York, USA", skill_offered: "Cloud Architecture (AWS)", exchange_type: "paid", charge_amount: "60", category: "Digital", skill_wanted: "", rating: 4.9, reviews_count: 27, bio: "Deploying apps to the cloud can be tricky! Let me show you simple hosting pipelines.", avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-6", name: "Yuki Tanaka", location: "Tokyo, Japan", skill_offered: "Conversational Japanese", exchange_type: "swap", charge_amount: "0", category: "Digital", skill_wanted: "Python Programming", rating: 4.6, reviews_count: 11, bio: "Native speaker offering friendly, structured speech practice. Looking to get into data science automation.", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-7", name: "Carlos Mendez", location: "Madrid, Spain", skill_offered: "Professional Sourdough Baking", exchange_type: "swap", charge_amount: "0", category: "Trades", skill_wanted: "Financial Bookkeeping", rating: 4.9, reviews_count: 34, bio: "I can teach you the secrets of artisanal bread making and fermentation from home.", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-8", name: "Amara Nwosu", location: "Lagos, Nigeria", skill_offered: "Graphic Design & Branding", exchange_type: "swap", charge_amount: "0", category: "Digital", skill_wanted: "Photography & Lighting", rating: 4.8, reviews_count: 15, bio: "Creating logos and brand identities is my day job. I want to learn studio lighting setups.", avatar_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-9", name: "Liam O'Connor", location: "Dublin, Ireland", skill_offered: "Traditional Finish Carpentry", exchange_type: "swap", charge_amount: "0", category: "Trades", skill_wanted: "Spanish Language", rating: 4.9, reviews_count: 41, bio: "Handcrafting wooden tables and home decor. Wanting to learn basic conversational Spanish before traveling.", avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-10", name: "Sofia Rossi", location: "Rome, Italy", skill_offered: "Oil Painting Techniques", exchange_type: "swap", charge_amount: "0", category: "Digital", skill_wanted: "Excel & Data Management", rating: 4.8, reviews_count: 5, bio: "Fine arts graduate ready to guide you through canvas blending. In return, teach me how to manage client metrics.", avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-11", name: "Ahmed Hassan", location: "Bab al-Louq, Cairo", skill_offered: "Master Plumbing & Pipe Repair", exchange_type: "paid", charge_amount: "20", category: "Trades", skill_wanted: "", rating: 4.9, reviews_count: 56, bio: "Professional plumber with 10 years experience. Available for smart installations, deep leak detection, and home emergency services.", avatar_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-12", name: "John Smith", location: "New York, USA", skill_offered: "Custom Carpentry & Cabinetry", exchange_type: "swap", charge_amount: "0", category: "Trades", skill_wanted: "Basic Website Setup", rating: 4.7, reviews_count: 22, bio: "I build heavy wooden structures, custom tables, and modern cabinets. Wanting to trade structural woodwork for a responsive business landing page.", avatar_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=150&h=150&q=80" },
  { id: "mock-13", name: "Samuel Osei", location: "Accra, Ghana", skill_offered: "Bricklaying & Structural Masonry", exchange_type: "paid", charge_amount: "15", category: "Trades", skill_wanted: "", rating: 4.8, reviews_count: 18, bio: "Expert in structural block matching, alignment brickwork, stone masonry, and durable plaster fencing repairs.", avatar_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&h=150&q=80" },
];

export default function FeedPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState<"all" | "swap" | "paid">("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "Digital" | "Trades">("all");

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        const { data: liveProfiles } = await Promise.race([
          supabase.from("profiles").select("*").not("skill_offered", "is", null),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
        ]) as any;

        const formatted = (liveProfiles || []).map((p: any) => ({
          id: p.id,
          name: p.name || "Anonymous Member",
          location: p.location || "Remote",
          skill_offered: p.skill_offered || "General Skills",
          exchange_type: p.exchange_type || "paid",
          charge_amount: String(p.charge_amount || "0"),
          category: p.skill_classification?.toLowerCase().includes("trades") ? "Trades" : "Digital",
          skill_wanted: p.skill_wanted || "",
          rating: 5.0,
          reviews_count: 0,
          bio: p.bio || "No description provided.",
          avatar_url: p.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        }));
        setAllListings([...formatted, ...MOCK_SKIPS]);
      } catch (err) {
        setAllListings(MOCK_SKIPS);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUserAndFetchData();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Syncing...</p>
      </div>
    );
  }

  const filteredProfiles = allListings.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (p.skill_offered.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)) &&
           (modelFilter === "all" || p.exchange_type === modelFilter) &&
           (categoryFilter === "all" || p.category === categoryFilter);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold mb-6">LocalLink Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold">{profile.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{profile.skill_offered}</p>
            <button onClick={() => router.push(`/profile/${profile.id}`)} className="bg-slate-900 text-white w-full py-2 rounded-xl text-xs">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}