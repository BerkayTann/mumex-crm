"use client";

import React, { createContext, startTransition, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IAuthSessionUser } from "../types/AuthTypes";

interface AuthContextValue {
  user: IAuthSessionUser | null;
  setUser: React.Dispatch<React.SetStateAction<IAuthSessionUser | null>>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({
  initialUser,
  children,
}: {
  initialUser: IAuthSessionUser | null;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<IAuthSessionUser | null>(initialUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const refreshUser = async () => {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      setUser(null);
      return;
    }

    const data = await response.json();
    setUser(data.veri ?? null);
  };

  const logout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      startTransition(() => {
        router.replace("/login");
        router.refresh();
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
