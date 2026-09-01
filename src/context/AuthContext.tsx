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
        if (!authorized) {
          document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        }
      } else {
        setIsAdmin(false);
        document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Protected route enforcement
  useEffect(() => {
    if (!loading) {
      const isAdminRoute = pathname?.startsWith("/admin") && pathname !== "/admin/login";
      const hasAdminCookie = typeof document !== "undefined" && document.cookie.includes("admin_session=true");

      if (isAdminRoute && (!user || !isAdmin || !hasAdminCookie)) {
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
