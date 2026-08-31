"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Lock, Database, HardDrive, Key, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, isAdmin } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            System
          </span>
          <h1 className="text-3xl font-extrabold text-white">Admin Security & Environment</h1>
        </div>

        {/* Security Overview Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="p-3 rounded-2xl bg-zinc-900 text-emerald-400 border border-zinc-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Administrator Account</h3>
              <p className="text-xs font-mono text-zinc-400">Authenticated via Firebase Security Rules & Auth</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block">Authenticated User UID</span>
              <span className="text-white font-bold block truncate">{user?.uid || "Not logged in"}</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block">Admin Email</span>
              <span className="text-white font-bold block truncate">{user?.email || "N/A"}</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block">Authorization Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authorized Administrator ({isAdmin ? "Verified" : "Pending"})</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 block">Environment Mode</span>
              <span className="text-white font-bold">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

        {/* Firebase Services Infrastructure */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-zinc-400" />
            <span>Firebase Connected Services</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="font-bold text-white block">Firebase Authentication</span>
                  <span className="text-zinc-500 text-[10px]">Secure Email/Password auth module active</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="font-bold text-white block">Cloud Firestore Database</span>
                  <span className="text-zinc-500 text-[10px]">Projects, Skills, Certs, Achievements, Education, Messages</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3">
                <HardDrive className="w-4 h-4 text-zinc-400" />
                <div>
                  <span className="font-bold text-white block">Firebase Storage</span>
                  <span className="text-zinc-500 text-[10px]">Profile photos, project screenshots & PDF resumes</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                Active
              </span>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
