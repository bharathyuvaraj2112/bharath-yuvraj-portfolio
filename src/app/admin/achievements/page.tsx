"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAchievementsFromFirestore, createAchievementInFirestore, deleteAchievementFromFirestore } from "@/lib/firebase/achievements";
import { Achievement } from "@/data/achievements";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Trophy, Plus, Trash2, Calendar, ExternalLink } from "lucide-react";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "Hackathon",
    date: "",
    description: "",
    metric: "",
    link: "",
  });

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const data = await getAchievementsFromFirestore();
      setAchievements(data);
    } catch (e) {
      showToast("Failed to load achievements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    setSaving(true);

    try {
      await createAchievementInFirestore(formData);
      showToast("Achievement added successfully!", "success");
      setShowAddForm(false);
      setFormData({ title: "", category: "Hackathon", date: "", description: "", metric: "", link: "" });
      loadAchievements();
    } catch (err: any) {
      showToast(err.message || "Failed to add achievement", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAchievementFromFirestore(deleteTarget.id);
      showToast(`Achievement "${deleteTarget.title}" deleted`, "success");
      setAchievements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete achievement", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Management
            </span>
            <h1 className="text-3xl font-extrabold text-white">Achievements & Milestones</h1>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel Form" : "Add Achievement"}</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-zinc-400" />
              <span>Add New Milestone Achievement</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AI Hackathon Winner"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Coding">Coding Practice</option>
                  <option value="Academic">Academic Excellence</option>
                  <option value="Engineering">Software Engineering</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Date / Year</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 2025"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Key Metric / Badge Label</label>
                <input
                  type="text"
                  value={formData.metric}
                  onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                  placeholder="e.g. 1st Place / 500+ Problems Solved"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description of milestone achievement..."
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono resize-none focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono"
              >
                {saving ? "Saving..." : "Save Achievement"}
              </button>
            </div>
          </form>
        )}

        {/* Achievements Grid */}
        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            Loading achievements...
          </div>
        ) : achievements.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            No achievements added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((item) => (
              <div key={item.id} className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-zinc-900 text-white border border-zinc-800">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{item.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl bg-zinc-900 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-colors"
                      title="Delete achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">{item.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>

                  {item.metric && (
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-bold">
                      {item.metric}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Confirm Delete Achievement"
          message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          isDeleting={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </AdminLayout>
  );
}
