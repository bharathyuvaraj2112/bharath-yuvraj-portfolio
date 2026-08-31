"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCertificationsFromFirestore, createCertificationInFirestore, deleteCertificationFromFirestore } from "@/lib/firebase/certifications";
import { Certification } from "@/data/certifications";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Award, Plus, Trash2, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
    certificateImageUrl: "",
    skillsCovered: "Machine Learning, Python, Neural Networks",
    description: "",
  });

  const loadCerts = async () => {
    setLoading(true);
    try {
      const data = await getCertificationsFromFirestore();
      setCerts(data);
    } catch (e) {
      showToast("Failed to load certifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer) return;
    setSaving(true);

    try {
      const skillsArr = formData.skillsCovered.split(",").map((s) => s.trim()).filter(Boolean);
      await createCertificationInFirestore({
        ...formData,
        date: formData.issueDate || "2024",
        skillsCovered: skillsArr,
      });

      showToast("Certification added successfully!", "success");
      setShowAddForm(false);
      setFormData({
        title: "",
        issuer: "",
        issueDate: "",
        credentialUrl: "",
        certificateImageUrl: "",
        skillsCovered: "",
        description: "",
      });
      loadCerts();
    } catch (err: any) {
      showToast(err.message || "Failed to add certification", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCertificationFromFirestore(deleteTarget.id);
      showToast(`Certification "${deleteTarget.title}" deleted`, "success");
      setCerts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete certification", "error");
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
            <h1 className="text-3xl font-extrabold text-white">Certifications & Credentials</h1>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel Form" : "Add Certification"}</span>
          </button>
        </div>

        {/* Add Certification Form Modal/Card */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-zinc-400" />
              <span>Add New Certification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Deep Learning Specialization"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g. Coursera / DeepLearning.AI"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                  Issue Date / Year
                </label>
                <input
                  type="text"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  placeholder="e.g. November 2024"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                Skills Validated (Comma separated)
              </label>
              <input
                type="text"
                value={formData.skillsCovered}
                onChange={(e) => setFormData({ ...formData, skillsCovered: e.target.value })}
                placeholder="Python, TensorFlow, Neural Networks"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary of course content and learning outcomes..."
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 font-mono resize-none"
              />
            </div>

            <ImageUploader
              value={formData.certificateImageUrl}
              onChange={(url) => setFormData({ ...formData, certificateImageUrl: url })}
              folder="certifications"
              label="Upload Certificate Badge / Image"
            />

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
                {saving ? "Saving..." : "Save Certification"}
              </button>
            </div>
          </form>
        )}

        {/* Certifications List Grid */}
        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            Loading certifications...
          </div>
        ) : certs.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            No certifications added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert) => (
              <div key={cert.id} className="glass-card rounded-3xl p-6 border border-zinc-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-zinc-900 text-white border border-zinc-800">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                        <p className="text-xs font-mono text-zinc-400">{cert.issuer}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteTarget(cert)}
                      className="p-2 rounded-xl bg-zinc-900 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-colors"
                      title="Delete certification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 mb-4">{cert.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skillsCovered.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{cert.issueDate}</span>
                  </span>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Confirm Delete Certification"
          message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          isDeleting={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </AdminLayout>
  );
}
