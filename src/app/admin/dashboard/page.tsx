"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getProjectsFromFirestore } from "@/lib/firebase/projects";
import { getSkillsFromFirestore } from "@/lib/firebase/skills";
import { getCertificationsFromFirestore } from "@/lib/firebase/certifications";
import { getAchievementsFromFirestore } from "@/lib/firebase/achievements";
import { getMessagesFromFirestore, ContactMessage } from "@/lib/firebase/messages";
import { Project } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import {
  FolderGit2,
  Wrench,
  Award,
  Trophy,
  Mail,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [achieveCount, setAchieveCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projs, skills, certs, achieves, msgs] = await Promise.all([
          getProjectsFromFirestore(),
          getSkillsFromFirestore(),
          getCertificationsFromFirestore(),
          getAchievementsFromFirestore(),
          getMessagesFromFirestore(),
        ]);

        setProjectsCount(projs.length);
        setRecentProjects(projs.slice(0, 3));

        const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);
        setSkillsCount(totalSkills);

        setCertsCount(certs.length);
        setAchieveCount(achieves.length);

        setRecentMessages(msgs.slice(0, 3));
        const unread = msgs.filter((m) => m.status === "unread").length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Welcome Profile Card */}
        <div className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-linear-to-r from-zinc-950 via-zinc-900 to-zinc-950">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl shrink-0">
              <Image
                src="/profile.jpg?v=2"
                alt="Bharath Yuvraj Profile Image"
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Welcome back, Bharath Yuvraj</h2>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                AI & Machine Learning Student | Full Stack Developer
              </p>
            </div>
          </div>
          <Link
            href="/admin/profile"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-white hover:text-black text-white text-xs font-mono font-semibold transition-all border border-zinc-700 shadow-sm flex items-center gap-2"
          >
            <span>Edit Profile Identity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Overview
            </span>
            <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold shadow-md hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
          </div>
        </div>

        {/* Summary Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-1">Projects</span>
              <span className="text-2xl font-bold text-white">{loading ? "..." : projectsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-1">Competencies</span>
              <span className="text-2xl font-bold text-white">{loading ? "..." : skillsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-1">Certifications</span>
              <span className="text-2xl font-bold text-white">{loading ? "..." : certsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-1">Achievements</span>
              <span className="text-2xl font-bold text-white">{loading ? "..." : achieveCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-1">Unread Inbox</span>
              <span className="text-2xl font-bold text-rose-400">{loading ? "..." : unreadCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 text-white border border-zinc-800">
              <Mail className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Two Column Layout: Recent Projects & Recent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Projects Card */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-zinc-400" />
                <span>Recent Projects</span>
              </h3>
              <Link href="/admin/projects" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
                <span>Manage All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">Loading projects...</div>
            ) : recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">No projects added yet.</div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[11px] font-mono text-zinc-400">{p.category} • {p.statusBadge}</p>
                    </div>
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-white hover:text-black text-xs font-mono transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inbox Messages Card */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>Recent Contact Messages</span>
              </h3>
              <Link href="/admin/messages" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1">
                <span>View Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">Loading messages...</div>
            ) : recentMessages.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">No messages received yet.</div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex-1 mr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{m.name}</span>
                        {m.status === "unread" && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">Unread</span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 truncate">{m.message}</p>
                    </div>
                    <Link
                      href="/admin/messages"
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-white hover:text-black text-xs font-mono transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
