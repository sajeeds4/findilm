import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ApiAuthUser, UserProfile } from './types';
import { getStoredToken, loginWithPassword, logoutRequest, registerWithPassword, setStoredToken, fetchMe } from './services/api';

interface AuthContextType {
  user: ApiAuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

function profileToUser(profile: UserProfile | null): ApiAuthUser | null {
  if (!profile) return null;
  return {
    id: profile.uid,
    email: profile.email,
    displayName: profile.displayName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<ApiAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const me = await fetchMe();
    setProfile(me);
    setUser(profileToUser(me));
  };

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    refreshProfile()
      .catch(() => {
        setStoredToken(null);
        setProfile(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginWithPassword(email, password);
    setStoredToken(response.token);
    await refreshProfile();
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const response = await registerWithPassword(email, password, displayName);
    setStoredToken(response.token);
    await refreshProfile();
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setStoredToken(null);
      setProfile(null);
      setUser(null);
    }
  };

  const isAdmin = profile?.role === 'admin' || Boolean(profile?.isStaff);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
