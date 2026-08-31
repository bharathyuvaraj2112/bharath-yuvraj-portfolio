"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { createProjectInFirestore } from "@/lib/firebase/projects";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    category: "AI / ML" as const,
    status: "Completed" as const,
    statusBadge: "Application Live",
    isConceptOrPlaceholder: false,
    technologies: "Next.js, React, TypeScript",
    githubUrl: "",
    liveUrl: "",
    featured: true,
    imageVisualType: "portfolio" as const,
    overview: "",
    problem: "",
    solution: "",
    keyFeatures: "Feature 1, Feature 2, Feature 3",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setSaving(true);
    try {
      const techArray = formData.technologies.split(",").map((t) => t.trim()).filter(Boolean);
      const featuresArray = formData.keyFeatures.split(",").map((f) => f.trim()).filter(Boolean);

      await createProjectInFirestore({
        ...formData,
        technologies: techArray,
        keyFeatures: featuresArray,
      });

      showToast("Project created successfully!", "success");
      router.push("/admin/projects");
    } catch (err: any) {
      showToast(err.message || "Failed to create project", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/projects" className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Create New Project</h1>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI Resume Analyzer"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                Tagline / Short Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. ATS Score Evaluator & Career Feedback Tool"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
              Summary Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary displayed on project cards..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600"
              >
                <option value="AI / ML">AI / ML</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Hardware / IoT">Hardware / IoT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Development Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-600"
              >
                <option value="Completed">Completed</option>
                <option value="Prototype">Prototype</option>
                <option value="Concept">Concept</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Status Badge Label</label>
              <input
                type="text"
                value={formData.statusBadge}
                onChange={(e) => setFormData({ ...formData, statusBadge: e.target.value })}
                placeholder="e.g. Frontend Live"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
              Technologies Stack (Comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="Next.js, TypeScript, Tailwind CSS, Firebase"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Detailed Overview</label>
            <textarea
              rows={4}
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              placeholder="Comprehensive project overview displayed inside details modal..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">The Problem</label>
              <textarea
                rows={3}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="Description of problem statement..."
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">The Solution</label>
              <textarea
                rows={3}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Description of implemented solution..."
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
              Key Features List (Comma separated)
            </label>
            <input
              type="text"
              value={formData.keyFeatures}
              onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
              placeholder="Real-time analysis, PDF export, ATS scoring"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">GitHub Repository URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Live Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://my-demo-app.com"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
              />
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-white focus:ring-0"
            />
            <label htmlFor="featured" className="text-xs font-mono font-semibold text-zinc-300 cursor-pointer">
              Mark as Featured Project on Homepage
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800">
            <Link
              href="/admin/projects"
              className="px-5 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Creating..." : "Save Project"}</span>
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
