"use client";

import { achievementsData } from "@/data/achievements";
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
  return (
    <section id="achievements" className="py-24 relative bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Milestones"
          title="Key Achievements & Activities"
          subtitle="Notable learning milestones, coding accomplishments, and technical activities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {achievementsData.map((item, idx) => (
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

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Tag:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                  {item.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
