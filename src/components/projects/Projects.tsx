"use client";

import { useState } from "react";
import { projectsData, Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "AI / ML", "Full Stack", "Hardware / IoT"] as const;

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Featured Works"
          title="Projects & Innovations"
          subtitle="Explore practical hardware prototypes, AI application concepts, and modern web software engineered with precision."
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xs font-bold"
                    : "glass-panel text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-zinc-300 dark:border-zinc-800"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Projects Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal Window */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
