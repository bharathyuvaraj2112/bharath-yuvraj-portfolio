export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "AI / ML" | "Full Stack" | "Hardware / IoT";
  status: "Prototype" | "Concept" | "Completed";
  statusBadge: string;
  isConceptOrPlaceholder: boolean;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  imageVisualType: "accident" | "study" | "resume" | "portfolio";
  overview: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
}

export const projectsData: Project[] = [];
