export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  createdAt: any;
}

export interface Reflection {
  id: string;
  uid: string;
  content: string;
  isPublic: boolean;
  createdAt: any;
}

export interface DuaRequest {
  id: string;
  uid?: string;
  content: string;
  isAnonymous: boolean;
  ameenCount: number;
  createdAt: any;
}

export interface PrayerTimesData {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}
