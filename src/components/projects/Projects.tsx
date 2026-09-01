"use client";

import { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import { getProjectsFromFirestore } from "@/lib/firebase/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2 } from "lucide-react";

const categories = ["All", "AI / ML", "Full Stack", "Hardware / IoT"] as const;

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProjectsFromFirestore();
      setProjects(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          badge="Featured Works"
          title="Projects & Innovations"
          subtitle="Explore practical hardware prototypes, AI application concepts, and modern web software engineered with precision."
        />

        {/* Category Filter Tabs */}
        {projects.length > 0 && (
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
        )}

        {/* Projects Cards Grid / Empty State */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Loading portfolio projects...
          </div>
        ) : filteredProjects.length > 0 ? (
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
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-950/60 border border-zinc-800 max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono">No Projects Added Yet</h3>
            <p className="text-xs text-zinc-400 font-mono">
              The portfolio project database is empty. Log into the Admin Console to start adding your projects!
            </p>
          </div>
        )}

        {/* Modal Window */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
