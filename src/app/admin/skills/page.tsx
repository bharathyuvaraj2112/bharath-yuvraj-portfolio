"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getSkillsFromFirestore, updateSkillCategoryInFirestore } from "@/lib/firebase/skills";
import { SkillCategory } from "@/data/skills";
import { useToast } from "@/components/ui/Toast";
import { Wrench, Plus, Save, Trash2, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState<string | null>(null);
  const { showToast } = useToast();

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<"Building With" | "Working Knowledge" | "Learning">("Building With");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await getSkillsFromFirestore();
      setCategories(data);
    } catch (e) {
      showToast("Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (catId: string) => {
    if (!newSkillName.trim()) return;
    setSavingCategory(catId);

    try {
      const updatedCats = categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            skills: [...cat.skills, { name: newSkillName.trim(), proficiency: newSkillProficiency }],
          };
        }
        return cat;
      });

      const targetCat = updatedCats.find((c) => c.id === catId);
      if (targetCat) {
        await updateSkillCategoryInFirestore(catId, { skills: targetCat.skills });
        setCategories(updatedCats);
        showToast("Skill added successfully!", "success");
        setNewSkillName("");
        setActiveCategoryId(null);
      }
    } catch (e: any) {
      showToast(e.message || "Error adding skill", "error");
    } finally {
      setSavingCategory(null);
    }
  };

  const handleDeleteSkill = async (catId: string, skillName: string) => {
    setSavingCategory(catId);
    try {
      const updatedCats = categories.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            skills: cat.skills.filter((s) => s.name !== skillName),
          };
        }
        return cat;
      });

      const targetCat = updatedCats.find((c) => c.id === catId);
      if (targetCat) {
        await updateSkillCategoryInFirestore(catId, { skills: targetCat.skills });
        setCategories(updatedCats);
        showToast("Skill removed successfully!", "success");
      }
    } catch (e: any) {
      showToast(e.message || "Error removing skill", "error");
    } finally {
      setSavingCategory(null);
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
            <h1 className="text-3xl font-extrabold text-white">Skills & Technologies</h1>
          </div>
        </div>

        {loading ? (
          <div className="glass-card rounded-3xl p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800">
            Loading technical skill categories...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="glass-card rounded-3xl p-6 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-zinc-400" />
                      <span>{cat.title}</span>
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">{cat.skills.length} skills</span>
                  </div>

                  <div className="space-y-2">
                    {cat.skills.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono"
                      >
                        <div>
                          <span className="font-bold text-white block">{s.name}</span>
                          <span className="text-[10px] text-zinc-400">{s.proficiency}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSkill(cat.id, s.name)}
                          disabled={savingCategory === cat.id}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                          title="Remove skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Skill Form in Category */}
                <div className="pt-4 border-t border-zinc-800">
                  {activeCategoryId === cat.id ? (
                    <div className="space-y-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-700">
                      <input
                        type="text"
                        placeholder="Skill name (e.g. Next.js)"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
                      />
                      <select
                        value={newSkillProficiency}
                        onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:outline-none"
                      >
                        <option value="Building With">Building With</option>
                        <option value="Working Knowledge">Working Knowledge</option>
                        <option value="Learning">Learning</option>
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddSkill(cat.id)}
                          disabled={savingCategory === cat.id}
                          className="flex-1 py-1.5 rounded-xl bg-white text-black text-xs font-mono font-bold hover:bg-zinc-200 transition-colors"
                        >
                          {savingCategory === cat.id ? "Saving..." : "Add"}
                        </button>
                        <button
                          onClick={() => setActiveCategoryId(null)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-mono"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        setNewSkillName("");
                      }}
                      className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Skill to {cat.title}</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
