"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getSkillsFromFirestore,
  createSkillCategoryInFirestore,
  updateSkillCategoryInFirestore,
  deleteSkillCategoryFromFirestore,
  seedSkillsToFirestore,
} from "@/lib/firebase/skills";
import { SkillCategory, SkillItem } from "@/data/skills";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
  FolderPlus,
  RefreshCw,
  Layers,
  BookOpen,
} from "lucide-react";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  // Add Category Modal State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatDescription, setNewCatDescription] = useState("");

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editCatTitle, setEditCatTitle] = useState("");
  const [editCatDescription, setEditCatDescription] = useState("");

  // Add Skill Modal / Inline State
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [targetCatId, setTargetCatId] = useState<string>("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillItem["proficiency"]>("Building With");

  // Edit Skill Modal State
  const [editingSkill, setEditingSkill] = useState<{
    catId: string;
    originalName: string;
    name: string;
    proficiency: SkillItem["proficiency"];
  } | null>(null);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "category" | "skill";
    catId: string;
    skillName?: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    getSkillsFromFirestore()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          showToast("Failed to load skill categories", "error");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // Seed Default Categories
  const handleSeedSkills = async () => {
    setSeeding(true);
    try {
      const seeded = await seedSkillsToFirestore();
      setCategories(seeded);
      showToast("Seeded default skills & technologies stack!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Failed to seed default skills", "error");
    } finally {
      setSeeding(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;

    setActionLoading(true);
    try {
      const newId = await createSkillCategoryInFirestore({
        title: newCatTitle.trim(),
        description: newCatDescription.trim(),
        skills: [],
      });

      const newCategory: SkillCategory = {
        id: newId,
        title: newCatTitle.trim(),
        description: newCatDescription.trim(),
        skills: [],
      };

      setCategories([...categories, newCategory]);
      showToast("Skill category created!", "success");
      setNewCatTitle("");
      setNewCatDescription("");
      setIsAddCategoryOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Error creating category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Update Category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatTitle.trim()) return;

    setActionLoading(true);
    try {
      await updateSkillCategoryInFirestore(editingCategory.id, {
        title: editCatTitle.trim(),
        description: editCatDescription.trim(),
      });

      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, title: editCatTitle.trim(), description: editCatDescription.trim() }
            : c
        )
      );
      showToast("Category updated successfully!", "success");
      setEditingCategory(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Error updating category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Category
  const confirmDeleteCategory = async (catId: string) => {
    setActionLoading(true);
    try {
      await deleteSkillCategoryFromFirestore(catId);
      setCategories(categories.filter((c) => c.id !== catId));
      showToast("Category deleted successfully!", "success");
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Error deleting category", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Add Skill to Category
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCatId || !newSkillName.trim()) return;

    setActionLoading(true);
    try {
      const category = categories.find((c) => c.id === targetCatId);
      if (!category) throw new Error("Target category not found.");

      const updatedSkills = [
        ...(category.skills || []),
        { name: newSkillName.trim(), proficiency: newSkillProficiency },
      ];

      await updateSkillCategoryInFirestore(targetCatId, { skills: updatedSkills });

      setCategories(
        categories.map((c) => (c.id === targetCatId ? { ...c, skills: updatedSkills } : c))
      );

      showToast(`Added "${newSkillName.trim()}" to ${category.title}!`, "success");
      setNewSkillName("");
      setIsAddSkillOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Error adding skill", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Update Skill inside Category
  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;

    setActionLoading(true);
    try {
      const category = categories.find((c) => c.id === editingSkill.catId);
      if (!category) throw new Error("Category not found");

      const updatedSkills = category.skills.map((s) =>
        s.name === editingSkill.originalName
          ? { name: editingSkill.name.trim(), proficiency: editingSkill.proficiency }
          : s
      );

      await updateSkillCategoryInFirestore(editingSkill.catId, { skills: updatedSkills });

      setCategories(
        categories.map((c) =>
          c.id === editingSkill.catId ? { ...c, skills: updatedSkills } : c
        )
      );

      showToast("Skill updated successfully!", "success");
      setEditingSkill(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Error updating skill", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Skill from Category
  const confirmDeleteSkill = async (catId: string, skillName: string) => {
    setActionLoading(true);
    try {
      const category = categories.find((c) => c.id === catId);
      if (!category) throw new Error("Category not found");

      const updatedSkills = category.skills.filter((s) => s.name !== skillName);
      await updateSkillCategoryInFirestore(catId, { skills: updatedSkills });

      setCategories(
        categories.map((c) => (c.id === catId ? { ...c, skills: updatedSkills } : c))
      );

      showToast(`Removed "${skillName}"!`, "success");
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || "Error deleting skill", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Management Portal
            </span>
            <h1 className="text-3xl font-extrabold text-white">Skills & Technologies</h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Manage tech categories, add skills, set proficiency levels, and update site content.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedSkills}
              disabled={seeding || loading}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-mono font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              title="Populate default technical stack"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-emerald-400" />}
              <span>{seeding ? "Seeding..." : "Seed Default Stack"}</span>
            </button>

            <button
              onClick={() => {
                if (categories.length > 0) {
                  setTargetCatId(categories[0].id);
                }
                setNewSkillName("");
                setIsAddSkillOpen(true);
              }}
              disabled={loading || categories.length === 0}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Skill</span>
            </button>

            <button
              onClick={() => {
                setNewCatTitle("");
                setNewCatDescription("");
                setIsAddCategoryOpen(true);
              }}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors shadow-md flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4 text-black" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="glass-card rounded-3xl p-16 text-center text-xs font-mono text-zinc-500 border border-zinc-800 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
            <span>Loading skills and technology stack...</span>
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="glass-card rounded-3xl p-12 text-center border border-zinc-800 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Skill Categories Found</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Your database is empty. You can create custom categories or click below to seed the standard technical stack.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleSeedSkills}
                disabled={seeding}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Seed Default Categories</span>
              </button>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Create New Category</span>
              </button>
            </div>
          </div>
        ) : (
          /* Skill Categories Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-xl"
              >
                <div>
                  {/* Category Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-zinc-800 mb-4 gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-zinc-400" />
                        <span>{cat.title}</span>
                      </h3>
                      {cat.description && (
                        <p className="text-[11px] font-mono text-zinc-400 mt-1 line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setEditCatTitle(cat.title);
                          setEditCatDescription(cat.description || "");
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: "category",
                            catId: cat.id,
                            name: cat.title,
                          })
                        }
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-2">
                    {cat.skills && cat.skills.length > 0 ? (
                      cat.skills.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition-colors text-xs font-mono"
                        >
                          <div>
                            <span className="font-bold text-white block">{s.name}</span>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                              {s.proficiency === "Building With" ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                  <Sparkles className="w-2.5 h-2.5" /> Building With
                                </span>
                              ) : s.proficiency === "Working Knowledge" ? (
                                <span className="text-sky-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Working Knowledge
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <BookOpen className="w-2.5 h-2.5" /> Learning
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setEditingSkill({
                                  catId: cat.id,
                                  originalName: s.name,
                                  name: s.name,
                                  proficiency: s.proficiency,
                                })
                              }
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                              title="Edit skill"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: "skill",
                                  catId: cat.id,
                                  skillName: s.name,
                                  name: s.name,
                                })
                              }
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                              title="Remove skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-[11px] font-mono text-zinc-600 bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-800">
                        No skills in this category yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Skill Button inside Category Card */}
                <div className="pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setTargetCatId(cat.id);
                      setNewSkillName("");
                      setNewSkillProficiency("Building With");
                      setIsAddSkillOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Skill to {cat.title}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Category */}
        {isAddCategoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-zinc-400" />
                  <span>Create New Skill Category</span>
                </h3>
                <button onClick={() => setIsAddCategoryOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Category Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud & DevOps, Mobile Tech"
                    value={newCatTitle}
                    onChange={(e) => setNewCatTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Category Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short summary of technologies in this category..."
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !newCatTitle.trim()}
                    className="px-5 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Create Category</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Category */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-zinc-400" />
                  <span>Edit Category</span>
                </h3>
                <button onClick={() => setEditingCategory(null)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Category Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCatTitle}
                    onChange={(e) => setEditCatTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Category Description
                  </label>
                  <textarea
                    rows={3}
                    value={editCatDescription}
                    onChange={(e) => setEditCatDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !editCatTitle.trim()}
                    className="px-5 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Skill */}
        {isAddSkillOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Skill / Technology</span>
                </h3>
                <button onClick={() => setIsAddSkillOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Target Category *
                  </label>
                  <select
                    value={targetCatId}
                    onChange={(e) => setTargetCatId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Skill / Technology Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, PyTorch, GraphQL"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Proficiency Level *
                  </label>
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value as SkillItem["proficiency"])}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
                  >
                    <option value="Building With">Building With (Primary / Active)</option>
                    <option value="Working Knowledge">Working Knowledge (Proficient)</option>
                    <option value="Learning">Learning (Exploring / Studying)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddSkillOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !newSkillName.trim() || !targetCatId}
                    className="px-5 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Add Skill</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Skill */}
        {editingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-zinc-400" />
                  <span>Edit Skill</span>
                </h3>
                <button onClick={() => setEditingSkill(null)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateSkill} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                    Proficiency Level *
                  </label>
                  <select
                    value={editingSkill.proficiency}
                    onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: e.target.value as SkillItem["proficiency"] })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
                  >
                    <option value="Building With">Building With</option>
                    <option value="Working Knowledge">Working Knowledge</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !editingSkill.name.trim()}
                    className="px-5 py-2 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Skill</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteTarget}
          title={deleteTarget?.type === "category" ? "Delete Category" : "Remove Skill"}
          message={
            deleteTarget?.type === "category"
              ? `Are you sure you want to delete the category "${deleteTarget?.name}" and all skills inside it? This action cannot be undone.`
              : `Are you sure you want to remove "${deleteTarget?.name}" from this category?`
          }
          isDeleting={actionLoading}
          onConfirm={() => {
            if (!deleteTarget) return;
            if (deleteTarget.type === "category") {
              confirmDeleteCategory(deleteTarget.catId);
            } else if (deleteTarget.skillName) {
              confirmDeleteSkill(deleteTarget.catId, deleteTarget.skillName);
            }
          }}
          onCancel={() => setDeleteTarget(null)}
        />

      </div>
    </AdminLayout>
  );
}
