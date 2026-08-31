"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Activity, Layers, Terminal } from "lucide-react";

export function TechVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center p-4">
      {/* Background Radial Glow - Monochrome */}
      <div className="absolute inset-0 bg-zinc-400/10 dark:bg-zinc-100/5 rounded-3xl blur-3xl -z-10" />

      {/* Main Glass HUD Container */}
      <div className="relative w-full h-full glass-panel rounded-3xl p-6 border border-zinc-300 dark:border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Top Header of Visual Box */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-600 inline-block" />
              <span className="w-3 h-3 rounded-full bg-zinc-500 dark:bg-zinc-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-zinc-600 dark:bg-zinc-400 inline-block" />
            </div>
            <span className="ml-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              ai_pipeline.py
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-[11px] font-mono text-zinc-900 dark:text-zinc-100">
            <Activity className="w-3 h-3 animate-pulse text-zinc-900 dark:text-white" />
            <span>MODEL READY</span>
          </div>
        </div>

        {/* Center Canvas with Neural Network Node Mesh */}
        <div className="relative my-4 flex-1 flex items-center justify-center">
          {/* Animated SVG Neural Network */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#71717a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#27272a" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection Lines */}
            <g stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 2">
              <line x1="80" y1="80" x2="200" y2="140" />
              <line x1="80" y1="220" x2="200" y2="140" />
              <line x1="200" y1="140" x2="320" y2="90" />
              <line x1="200" y1="140" x2="320" y2="210" />
              <line x1="80" y1="80" x2="200" y2="60" />
              <line x1="200" y1="60" x2="320" y2="90" />
            </g>

            {/* Pulsing Nodes */}
            <motion.circle
              cx="80"
              cy="80"
              r="8"
              className="fill-zinc-700 dark:fill-zinc-200"
              filter="url(#glow)"
              animate={{ r: [6, 9, 6] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
            <motion.circle
              cx="80"
              cy="220"
              r="7"
              className="fill-zinc-500 dark:fill-zinc-400"
              filter="url(#glow)"
              animate={{ r: [7, 10, 7] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
            />
            <motion.circle
              cx="200"
              cy="140"
              r="12"
              className="fill-zinc-900 dark:fill-white"
              filter="url(#glow)"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.circle
              cx="320"
              cy="90"
              r="8"
              className="fill-zinc-600 dark:fill-zinc-300"
              filter="url(#glow)"
              animate={{ r: [6, 8.5, 6] }}
              transition={{ repeat: Infinity, duration: 2.8, delay: 0.2 }}
            />
            <motion.circle
              cx="320"
              cy="210"
              r="8"
              className="fill-zinc-400 dark:fill-zinc-500"
              filter="url(#glow)"
              animate={{ r: [8, 6, 8] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.8 }}
            />
          </svg>

          {/* Code & Stat Overlay Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 bg-zinc-950 text-zinc-100 rounded-2xl p-4 border border-zinc-700 shadow-xl max-w-xs w-full backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-zinc-300">
              <Terminal className="w-3.5 h-3.5 text-zinc-100" />
              <span>ml_engine.predict()</span>
            </div>
            <pre className="font-mono text-[11px] text-zinc-300 leading-relaxed overflow-x-auto">
              <code>
                <span className="text-zinc-400">import</span> torch{"\n"}
                <span className="text-zinc-100 font-bold">model</span> = NeuralNet(input_dim=512){"\n"}
                <span className="text-zinc-200">accuracy</span> = <span className="text-zinc-100 font-bold">0.984</span>{"\n"}
                <span className="text-zinc-500"># Output: Optimized predictions</span>
              </code>
            </pre>
          </motion.div>
        </div>

        {/* Floating Feature Tags */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <BrainCircuit className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span>Neural Architecture</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <Layers className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span>Full Stack Next.js</span>
          </div>
        </div>

      </div>
    </div>
  );
}
