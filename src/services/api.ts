import {
  ApiAuthResponse,
  CommunityCategory,
  CommunityPost,
  CommunityReply,
  Course,
  DuaRequest,
  FollowUserSummary,
  KnowledgeCategory,
  KnowledgeResource,
  NotificationItem,
  PodcastEpisode,
  Reflection,
  SharedContent,
  UserProfile,
} from '../types';

const API_TOKEN_KEY = 'findilm_api_token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, options: { method?: HttpMethod; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getStoredToken();
  if (options.auth !== false && token) {
    headers.Authorization = `Token ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    method: options.method || 'GET',
    headers,
    body: options.body ? (isFormData ? (options.body as FormData) : JSON.stringify(options.body)) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.detail || data?.non_field_errors?.[0] || 'Request failed.';
    throw new Error(message);
  }

  return data as T;
}

export function getStoredToken() {
  return localStorage.getItem(API_TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (!token) {
    localStorage.removeItem(API_TOKEN_KEY);
    return;
  }
  localStorage.setItem(API_TOKEN_KEY, token);
}

export function loginWithPassword(email: string, password: string) {
  return request<ApiAuthResponse>('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });
}

export function registerWithPassword(email: string, password: string, displayName?: string) {
  return request<ApiAuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { email, password, displayName },
    auth: false,
  });
}

export function logoutRequest() {
  return request<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
}

export function fetchMe() {
  return request<UserProfile>('/api/auth/me');
}

export function fetchFollowGraph() {
  return request<{
    following: FollowUserSummary[];
    followers: FollowUserSummary[];
    counts: { following: number; followers: number };
  }>('/api/social/follows');
}

export function toggleFollowUser(userId: number | string) {
  return request<{ success: boolean; active: boolean; followersCount: number }>(`/api/social/users/${userId}/follow`, {
    method: 'POST',
  });
}

export function fetchDashboardSummary() {
  return request<{
    profile: UserProfile;
    stats: {
      reflections: number;
      publicReflections: number;
      duaRequests: number;
      courseEnrollments: number;
      averageProgress: number;
    };
    recentReflections: Reflection[];
    enrollments: Array<{ course: string; progressPercent: number; completedLessons: number }>;
  }>('/api/dashboard/summary');
}

export function fetchReflections() {
  return request<Reflection[]>('/api/reflections');
}

export function createReflection(payload: { content: string; isPublic: boolean }) {
  return request<Reflection>('/api/reflections', { method: 'POST', body: payload });
}

export function fetchDuas() {
  return request<DuaRequest[]>('/api/duas', { auth: false });
}

export function createDua(payload: { content: string; isAnonymous: boolean }) {
  return request<DuaRequest>('/api/duas', { method: 'POST', body: payload });
}

export function toggleDuaAmeen(id: string | number) {
  return request<{ success: boolean; ameenCount: number; active: boolean }>(`/api/duas/${id}/ameen`, { method: 'POST' });
}

export function fetchCommunityCategories() {
  return request<CommunityCategory[]>('/api/community/categories', { auth: false });
}

export function fetchCommunityPosts(params?: { category?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  const suffix = query.toString() ? `?${query}` : '';
  return request<CommunityPost[]>(`/api/community/posts${suffix}`, { auth: false });
}

export function createCommunityPost(payload: { title: string; content: string; categorySlug: string }) {
  return request<CommunityPost>('/api/community/posts', { method: 'POST', body: payload });
}

export function uploadCommunityAttachment(postId: number | string, file: File, caption?: string) {
  const body = new FormData();
  body.append('file', file);
  if (caption?.trim()) {
    body.append('caption', caption.trim());
  }
  return request<{ id: number; caption: string; fileUrl: string; created_at: string }>(`/api/community/posts/${postId}/attachments`, {
    method: 'POST',
    body,
  });
}

export function createCommunityReply(
  postId: number | string,
  payload: { content: string; parentId?: number | null; isAnonymous?: boolean }
) {
  return request<CommunityReply>(`/api/community/posts/${postId}/replies`, {
    method: 'POST',
    body: payload,
  });
}

export function toggleCommunityLike(id: number | string) {
  return request<{ success: boolean; active: boolean }>(`/api/community/posts/${id}/like`, { method: 'POST' });
}

export function toggleCommunityBookmark(id: number | string) {
  return request<{ success: boolean; active: boolean }>(`/api/community/posts/${id}/bookmark`, { method: 'POST' });
}

export function fetchCourses(category?: string) {
  const suffix = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  return request<Course[]>(`/api/courses${suffix}`, { auth: false });
}

export function fetchFeaturedCourses() {
  return request<Course[]>('/api/courses/featured', { auth: false });
}

export function enrollInCourse(slug: string) {
  return request<{ success: boolean; created: boolean; course: Course }>(`/api/courses/${slug}/enroll`, { method: 'POST' });
}

export function fetchKnowledgeCategories() {
  return request<KnowledgeCategory[]>('/api/resources/categories', { auth: false });
}

export function fetchKnowledgeResources(type?: string) {
  const suffix = type && type !== 'All' ? `?type=${encodeURIComponent(type.toLowerCase())}` : '';
  return request<KnowledgeResource[]>(`/api/resources${suffix}`, { auth: false });
}

export function fetchSharedContent() {
  return request<SharedContent[]>('/api/shared-content', { auth: false });
}

export function fetchMySharedContent() {
  return request<SharedContent[]>('/api/shared-content/mine');
}

export function createSharedContent(payload: {
  title: string;
  description?: string;
  contentType: 'article' | 'pdf' | 'audio' | 'document' | 'link';
  category?: string;
  externalUrl?: string;
  isPublic?: boolean;
  file?: File | null;
}) {
  const body = new FormData();
  body.append('title', payload.title);
  body.append('description', payload.description || '');
  body.append('content_type', payload.contentType);
  body.append('category', payload.category || '');
  body.append('external_url', payload.externalUrl || '');
  body.append('is_public', String(payload.isPublic ?? true));
  if (payload.file) {
    body.append('file', payload.file);
  }
  return request<SharedContent>('/api/shared-content', { method: 'POST', body });
}

export function fetchEpisodes() {
  return request<PodcastEpisode[]>('/api/audio/episodes', { auth: false });
}

export function fetchNotifications() {
  return request<NotificationItem[]>('/api/notifications');
}

export function markNotificationRead(id: number | string) {
  return request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'POST' });
}

export function fetchPrayerTimes(latitude: number, longitude: number) {
  return request<{
    date: string;
    location: { latitude: number; longitude: number };
    timings: Record<string, string>;
    source: string;
  }>(`/api/prayer/today?latitude=${latitude}&longitude=${longitude}`, { auth: false });
}

export function fetchAdminOverview() {
  return request<{
    stats: Record<string, number>;
    recentUsers: any[];
    recentReflections: any[];
    recentDuas: any[];
  }>('/api/admin/overview');
}

export function fetchAdminCollection<T>(path: string) {
  return request<T[]>(path);
}

export function createAdminItem<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'POST', body });
}

export function updateAdminItem<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'PATCH', body });
}

export function deleteAdminItem(path: string) {
  return request<void>(path, { method: 'DELETE' });
}
