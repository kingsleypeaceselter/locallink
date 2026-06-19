// ============================================================
// LocalLink — Constants
// ============================================================

// ----- Brand Colors -----
export const COLORS = {
  primary: "#2D6A4F",       // Forest Green
  accent: "#FFB703",         // Soft Amber
  background: "#F8F9FA",     // Warm White
  text: "#1A1A2E",
  textLight: "#6B7280",
  white: "#FFFFFF",
  error: "#DC2626",
  success: "#16A34A",
  border: "#E5E7EB",
} as const;

// ----- Skill Categories -----
export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: "cat_music", name: "Music", icon: "🎵", description: "Guitar, piano, singing, production" },
  { id: "cat_languages", name: "Languages", icon: "🌐", description: "Tutoring, conversation practice, translation" },
  { id: "cat_coding", name: "Coding & Tech", icon: "💻", description: "Web dev, programming, troubleshooting" },
  { id: "cat_cooking", name: "Cooking & Baking", icon: "🍳", description: "Meal prep, baking, cuisine lessons" },
  { id: "cat_fitness", name: "Fitness & Yoga", icon: "💪", description: "Personal training, yoga, stretching" },
  { id: "cat_art", name: "Art & Design", icon: "🎨", description: "Drawing, painting, graphic design" },
  { id: "cat_gardening", name: "Gardening", icon: "🌱", description: "Plant care, landscaping, permaculture" },
  { id: "cat_repair", name: "Home Repair", icon: "🔧", description: "Plumbing, electrical, carpentry" },
  { id: "cat_tutoring", name: "Tutoring", icon: "📚", description: "Math, science, test prep, homework help" },
  { id: "cat_photography", name: "Photography", icon: "📷", description: "Portrait, event, editing tutorials" },
  { id: "cat_pets", name: "Pet Care", icon: "🐾", description: "Dog walking, pet sitting, grooming" },
  { id: "cat_writing", name: "Writing & Editing", icon: "✍️", description: "Proofreading, content writing, storytelling" },
  { id: "cat_crafts", name: "Crafts & DIY", icon: "🧶", description: "Knitting, woodworking, handmade goods" },
  { id: "cat_other", name: "Other", icon: "🤝", description: "Something else? Add it here!" }, 

];

// ----- Swap Status Labels -----
export const SWAP_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  countered: "Counter Offer",
  completed: "Completed",
  cancelled: "Cancelled",
};

// ----- Swap Status Colors (for badges) -----
export const SWAP_STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",    // Amber
  accepted: "#16A34A",   // Green
  declined: "#DC2626",   // Red
  countered: "#8B5CF6",  // Purple
  completed: "#2D6A4F",  // Forest Green
  cancelled: "#6B7280",  // Gray
};

// ----- App Info -----
export const APP_NAME = "LocalLink";
export const APP_TAGLINE = "Trade skills. Build community. No money needed.";
export const APP_DESCRIPTION = "A hyperlocal skill-swapping platform. Offer what you know, learn what you don't.";

// ----- Pagination -----
export const PAGE_SIZE = 20;
export const NEARBY_RADIUS_KM = 10;

// ----- Rating -----
export const MIN_RATING = 1;
export const MAX_RATING = 5;
// src/lib/utils/constants.ts
