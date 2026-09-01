"use client";

import { useState, useEffect } from "react";
import { profileData as defaultProfile, ProfileData } from "@/data/profile";
import { getProfileFromFirestore } from "@/lib/firebase/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrainCircuit, Code2, Cpu, Sparkles, Target, Compass, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  BrainCircuit: <BrainCircuit className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />,
  Code2: <Code2 className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />,
  Cpu: <Cpu className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />,
  Sparkles: <Sparkles className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />,
};

export function About() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    async function load() {
      const data = await getProfileFromFirestore();
      if (data) setProfile(data);
    }
    load();
  }, []);

  return (
    <section id="about" className="py-24 relative bg-zinc-50/50 dark:bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="About Me"
          title="Combining Machine Intelligence with Web Architecture"
          subtitle="A passionate student explorer working at the intersection of AI modeling and modern web development."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Narrative Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            {/* Introduction Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Introduction & Overview
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {profile.aboutIntro}
              </p>
            </div>

            {/* Current Focus Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Current Focus & Learning
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {profile.aboutFocus}
              </p>
            </div>

            {/* Philosophy Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Development Philosophy
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {profile.aboutPhilosophy}
              </p>
            </div>
          </motion.div>

          {/* Right Column: Interactive Highlight Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {profile.infoCards?.map((card, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 border border-zinc-200 dark:border-zinc-800"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                      {iconMap[card.iconName] || <BrainCircuit className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />}
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                      {card.tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    {card.title}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-900 dark:text-zinc-100">
                  <span>Active Explorer</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
