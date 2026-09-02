"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeUnreadCount } from "@/lib/firebase/messages";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  Award,
  Trophy,
  GraduationCap,
  Mail,
  User as UserIcon,
  Settings,
  Sparkles,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Achievements", href: "/admin/achievements", icon: Trophy },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Messages", href: "/admin/messages", icon: Mail, hasBadge: true },
  { label: "AI Studio", href: "/admin/ai", icon: Sparkles },
  { label: "Profile", href: "/admin/profile", icon: UserIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeUnreadCount((count) => {
      setUnreadCount(count);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [user, isAdmin, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col lg:flex-row antialiased selection:bg-white selection:text-black">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-zinc-800 bg-zinc-950 flex-col justify-between p-5 shrink-0 h-screen sticky top-0">
        <div>
          {/* Admin Header Brand */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-zinc-700 shadow-md shrink-0 group-hover:border-zinc-500 transition-colors">
                <Image
                  src="/profile.jpg"
                  alt="Admin Profile Avatar"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Portfolio Admin</span>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Secure Console</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.hasBadge && unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <span>Public Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950/50 hover:text-rose-400 text-zinc-300 text-xs font-mono border border-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-700 shrink-0">
            <Image
              src="/profile.jpg"
              alt="Admin Profile"
              fill
              className="object-cover object-center"
            />
          </div>
          <span className="font-bold text-xs text-white">Admin Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Link href="/admin/messages" className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              {unreadCount} new
            </Link>
          )}

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl bg-zinc-900 text-white border border-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-zinc-950 border-b border-zinc-800 p-4 space-y-2 sticky top-14.25 z-30 shadow-2xl"
          >
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-mono ${
                    isActive
                      ? "bg-white text-black font-bold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.hasBadge && unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-zinc-800 flex gap-2">
              <Link
                href="/"
                target="_blank"
                className="flex-1 py-2 text-center rounded-xl bg-zinc-900 text-xs font-mono text-zinc-300"
              >
                View Website
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-950 text-rose-300 text-xs font-mono"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
