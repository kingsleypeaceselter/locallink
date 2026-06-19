"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import NavBar from "@/components/NavBar";

type SwapRequest = {
  id: string;
  created_at: string;
  status: "pending" | "accepted" | "rejected";
  message: string | null;
  requester_id: string;
  receiver_id: string;
  requester_skill: { title: string };
  receiver_skill: { title: string };
  profiles_requester: { full_name: string };
  profiles_receiver: { full_name: string };
};

export default function SwapsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Define fetchSwaps at the top of the component so it is safely accessible inside useEffect
  const fetchSwaps = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("swap_requests")
      .select(`
        id,
        created_at,
        status,
        message,
        requester_id,
        receiver_id,
        requester_skill:skills!swap_requests_requester_skill_id_fkey ( title ),
        receiver_skill:skills!swap_requests_receiver_skill_id_fkey ( title ),
        profiles_requester:profiles!swap_requests_requester_id_fkey ( full_name ),
        profiles_receiver:profiles!swap_requests_receiver_id_fkey ( full_name )
      `)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data as unknown as SwapRequest[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setCurrentUserId(user.id);
      fetchSwaps(user.id);
    };
    checkAuth();
  }, [router]);

  const handleUpdateStatus = async (requestId: string, newStatus: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("swap_requests")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (!error && currentUserId) {
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
      );
    }
  };

  const incomingRequests = requests.filter((r) => r.receiver_id === currentUserId);
  const outgoingRequests = requests.filter((r) => r.requester_id === currentUserId);
  const visibleRequests = activeTab === "incoming" ? incomingRequests : outgoingRequests;

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-white border-b sticky top-0 z-40 border-light-gray">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-semibold text-lg text-dark">Skill Swaps</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-24 pt-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-4 bg-white p-1 rounded-xl border border-light-gray">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "incoming" ? "bg-dark text-white" : "text-muted hover:text-dark"
            }`}
          >
            Received ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("outgoing")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "outgoing" ? "bg-dark text-white" : "text-muted hover:text-dark"
            }`}
          >
            Sent ({outgoingRequests.length})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center pt-12 gap-2">
            <div className="spinner" />
            <p className="text-xs text-muted">Updating trade logs...</p>
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="text-center bg-white border border-light-gray rounded-2xl p-8">
            <p className="text-sm font-medium text-dark">No proposals found here</p>
            <p className="text-xs text-muted mt-0.5">
              {activeTab === "incoming"
                ? "Offers sent to you will appear on this dashboard."
                : "Explore the timeline and propose an exchange to see it here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleRequests.map((req) => (
              <div key={req.id} className="card bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-light-gray/60 pb-2">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">
                    {activeTab === "incoming"
                      ? `From: ${req.profiles_requester?.full_name}`
                      : `To: ${req.profiles_receiver?.full_name}`}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-muted text-xs">Proposed Exchange:</p>
                  <p className="font-medium text-dark">
                    Offering: <span className="text-forest">{req.requester_skill?.title || "Deleted Skill"}</span>
                  </p>
                  <p className="font-medium text-dark">
                    Requesting: <span className="text-amber-700">{req.receiver_skill?.title || "Deleted Skill"}</span>
                  </p>
                </div>

                {req.message && (
                  <div className="bg-warm-white p-2.5 rounded-lg border border-light-gray/40 text-xs text-muted italic">
                    &ldquo;{req.message}&rdquo;
                  </div>
                )}

                {activeTab === "incoming" && req.status === "pending" && (
                  <div className="flex gap-2 pt-1 border-t border-light-gray/60">
                    <button
                      onClick={() => handleUpdateStatus(req.id, "rejected")}
                      className="flex-1 py-1.5 border border-light-gray rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, "accepted")}
                      className="flex-1 py-1.5 bg-forest text-white rounded-lg text-xs font-medium hover:bg-forest/90 transition-colors"
                    >
                      Accept Swap
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <NavBar />
    </div>
  );
}