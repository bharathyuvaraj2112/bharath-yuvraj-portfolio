"use client";

import { profileData } from "@/data/profile";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Code2, Brain } from "lucide-react";
import Image from "next/image";

export function ProfileVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-4">
      {/* Background Metallic Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700/20 via-zinc-500/10 to-zinc-800/30 rounded-full blur-3xl -z-10" />

      {/* Outer Metallic Frame Container */}
      <div className="relative w-full h-full rounded-3xl p-3 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 border border-zinc-700/80 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
        
        {/* Inner Profile Image Frame */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
          <Image
            src={profileData.profilePhotoUrl}
            alt={profileData.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
            priority
          />

          {/* Grayscale Ambient Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

          {/* Bottom Overlay Label */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white text-black">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {profileData.name}
                </h4>
                <p className="text-[10px] font-mono text-zinc-400">
                  AI / ML & Full Stack
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Floating Accent Pills */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 text-white text-xs font-mono border border-zinc-700 shadow-xl backdrop-blur-md"
        >
          <Brain className="w-3.5 h-3.5 text-zinc-300" />
          <span>Machine Learning</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 text-white text-xs font-mono border border-zinc-700 shadow-xl backdrop-blur-md"
        >
          <Code2 className="w-3.5 h-3.5 text-zinc-300" />
          <span>Full Stack</span>
        </motion.div>

      </div>
    </div>
  );
}
