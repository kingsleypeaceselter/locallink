// src/lib/types.ts

export interface User {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  location_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  updated_at?: string;
}

export interface Skill {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description?: string | null;
  skill_type: "offer" | "want";
  created_at: string;
}