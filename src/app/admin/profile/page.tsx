"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getProfileFromFirestore, updateProfileInFirestore } from "@/lib/firebase/profile";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ResumeUploader } from "@/components/admin/ResumeUploader";
import { useToast } from "@/components/ui/Toast";
import { Save, Loader2 } from "lucide-react";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    tagline: "",
    bio: "",
    email: "",
    availabilityStatus: "",
    githubUrl: "",
    linkedinUrl: "",
    profilePhotoUrl: "",
    resumeUrl: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfileFromFirestore();
        if (data) {
          setFormData({
            name: data.name || "",
            title: data.title || "",
            tagline: data.tagline || "",
            bio: data.bio || "",
            email: data.email || "",
            availabilityStatus: data.availabilityStatus || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            profilePhotoUrl: data.profilePhotoUrl || "",
            resumeUrl: data.resumeUrl || "",
          });
        }
      } catch {
        showToast("Failed to load profile settings", "error");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfileInFirestore({
        ...formData,
        resumePath: formData.resumeUrl,
      });
      showToast("Profile settings saved successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-16 text-center text-xs font-mono text-zinc-500">
          Loading profile settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            Settings
          </span>
          <h1 className="text-3xl font-extrabold text-white">Profile & Portfolio Identity</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-zinc-800 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Professional Headline *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Primary Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Availability Status Badge</label>
              <input
                type="text"
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Bio & Narrative *</label>
            <textarea
              required
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono resize-none focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Image & Resume Uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
            <ImageUploader
              value={formData.profilePhotoUrl}
              onChange={(url) => setFormData({ ...formData, profilePhotoUrl: url })}
              folder="images"
              label="Profile Avatar Image (JPG, PNG, WebP)"
            />

            <ResumeUploader
              value={formData.resumeUrl}
              onChange={(url) => setFormData({ ...formData, resumeUrl: url })}
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving Profile..." : "Save Profile Settings"}</span>
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
