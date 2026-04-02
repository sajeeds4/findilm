export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  bio?: string;
  role: 'admin' | 'user' | 'moderator' | 'member';
  createdAt: string;
  isStaff?: boolean;
  followersCount?: number;
  followingCount?: number;
  isFollowedByMe?: boolean;
}

export interface ApiAuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
}

export interface ApiAuthResponse {
  success: boolean;
  user: ApiAuthUser;
  token: string;
}

export interface Reflection {
  id: string;
  uid: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

export interface DuaRequest {
  id: string;
  uid?: string;
  content: string;
  isAnonymous: boolean;
  ameenCount: number;
  createdAt: string;
  displayName?: string;
}

export interface CommunityCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  category: CommunityCategory;
  createdAt: string;
  author: string;
  role: string;
  authorId?: number | null;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowingAuthor?: boolean;
  authorFollowersCount?: number;
  attachments: CommunityPostAttachment[];
  replies: CommunityReply[];
  is_anonymous?: boolean;
  is_pinned?: boolean;
}

export interface CommunityPostAttachment {
  id: number;
  caption: string;
  fileUrl: string;
  created_at: string;
}

export interface CommunityReply {
  id: number;
  content: string;
  author: string;
  role: string;
  createdAt: string;
  parentId: number | null;
  is_anonymous?: boolean;
  replies: CommunityReply[];
}

export interface SharedContent {
  id: number;
  title: string;
  description: string;
  content_type: 'article' | 'pdf' | 'audio' | 'document' | 'link';
  category: string;
  external_url: string;
  fileUrl: string;
  is_public: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  uploaderName: string;
}

export interface FollowUserSummary {
  id: number;
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string;
  role: string;
  followedAt?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  kind: 'course' | 'community' | 'dua' | 'follow' | 'system';
  is_read: boolean;
  action_url: string;
  created_at: string;
}

export interface CourseLesson {
  id: number;
  title: string;
  order: number;
  summary: string;
  duration_minutes: number;
  is_preview: boolean;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  image: string;
  lessonsCount: number;
  category: string;
  is_featured?: boolean;
  lessons?: CourseLesson[];
}

export interface KnowledgeCategory {
  id: number;
  name: string;
  slug: string;
  resource_count: number;
  accent_color: string;
  icon: string;
}

export interface KnowledgeResource {
  id: number;
  title: string;
  slug: string;
  description: string;
  resource_type: 'article' | 'video' | 'pdf' | 'audio';
  author: string;
  url: string;
  is_featured: boolean;
  category: KnowledgeCategory;
}

export interface PodcastEpisode {
  id: number;
  title: string;
  slug: string;
  description: string;
  speaker: string;
  duration: string;
  audio_url: string;
  image_url: string;
  is_featured: boolean;
}

export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}
