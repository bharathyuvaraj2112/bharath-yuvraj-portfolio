"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuth, isUserAdmin, loginAdmin, logoutAdmin } from "@/lib/firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: typeof loginAdmin;
  logout: typeof logoutAdmin;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  login: loginAdmin,
  logout: logoutAdmin,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const authorized = await isUserAdmin(currentUser);
        setIsAdmin(authorized);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Protected route enforcement
  useEffect(() => {
    if (!loading) {
      const isAdminRoute = pathname?.startsWith("/admin") && pathname !== "/admin/login";
      if (isAdminRoute && (!user || !isAdmin)) {
        router.push("/admin/login");
      }
    }
  }, [user, isAdmin, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login: loginAdmin, logout: logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
