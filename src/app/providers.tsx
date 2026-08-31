"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
    >
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
