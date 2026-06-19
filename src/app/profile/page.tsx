"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase/client";
import AvatarUpload from "@/components/AvatarUpload";

export default function ProfilePage() {
  const router = useRouter(); 
  
  const [activeUser, setActiveUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Core Identity States
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState(""); 
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Skills & Framework States
  const [skillClassification, setSkillClassification] = useState("Digital Platform / Tech Services");
  const [skillOffered, setSkillOffered] = useState(""); 
  const [exchangeType, setExchangeType] = useState("paid"); 
  const [chargeAmount, setChargeAmount] = useState("0"); 
  const [skillWanted, setSkillWanted] = useState("");

  useEffect(() => {
    const initProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setActiveUser(user);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile && !error) {
          setName(profile.name || "");
          setPhoneNumber(profile.phone_number || "");
          setLocation(profile.location || "");
          setBio(profile.bio || "");
          setAvatarUrl(profile.avatar_url || "");
          setSkillClassification(profile.skill_classification || "Digital Platform / Tech Services");
          setSkillOffered(profile.skill_offered || "");
          setExchangeType(profile.exchange_type || "paid");
          setChargeAmount(String(profile.charge_amount || "0"));
          setSkillWanted(profile.skill_wanted || "");
        }
      }
      setLoading(false);
    };

    initProfile();
  }, []);

  // Singular save execution callback function
  const handleSaveProfile = async () => {
    try {
      if (!activeUser?.id) {
        alert("No active user session found!");
        return;
      }

      const profileUpdates = {
        id: activeUser.id,
        name: name.trim(),
        full_name: name.trim(),
        email: activeUser.email,
        phone_number: phoneNumber.trim(),
        location: location.trim(), 
        bio: bio.trim(),
        avatar_url: avatarUrl, // Preserves the URL set by our AvatarUpload component
        skill_classification: skillClassification,
        skill_offered: skillOffered.trim(),
        exchange_type: exchangeType,
        charge_amount: parseFloat(chargeAmount) || 0,
        skill_wanted: exchangeType === "swap" ? skillWanted.trim() : "",
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profileUpdates);

      if (error) throw error;

      alert("Profile changes saved successfully!");
      router.push("/feed"); 

    } catch (error: any) {
      console.error("❌ Save failed:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <p className="p-8 text-center text-gray-500">Loading profile data...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 text-black bg-white rounded-lg shadow mb-20">
      
      {/* Header Option */}
      <div className="flex justify-between items-center border-b pb-2">
        <h1 className="text-2xl font-bold text-gray-800">Marketplace Identity</h1>
        <button 
          onClick={() => router.push("/feed")} 
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-3 py-1.5 rounded-lg transition"
        >
          ← Back to Feed
        </button>
      </div>
      
      {/* --- REUSABLE AVATAR UPLOAD COMPONENT --- */}
      {activeUser?.id && (
        <AvatarUpload 
          userId={activeUser.id} 
          currentAvatarUrl={avatarUrl} 
          onUploadSuccess={(newUrl) => setAvatarUrl(newUrl)} 
        />
      )}

      {/* --- IDENTITY SECTION --- */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border p-2 w-full rounded border-gray-300 bg-white text-black"
            placeholder="e.g. king k"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Geographic Location</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="border p-2 w-full rounded border-gray-300 bg-white text-black"
            placeholder="e.g. Cairo"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone Number</label>
          <input 
            type="text" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            className="border p-2 w-full rounded border-gray-300 bg-white text-black"
            placeholder="+201..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Short Bio / Overview</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className="border p-2 w-full rounded border-gray-300 h-20 bg-white text-black"
            placeholder="Tell us about your services..."
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* --- SKILLS SECTION --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-800">Skill Details & Framework</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Skill Classification</label>
          <select 
            value={skillClassification}
            onChange={(e) => setSkillClassification(e.target.value)}
            className="border p-2 w-full rounded border-gray-300 bg-white text-black"
          >
            <option>Digital Platform / Tech Services</option>
            <option>Manual Trades / Crafting</option>
            <option>Education / Consulting</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Core Skill Rendered</label>
          <input 
            type="text" 
            value={skillOffered} 
            onChange={(e) => setSkillOffered(e.target.value)} 
            className="border p-2 w-full rounded border-gray-300 bg-white text-black"
            placeholder="e.g. basic web development"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Deal Framework Structure</label>
          <div className="flex gap-4 mt-1">
            <button
              type="button"
              onClick={() => setExchangeType("swap")}
              className={`flex-1 p-2 rounded border font-medium transition ${exchangeType === "swap" ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-gray-50 border-gray-300 text-gray-600"}`}
            >
              🔄 Skill Swap Trade
            </button>
            <button
              type="button"
              onClick={() => setExchangeType("paid")}
              className={`flex-1 p-2 rounded border font-medium transition ${exchangeType === "paid" ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-300 text-gray-600"}`}
            >
              💵 Direct Hourly Payment
            </button>
          </div>
        </div>

        {exchangeType === "paid" ? (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hourly Rate Target ($ USD / Hour)</label>
            <input 
              type="number" 
              value={chargeAmount} 
              onChange={(e) => setChargeAmount(e.target.value)} 
              className="border p-2 w-full rounded border-gray-300 bg-white text-black"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Skill Wanted In Return</label>
            <input 
              type="text" 
              value={skillWanted} 
              onChange={(e) => setSkillWanted(e.target.value)} 
              className="border p-2 w-full rounded border-gray-300 bg-white text-black"
              placeholder="e.g. Graphic Design"
            />
          </div>
        )}
      </div>

      <button 
        onClick={handleSaveProfile}
        className="w-full bg-blue-800 text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition mt-6 shadow"
      >
        Save Profile Changes →
      </button>

    </div>
  );
}