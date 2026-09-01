"use client";

import { useState, useEffect } from "react";
import { Achievement } from "@/data/achievements";
import { getAchievementsFromFirestore } from "@/lib/firebase/achievements";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Trophy, Calendar, Sparkles, Code, Milestone } from "lucide-react";
import { motion } from "framer-motion";

const categoryIconMap: Record<string, React.ReactNode> = {
  Hackathon: <Trophy className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  Coding: <Code className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  Academic: <Sparkles className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
  "Learning Milestone": <Milestone className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />,
};

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAchievementsFromFirestore();
      setAchievements(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section id="achievements" className="py-24 relative bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Milestones"
          title="Key Achievements & Activities"
          subtitle="Notable learning milestones, coding accomplishments, and technical activities."
        />

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Loading achievements...
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {achievements.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all border border-zinc-200 dark:border-zinc-800"
              >
                <div>
                  {/* Header Info */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                        {categoryIconMap[item.category] || <Trophy className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />}
                      </div>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {item.tag && (
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Tag:</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                      {item.tag}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-950/60 border border-zinc-800 max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">No Achievements Added Yet</h3>
            <p className="text-xs text-zinc-400 font-mono">
              The achievements database is empty. Log into the Admin Console to post your milestones!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
