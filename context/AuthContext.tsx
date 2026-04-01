"use client";

import { createContext, useState } from "react";

type AuthUser = {
  email: string;
};

type StoredUser = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string) => boolean;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "user";
const LEGACY_AUTH_STORAGE_KEY = "auth_user";
const AUTH_USERS_STORAGE_KEY = "auth_users";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const savedUser =
      window.localStorage.getItem(AUTH_STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_AUTH_STORAGE_KEY);

    if (!savedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as AuthUser;
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsedUser));
      window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
      return parsedUser;
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
      return null;
    }
  });

  const getStoredUsers = (): StoredUser[] => {
    const savedUsers = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY);

    if (!savedUsers) {
      return [];
    }

    try {
      return JSON.parse(savedUsers) as StoredUser[];
    } catch {
      window.localStorage.removeItem(AUTH_USERS_STORAGE_KEY);
      return [];
    }
  };

  const setAuthUser = (email: string) => {
    const loggedInUser: AuthUser = { email };
    setUser(loggedInUser);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
  };

  const login = (email: string, password: string) => {
    const isAdminLogin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    const savedUsers = getStoredUsers();
    const isRegisteredUser = savedUsers.some(
      (savedUser) => savedUser.email === email && savedUser.password === password
    );
    const isValidUser = isAdminLogin || isRegisteredUser;

    if (!isValidUser) {
      return false;
    }

    setAuthUser(email);
    return true;
  };

  const signup = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    const savedUsers = getStoredUsers();
    const userExists =
      email === ADMIN_EMAIL ||
      savedUsers.some((savedUser) => savedUser.email === email);

    if (userExists) {
      return false;
    }

    const updatedUsers = [...savedUsers, { email, password }];
    window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setAuthUser(email);
    return true;
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
