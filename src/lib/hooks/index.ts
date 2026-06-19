// ============================================================
// LocalLink — Type Definitions
// ============================================================

// ----- Users -----
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  created_at: string;
  updated_at: string;
}

// ----- Categories -----
export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

// ----- Skills -----
export type SkillType = "offer" | "want";

export interface Skill {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  skill_type: SkillType;
  category_id: string;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

export interface SkillWithUser extends Skill {
  user: Pick<User, "id" | "full_name" | "avatar_url" | "latitude" | "longitude">;
}

// ----- Swap Requests -----
export type SwapStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "countered"
  | "completed"
  | "cancelled";

export interface SwapRequest {
  id: string;
  requester_id: string;
  receiver_id: string;
  requester_skill_id: string;
  receiver_skill_id: string;
  message: string | null;
  status: SwapStatus;
  created_at: string;
  updated_at: string;
}

export interface SwapRequestWithDetails extends SwapRequest {
  requester: Pick<User, "id" | "full_name" | "avatar_url">;
  receiver: Pick<User, "id" | "full_name" | "avatar_url">;
  requester_skill: Skill;
  receiver_skill: Skill;
}

// ----- Messages -----
export interface Message {
  id: string;
  swap_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface MessageWithSender extends Message {
  sender: Pick<User, "id" | "full_name" | "avatar_url">;
}

// ----- Reviews -----
export interface Review {
  id: string;
  swap_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: string;
}

// ----- Notifications -----
export type NotificationType =
  | "swap_request"
  | "swap_accepted"
  | "swap_declined"
  | "swap_completed"
  | "new_message"
  | "review_received";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  related_swap_id: string | null;
  is_read: boolean;
  created_at: string;
}

// ----- Saved Locations -----
export interface SavedLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
}

// ----- Form Types (for creating/editing) -----
export interface CreateSkillInput {
  title: string;
  description?: string;
  skill_type: SkillType;
  category_id: string;
}

export interface CreateSwapInput {
  receiver_id: string;
  requester_skill_id: string;
  receiver_skill_id: string;
  message?: string;
}

export interface CreateMessageInput {
  swap_id: string;
  content: string;
}

export interface CreateReviewInput {
  swap_id: string;
  reviewee_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  phone?: string;
}