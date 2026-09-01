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
    id: "ai-ml",
    title: "AI, ML & Data Science",
    description: "Machine learning model architecture, deep learning frameworks, and data analytics tools.",
    skills: [
      { name: "Python", proficiency: "Building With" },
      { name: "PyTorch", proficiency: "Building With" },
      { name: "TensorFlow", proficiency: "Working Knowledge" },
      { name: "Scikit-Learn", proficiency: "Building With" },
      { name: "Pandas & NumPy", proficiency: "Building With" },
      { name: "OpenCV", proficiency: "Learning" },
    ],
  },
  {
    id: "languages",
    title: "Programming Languages",
    description: "Core programming languages for algorithmic problem solving and web systems.",
    skills: [
      { name: "Python", proficiency: "Building With" },
      { name: "TypeScript", proficiency: "Building With" },
      { name: "JavaScript (ES6+)", proficiency: "Building With" },
      { name: "C++", proficiency: "Working Knowledge" },
      { name: "SQL", proficiency: "Working Knowledge" },
      { name: "HTML5 / CSS3", proficiency: "Building With" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Modern client-side frameworks, interactive UI design, and responsive styling.",
    skills: [
      { name: "React.js", proficiency: "Building With" },
      { name: "Next.js (App Router)", proficiency: "Building With" },
      { name: "Tailwind CSS", proficiency: "Building With" },
      { name: "Framer Motion", proficiency: "Working Knowledge" },
      { name: "Redux / Zustand", proficiency: "Working Knowledge" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Databases",
    description: "Server-side architectures, RESTful APIs, and relational/document databases.",
    skills: [
      { name: "Node.js", proficiency: "Building With" },
      { name: "Express.js", proficiency: "Building With" },
      { name: "FastAPI", proficiency: "Working Knowledge" },
      { name: "PostgreSQL", proficiency: "Working Knowledge" },
      { name: "MongoDB", proficiency: "Working Knowledge" },
      { name: "Firebase / Firestore", proficiency: "Building With" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    description: "Developer workflows, version control, cloud platforms, and deployment tools.",
    skills: [
      { name: "Git & GitHub", proficiency: "Building With" },
      { name: "Docker", proficiency: "Learning" },
      { name: "VS Code", proficiency: "Building With" },
      { name: "Vercel", proficiency: "Building With" },
      { name: "Postman", proficiency: "Working Knowledge" },
    ],
  },
];

