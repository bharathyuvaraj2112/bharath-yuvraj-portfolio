"use client";

import { useState, useEffect } from "react";
import { Certification } from "@/data/certifications";
import { getCertificationsFromFirestore } from "@/lib/firebase/certifications";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Award, ExternalLink, Calendar, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getCertificationsFromFirestore();
      setCertifications(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section id="certifications" className="py-24 relative bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Credentials"
          title="Certifications & Specializations"
          subtitle="Verified training programs and skill assessments completing core academic coursework."
        />

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Loading certifications...
          </div>
        ) : certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all border border-zinc-800"
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-3 rounded-2xl bg-zinc-900 text-white border border-zinc-700 group-hover:scale-105 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 font-mono text-xs border border-zinc-800">
                      <Calendar className="w-3.5 h-3.5 text-white" />
                      <span>{cert.date || cert.issueDate}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-zinc-300 transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-xs font-mono text-zinc-400 mb-6 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>{cert.issuer}</span>
                  </p>

                  {/* Skills Covered List */}
                  {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                    <div className="mb-6">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                        Skills Validated:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skillsCovered.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Link */}
                <div className="pt-4 border-t border-zinc-800">
                  <a
                    href={cert.certificateUrl || cert.credentialUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-mono font-semibold border border-zinc-700 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-950/60 border border-zinc-800 max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">No Certifications Added Yet</h3>
            <p className="text-xs text-zinc-400 font-mono">
              The certifications database is empty. Log into the Admin Console to add your credentials!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
