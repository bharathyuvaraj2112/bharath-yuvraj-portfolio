"use client";

import { useState, useEffect } from "react";
import { profileData as defaultProfile, ProfileData } from "@/data/profile";
import { getProfileFromFirestore } from "@/lib/firebase/profile";
import { Sparkles, Terminal } from "lucide-react";
import Image from "next/image";

export function ProfileVisual() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    async function load() {
      const data = await getProfileFromFirestore();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const photoSrc =
    profile.profilePhotoUrl && !profile.profilePhotoUrl.includes("unsplash")
      ? profile.profilePhotoUrl
      : "/profile.jpg";

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-square flex items-center justify-center p-2 sm:p-4">
      {/* Background Metallic Radial Glow */}
      <div className="absolute inset-0 bg-linear-to-tr from-zinc-700/20 via-zinc-500/10 to-zinc-800/30 rounded-full blur-3xl -z-10" />

      {/* Outer Metallic Frame Container */}
      <div className="relative w-full h-full rounded-3xl p-3 bg-linear-to-b from-zinc-700 via-zinc-800 to-zinc-950 border border-zinc-700/80 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
        
        {/* Inner Profile Image Frame */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
          <Image
            src={photoSrc}
            alt={profile.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-100 contrast-100"
            priority
          />

          {/* Subtle Bottom Ambient Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-60 pointer-events-none" />

          {/* Bottom Overlay Label */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-white text-black">
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {profile.name}
                </h4>
                <p className="text-[10px] font-mono text-zinc-400">
                  {profile.title || "AI / ML & Full Stack"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
