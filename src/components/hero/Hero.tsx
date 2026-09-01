"use client";

import { useState, useEffect } from "react";
import { profileData as defaultProfile, ProfileData } from "@/data/profile";
import { getProfileFromFirestore } from "@/lib/firebase/profile";
import { ProfileVisual } from "./ProfileVisual";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import {
  ArrowRight,
  FileText,
  Mail,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    async function load() {
      const data = await getProfileFromFirestore();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center bg-tech-grid overflow-hidden"
    >
      {/* Metallic Gray Ambient Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 bg-zinc-800/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-100 border border-zinc-700 text-xs font-mono font-medium mb-6 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span>{profile.statusText || profile.availabilityStatus || "Available for Opportunities"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              {profile.tagline || profile.title || "AI & Machine Learning Student | Full Stack Developer"}
            </h1>

            {/* Supporting Bio Text */}
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed mb-8">
              Hi, I&apos;m <span className="font-bold text-white">{profile.name}</span>. {profile.shortBio || profile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-black font-semibold text-sm shadow-md hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {(profile.resumePath || profile.resumeUrl) && (
                <a
                  href={profile.resumePath || profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl glass-panel text-zinc-100 font-semibold text-sm border-zinc-700 hover:bg-zinc-900 transition-all duration-200 shadow-xs"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Download Resume</span>
                </a>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4 border-t border-zinc-800 w-full">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Connect:</span>
              <div className="flex items-center gap-3">
                {(profile.githubUrl || profile.socials?.github) && (
                  <a
                    href={profile.githubUrl || profile.socials?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 hover:border-zinc-500 transition-all"
                    title="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {(profile.linkedinUrl || profile.socials?.linkedin) && (
                  <a
                    href={profile.linkedinUrl || profile.socials?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 hover:border-zinc-500 transition-all"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Send Email"
                    className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 hover:border-zinc-500 transition-all"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Profile Photo Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <ProfileVisual />
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
          >
            <span>Scroll Down</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
