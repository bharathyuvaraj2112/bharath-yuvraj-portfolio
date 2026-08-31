export interface SkillItem {
  name: string;
  proficiency: "Building With" | "Working Knowledge" | "Learning";
  iconName?: string;
  badgeColor?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "Core languages used for problem solving, algorithmic thinking, and system software.",
    skills: [
      { name: "Python", proficiency: "Building With" },
      { name: "Java", proficiency: "Working Knowledge" },
      { name: "TypeScript", proficiency: "Building With" },
      { name: "JavaScript", proficiency: "Building With" },
      { name: "C", proficiency: "Working Knowledge" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Building responsive, modern, and accessible user interfaces.",
    skills: [
      { name: "Next.js", proficiency: "Building With" },
      { name: "React", proficiency: "Building With" },
      { name: "Tailwind CSS", proficiency: "Building With" },
      { name: "JavaScript (ES6+)", proficiency: "Building With" },
      { name: "HTML5", proficiency: "Building With" },
      { name: "CSS3 / Modern CSS", proficiency: "Building With" },
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Architecting server logic, endpoints, and data processing pipelines.",
    skills: [
      { name: "Node.js", proficiency: "Working Knowledge" },
      { name: "REST APIs", proficiency: "Building With" },
      { name: "Server-side Development", proficiency: "Working Knowledge" },
    ],
  },
  {
    id: "database-cloud",
    title: "Database & Cloud",
    description: "Cloud services, user authentication, and document data storage.",
    skills: [
      { name: "Firebase", proficiency: "Learning" },
      { name: "Firestore", proficiency: "Learning" },
      { name: "Firebase Authentication", proficiency: "Learning" },
      { name: "Firebase Storage", proficiency: "Learning" },
    ],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description: "Fundamental ML concepts, data manipulation, and intelligent model integration.",
    skills: [
      { name: "Machine Learning", proficiency: "Learning" },
      { name: "Data Analysis", proficiency: "Working Knowledge" },
      { name: "Data Visualization", proficiency: "Working Knowledge" },
      { name: "Generative AI", proficiency: "Learning" },
      { name: "AI APIs", proficiency: "Building With" },
    ],
  },
  {
    id: "tools",
    title: "Developer Tools",
    description: "Version control, code editing, and modern deployment environments.",
    skills: [
      { name: "Git", proficiency: "Building With" },
      { name: "GitHub", proficiency: "Building With" },
      { name: "VS Code", proficiency: "Building With" },
      { name: "Vercel", proficiency: "Building With" },
    ],
  },
];
