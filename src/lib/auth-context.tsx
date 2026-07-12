"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getProfile, UserProfile } from "@/lib/api";

const TOKEN_KEY = "cycleai_access_token";

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    const profileFetch = stored ? getProfile(stored) : Promise.resolve(null);
    profileFetch
      .then((profile) => {
        if (stored) setTokenState(stored);
        setUser(profile);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  function setToken(next: string) {
    localStorage.setItem(TOKEN_KEY, next);
    setTokenState(next);
    getProfile(next).then(setUser).catch(() => undefined);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
