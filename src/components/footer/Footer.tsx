"use client";

import { useState, useEffect } from "react";
import { profileData as defaultProfile, ProfileData } from "@/data/profile";
import { getProfileFromFirestore } from "@/lib/firebase/profile";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { Terminal, Mail, ArrowUp } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    async function load() {
      const data = await getProfileFromFirestore();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="#hero"
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs">
                <Terminal className="w-4 h-4" />
              </div>
              <span>{profile.name}</span>
            </a>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
              {profile.title}
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {(profile.githubUrl || profile.socials?.github) && (
                <a
                  href={profile.githubUrl || profile.socials?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
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
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send Email"
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Monochrome Design • Next.js & TypeScript & Firebase
          </p>
        </div>

      </div>
    </footer>
  );
}
