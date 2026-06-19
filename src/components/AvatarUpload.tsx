"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadSuccess: (newUrl: string) => void;
}

export default function AvatarUpload({ userId, currentAvatarUrl, onUploadSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Please select an image file to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      // Store file cleanly inside user's folder path: userId/avatar-timestamp.ext
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // 1. Upload file binary straight to Supabase 'avatars' storage bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Fetch the newly constructed public URL location string
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Update profile row record in your table database schema
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrl);
      onUploadSuccess(publicUrl);
      alert("Profile picture updated successfully!");
    } catch (error: any) {
      console.error("Upload process failure:", error.message);
      alert(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-slate-50">
      <div className="relative w-24 h-24">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-3xl font-bold">👤</div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-xs text-white font-semibold">
            Uploading...
          </div>
        )}
      </div>
      
      <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition">
        {uploading ? "Processing..." : "Upload New Photo 📷"}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading} 
          className="hidden" 
        />
      </label>
    </div>
  );
}