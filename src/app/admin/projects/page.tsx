"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getProjectsFromFirestore, deleteProjectFromFirestore } from "@/lib/firebase/projects";
import { Project } from "@/data/projects";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjectsFromFirestore();
      setProjects(data);
    } catch (e) {
      showToast("Error loading projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProjectFromFirestore(deleteTarget.id);
      showToast(`Project "${deleteTarget.title}" deleted successfully`, "success");
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: any) {
      showToast(e.message || "Failed to delete project", "error");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Management
            </span>
            <h1 className="text-3xl font-extrabold text-white">Project Showcase</h1>
          </div>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600 w-full sm:w-auto"
          >
            <option value="All">All Categories</option>
            <option value="AI / ML">AI / ML</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Hardware / IoT">Hardware / IoT</option>
          </select>
        </div>

        {/* Projects Table / Grid */}
        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            Loading projects list...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            No projects found matching your search.
          </div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden border border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Project Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Technologies</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {filtered.map((project) => (
                    <tr key={project.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          {project.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          <span>{project.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{project.category}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px]">
                          {project.statusBadge}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {project.technologies.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="p-2 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setDeleteTarget(project)}
                            className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-900/50 hover:text-rose-400 border border-zinc-800 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Confirm Delete Project"
          message={`Are you sure you want to delete "${deleteTarget?.title}"? This action will remove it from your public portfolio.`}
          isDeleting={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </AdminLayout>
  );
}
