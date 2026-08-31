"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getEducationFromFirestore, createEducationInFirestore, deleteEducationFromFirestore } from "@/lib/firebase/education";
import { EducationItem } from "@/data/education";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { GraduationCap, Plus, Trash2, Calendar, MapPin } from "lucide-react";

export default function AdminEducationPage() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EducationItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    degree: "",
    fieldOfStudy: "",
    institution: "",
    period: "",
    status: "Completed",
    gradeOrGpa: "",
    location: "India",
    relevantCoursework: "Data Structures, Algorithms, Machine Learning",
    description: "",
  });

  const loadEdu = async () => {
    setLoading(true);
    try {
      const data = await getEducationFromFirestore();
      setEducation(data);
    } catch (e) {
      showToast("Failed to load education timeline", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEdu();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree || !formData.institution) return;
    setSaving(true);

    try {
      const courseworkArr = formData.relevantCoursework.split(",").map((c) => c.trim()).filter(Boolean);
      await createEducationInFirestore({
        ...formData,
        relevantCoursework: courseworkArr,
      });

      showToast("Education entry added successfully!", "success");
      setShowAddForm(false);
      setFormData({
        degree: "",
        fieldOfStudy: "",
        institution: "",
        period: "",
        status: "Completed",
        gradeOrGpa: "",
        location: "India",
        relevantCoursework: "",
        description: "",
      });
      loadEdu();
    } catch (err: any) {
      showToast(err.message || "Failed to add education entry", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEducationFromFirestore(deleteTarget.id);
      showToast(`Education entry "${deleteTarget.degree}" deleted`, "success");
      setEducation((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete education entry", "error");
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
            <h1 className="text-3xl font-extrabold text-white">Education & Timeline</h1>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel Form" : "Add Education Entry"}</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-zinc-400" />
              <span>Add Education Degree / Certificate</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Degree Name *</label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Field of Study / Stream</label>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. University Name"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Time Period</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. 2023 - 2027"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Status</label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  placeholder="e.g. Currently Pursuing / Completed"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Relevant Coursework (Comma separated)</label>
              <input
                type="text"
                value={formData.relevantCoursework}
                onChange={(e) => setFormData({ ...formData, relevantCoursework: e.target.value })}
                placeholder="DSA, Machine Learning, DBMS, Physics"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Overview of academic achievements and focus..."
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
                {saving ? "Saving..." : "Save Education Entry"}
              </button>
            </div>
          </form>
        )}

        {/* Education Timeline Cards List */}
        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            Loading education timeline...
          </div>
        ) : education.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            No education items found.
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((item) => (
              <div key={item.id} className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-zinc-900 text-white border border-zinc-800">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.degree}</h3>
                      <p className="text-xs font-mono text-zinc-400">{item.fieldOfStudy} • {item.institution}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-zinc-900 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-colors"
                    title="Delete education entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-300">{item.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {item.relevantCoursework.map((course) => (
                    <span key={course} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      {course}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.period} ({item.status})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Confirm Delete Education Entry"
          message={`Are you sure you want to delete "${deleteTarget?.degree}"?`}
          isDeleting={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </AdminLayout>
  );
}
