"use client";

import { useState, useEffect } from "react";
import { profileData as defaultProfile, ProfileData } from "@/data/profile";
import { getProfileFromFirestore } from "@/lib/firebase/profile";
import { FileText, Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function ResumeCTA() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    async function load() {
      const data = await getProfileFromFirestore();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resumeHref = profile.resumeUrl || profile.resumePath;

  return (
    <section id="resume" className="py-20 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden bg-zinc-950 text-white shadow-2xl border border-zinc-800 text-center"
        >
          {/* Subtle Ambient Monochrome Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800 text-zinc-100 border border-zinc-700 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open for Internships & Projects</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Let&apos;s Build Something Meaningful
          </h2>

          <p className="text-zinc-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
            Whether you are looking for an enthusiastic AI/ML intern, a full-stack project collaborator, or just want to chat about algorithm design and modern web apps—I&apos;d love to connect.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {resumeHref ? (
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-black font-bold text-sm shadow-md hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            ) : null}

            <a
              href="#contact"
              onClick={scrollToContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 border border-zinc-700 transition-all"
            >
              <Mail className="w-4 h-4 text-white" />
              <span>Contact Me</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
