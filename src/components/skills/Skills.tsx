"use client";

import { useState, useEffect } from "react";
import { SkillCategory, SkillItem } from "@/data/skills";
import { getSkillsFromFirestore } from "@/lib/firebase/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  Code,
  Layout,
  Server,
  Database,
  Brain,
  Wrench,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

const categoryIconMap: Record<string, React.ReactNode> = {
  languages: <Code className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  frontend: <Layout className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  backend: <Server className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  "database-cloud": <Database className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  "ai-ml": <Brain className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  tools: <Wrench className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
};

function getProficiencyBadge(proficiency: SkillItem["proficiency"]) {
  switch (proficiency) {
    case "Building With":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black border border-zinc-900 dark:border-white">
          <Sparkles className="w-3 h-3" />
          Building With
        </span>
      );
    case "Working Knowledge":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
          <CheckCircle2 className="w-3 h-3" />
          Working Knowledge
        </span>
      );
    case "Learning":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800">
          <BookOpen className="w-3 h-3" />
          Learning
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200">
          {proficiency}
        </span>
      );
  }
}

export function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getSkillsFromFirestore();
      setCategories(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section id="skills" className="py-24 relative bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Technical Skills"
          title="Tools & Technologies Stack"
          subtitle="Honest technical breakdown organized by domain, reflecting practical project experience and active learning areas."
        />

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Loading skills categories...
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-zinc-200 dark:border-zinc-800"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                      {categoryIconMap[category.id] || <Code className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Skills Badges List */}
                  <div className="flex flex-col gap-3">
                    {category.skills?.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-colors"
                      >
                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {skill.name}
                        </span>
                        {getProficiencyBadge(skill.proficiency)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-right">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {category.skills?.length || 0} competencies
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-950/60 border border-zinc-800 max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">No Skills Added Yet</h3>
            <p className="text-xs text-zinc-400 font-mono">
              The skills database is empty. Log into the Admin Console to configure your skill categories!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
