"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        router.push("/feed");
        return;
      }
      setLoading(false);
    };

    checkProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication session not found");

      // Uses .upsert() to automatically create a row if it doesn't exist
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id, 
          email: user.email, // Supplies the email to satisfy NOT NULL constraints
          full_name: fullName.trim(),
          location_name: locationName.trim() || null,
          bio: bio.trim() || null,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      router.push("/feed");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save profile setup";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted font-medium">Loading your profile setup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-white border border-light-gray rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-dark mb-1">Welcome to SkillSwap!</h1>
          <p className="text-sm text-muted">Let&apos;s build your trading profile before you browse</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 border border-light-gray rounded-xl text-sm focus:outline-none focus:border-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Location / Neighborhood
            </label>
            <input
              type="text"
              placeholder="e.g. Downtown, Heliopolis"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full p-2.5 border border-light-gray rounded-xl text-sm focus:outline-none focus:border-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Brief Bio
            </label>
            <textarea
              rows={3}
              placeholder="Tell others what you love to do or teach..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 border border-light-gray rounded-xl text-sm resize-none focus:outline-none focus:border-dark"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-dark text-white rounded-xl text-sm py-2.5 mt-2 font-medium transition-all hover:bg-dark/90 disabled:opacity-50"
          >
            {submitting ? "Saving Profile..." : "Complete Setup →"}
          </button>
        </form>
      </div>
    </div>
  );
}