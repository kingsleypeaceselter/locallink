"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const MOCK_PROFILES_FALLBACK: Record<string, { 
  name: string; 
  location: string; 
  avatar_url: string;
  bio: string;
  skill_classification: string;
  skill_offered: string;
  exchange_type: string;
  skill_wanted?: string;
  charge_amount?: number;
}> = {
  "mock-1": { 
    name: "Alex Johnson", 
    location: "New York, USA", 
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Hey! I am a veteran software engineer looking to pick up different real-world skills in exchange for teaching Java logic frameworks.",
    skill_classification: "Technology",
    skill_offered: "Java Logic & Backend Architecture",
    exchange_type: "swap",
    skill_wanted: "UI Design / UI/UX Design"
  },
  "mock-2": { 
    name: "Mariam Ali", 
    location: "Cairo, Egypt", 
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Frontend enthusiast trying to master advanced CSS layout structures. Let's exchange knowledge!",
    skill_classification: "Design & Dev",
    skill_offered: "Advanced CSS Layout Design",
    exchange_type: "swap",
    skill_wanted: "Backend Systems"
  },
  "mock-4": { 
    name: "Emma Dupont", 
    location: "Paris, France", 
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Fashion designer specialized in drafting custom sewing patterns. Happy to offer patterns or consultation.",
    skill_classification: "Crafts",
    skill_offered: "Custom Sewing Patterns",
    exchange_type: "charge",
    charge_amount: 25
  },
};

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string; 
  
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProfileAndReviews = async () => {
    if (!id || typeof id !== "string") return;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);

    if (id.startsWith("mock-")) {
      setProfile(MOCK_PROFILES_FALLBACK[id] || null);
      setReviews([]); 
      setLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*, reviewer:profiles!reviews_reviewer_id_fkey(name, avatar_url)")
        .eq("profile_id", id)
        .order("created_at", { ascending: false });

      if (reviewsError) console.error("Error fetching reviews:", reviewsError.message);
      if (reviewsData) setReviews(reviewsData);

    } catch (err) {
      console.error("Unexpected live loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndReviews();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId || !id) return;

    if (id.startsWith("mock-")) {
      alert("Note: This is a placeholder mock account. Reviews cannot be stored on placeholder cards!");
      return;
    }

    setSubmittingReview(true);
    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          profile_id: id,
          reviewer_id: currentUserId,
          rating: newRating,
          comment: newComment,
        }
      ]);

    if (error) {
      alert(`Error saving review: ${error.message}`);
    } else {
      setNewComment("");
      setNewRating(5);
      fetchProfileAndReviews(); 
    }
    setSubmittingReview(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500 font-medium">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
        Loading identity details...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500 font-medium">
        Profile record not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 max-w-3xl mx-auto">
      
      <button 
        onClick={() => router.push("/feed")} 
        className="text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 block transition"
      >
        ← Back to Marketplace Feed
      </button>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border shadow-sm" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl border">👤</div>
        )}
        
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-900">{profile.name || "Community Member"}</h1>
          <p className="text-sm text-slate-400 mb-2">📍 {profile.location || "Location unlisted"}</p>
          
          <div className="flex items-center justify-center sm:justify-start gap-1 mb-4">
            <span className="text-amber-500">⭐</span>
            <span className="text-sm font-bold text-slate-800">{averageRating}</span>
            <span className="text-xs text-slate-400">({reviews.length} community reviews)</span>
          </div>

          <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-xl border italic mb-4">
            "{profile.bio || "No description shared yet."}"
          </p>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
              🛠️ Skills: {profile.skill_offered || "General Help"}
            </span>
            {profile.exchange_type === "swap" ? (
              <span className="bg-purple-50 border border-purple-100 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                🔄 Looking For: {profile.skill_wanted || "Any expertise"}
              </span>
            ) : (
              <span className="bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg">
                💵 Rate: ${profile.charge_amount || "0"}/hr
              </span>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Community Feedback</h2>

        {currentUserId && currentUserId !== id && !id.startsWith("mock-") && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leave a review</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Rating:</span>
              <select 
                value={newRating} 
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="bg-white border rounded px-2 py-1 text-xs font-bold text-amber-600 outline-none"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
            <textarea
              placeholder="How was your experience trading or working with this member?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 min-h-[60px]"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              {submittingReview ? "Posting..." : "Submit Review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No reviews left for this profile yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-800">
                    {rev.reviewer?.name || "Anonymous Member"}
                  </span>
                  <span className="text-amber-500 text-[10px]">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </span>
                  <span className="text-[10px] text-slate-300 ml-auto">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CORE ACTION INTERACTION BUTTON */}
      <button 
        onClick={() => {
          if (id.startsWith("mock-")) {
            alert("This is a placeholder account! Redirecting you to your main message room.");
            router.push("/messages");
          } else {
            router.push(`/messages?chat=${id}`);
          }
        }}
        className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow mt-4 text-sm tracking-wide"
      >
        💬 Open Chat Conversation
      </button>

    </div>
  );
}