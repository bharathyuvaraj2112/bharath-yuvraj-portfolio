"use client";

import { Project } from "@/data/projects";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { ExternalLink, Info, Cpu, BookOpen, FileCheck, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const getBannerIcon = () => {
    switch (project.imageVisualType) {
      case "accident":
        return <Cpu className="w-12 h-12 text-zinc-100" />;
      case "study":
        return <BookOpen className="w-12 h-12 text-zinc-100" />;
      case "resume":
        return <FileCheck className="w-12 h-12 text-zinc-100" />;
      case "portfolio":
        return <Code2 className="w-12 h-12 text-zinc-100" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 border border-zinc-200 dark:border-zinc-800"
    >
      <div>
        {/* Banner Visual Header - Monochrome Grayscale Gradient */}
        <div className="relative h-48 w-full bg-linear-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center overflow-hidden">
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-tech-grid opacity-30" />

          {/* Icon Preview */}
          <div className="z-10 group-hover:scale-110 transition-transform duration-300 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
            {getBannerIcon()}
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs backdrop-blur-md bg-zinc-900/90 text-white border border-zinc-700">
              {project.statusBadge}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-4 right-4 z-10">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/80 text-zinc-300 border border-zinc-700 backdrop-blur-md">
              {project.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium mt-1 mb-3">
            {project.tagline}
          </p>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Technologies Badges */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 pt-0 border-t border-zinc-200 dark:border-zinc-800 mt-auto flex items-center justify-between gap-3">
        <button
          onClick={() => onSelect(project)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold font-mono hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
        >
          <Info className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 transition-colors"
              title="GitHub Code"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 transition-colors"
              title="Live Demo"
              aria-label="Live Demo Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
