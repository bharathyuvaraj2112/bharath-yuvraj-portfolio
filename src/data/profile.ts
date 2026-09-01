export interface ProfileData {
  name: string;
  title: string;
  shortBio: string;
  aboutIntro: string;
  aboutFocus: string;
  aboutPhilosophy: string;
  statusText: string;
  location: string;
  email: string;
  resumePath: string;
  profilePhotoUrl: string;
  tagline?: string;
  bio?: string;
  availabilityStatus?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  infoCards: Array<{
    title: string;
    description: string;
    iconName: string;
    tag: string;
  }>;
}

export const profileData: ProfileData = {
  name: "Bharath Yuvraj",
  title: "AI & Machine Learning Student | Full Stack Developer",
  statusText: "Open to learning • Building • Creating",
  location: "India",
  email: "bharathyuvraj.dev@example.com",
  resumePath: "/resume-placeholder.pdf",
  profilePhotoUrl: "/profile.jpeg",
  tagline: "AI & Machine Learning Student | Full Stack Developer",
  bio: "Passionate AI/ML student dedicated to building modern, intelligent digital experiences. Combining machine learning algorithms with full-stack web development to solve real-world problems.",
  availabilityStatus: "Open to learning • Building • Creating",
  githubUrl: "https://github.com/bharathyuvaraj2112/bharath-yuvraj-portfolio",
  linkedinUrl: "https://linkedin.com/in/bharathyuvraj-placeholder",
  resumeUrl: "/resume-placeholder.pdf",
  shortBio:
    "Passionate AI/ML student dedicated to building modern, intelligent digital experiences. Combining machine learning algorithms with full-stack web development to solve real-world problems.",
  aboutIntro:
    "I am an AI & Machine Learning student with a strong passion for software engineering and modern web development. My goal is to bridge the gap between complex artificial intelligence algorithms and intuitive, user-centric web applications.",
  aboutFocus:
    "Currently focusing on Deep Learning fundamentals, Natural Language Processing, Data Structures & Algorithms, and building scalable full-stack applications with React, Next.js, and Cloud services.",
  aboutPhilosophy:
    "I believe in continuous learning, writing clean maintainable code, and crafting software that provides genuine value to real users through thoughtful UI/UX and intelligent engineering.",
  socials: {
    github: "https://github.com/bharathyuvaraj2112/bharath-yuvraj-portfolio",
    linkedin: "https://linkedin.com/in/bharathyuvraj-placeholder",
    email: "mailto:bharathyuvraj.dev@example.com",
  },
  infoCards: [
    {
      title: "AI / ML Focus",
      description: "Exploring machine learning model architecture, data processing, and AI integrations.",
      iconName: "BrainCircuit",
      tag: "Core Passion",
    },
    {
      title: "Full Stack Development",
      description: "Crafting end-to-end web apps with React, Next.js, TypeScript, and modern APIs.",
      iconName: "Code2",
      tag: "Technical Stack",
    },
    {
      title: "Problem Solving & DSA",
      description: "Applying algorithm analysis, optimization techniques, and clean system design.",
      iconName: "Cpu",
      tag: "Foundation",
    },
    {
      title: "Continuous Learning",
      description: "Constantly expanding skills through real-world projects, hackathons, and research.",
      iconName: "Sparkles",
      tag: "Growth Mindset",
    },
  ],
};
