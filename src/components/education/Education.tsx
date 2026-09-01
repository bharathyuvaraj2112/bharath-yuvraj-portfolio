"use client";

import { useState, useEffect } from "react";
import { EducationItem } from "@/data/education";
import { getEducationFromFirestore } from "@/lib/firebase/education";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GraduationCap, Calendar, MapPin, Award, BookMarked, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Education() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getEducationFromFirestore();
      setEducationList(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section id="education" className="py-24 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Academic Background"
          title="Education & Training Timeline"
          subtitle="Formal academic studies laying the core engineering foundation from secondary school to B.Tech Artificial Intelligence."
        />

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Loading education timeline...
          </div>
        ) : educationList.length > 0 ? (
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {educationList.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-zinc-800"
              >
                {/* Header Badges */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-zinc-900 text-white border border-zinc-700">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                        {item.status}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-0.5">
                        {item.degree}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1 font-mono text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-white">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{item.period}</span>
                    </div>
                    {item.gradeOrGpa && (
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <Award className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.gradeOrGpa}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Major Field & Institution */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-zinc-100">
                    Specialization / Stream: <span className="text-gradient font-bold">{item.fieldOfStudy}</span>
                  </h4>
                  <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                    <span>{item.institution} {item.location ? `(${item.location})` : ""}</span>
                  </p>
                </div>

                <p className="text-zinc-300 leading-relaxed mb-8">
                  {item.description}
                </p>

                {/* Coursework Grid */}
                {item.relevantCoursework && item.relevantCoursework.length > 0 && (
                  <div className="pt-6 border-t border-zinc-800">
                    <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BookMarked className="w-4 h-4 text-zinc-400" />
                      <span>Key Coursework & Focus Topics</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {item.relevantCoursework.map((course) => (
                        <div
                          key={course}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                          <span>{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-950/60 border border-zinc-800 max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">No Education Entries Added Yet</h3>
            <p className="text-xs text-zinc-400 font-mono">
              The education database is empty. Log into the Admin Console to add your academic degrees and background!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
