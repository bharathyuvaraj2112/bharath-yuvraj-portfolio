export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skillsCovered: string[];
  certificateUrl?: string;
  isPlaceholder: boolean;
}

export const certificationsData: Certification[] = [
  {
    id: "cert-python-ai",
    title: "Python for Data Science & Machine Learning",
    issuer: "Online Learning Platform [Editable Placeholder]",
    date: "2024",
    skillsCovered: ["Python", "NumPy", "Pandas", "Matplotlib", "Data Analysis"],
    certificateUrl: "#placeholder-certificate-link",
    isPlaceholder: true,
  },
  {
    id: "cert-web-dev",
    title: "Full Stack Web Development Essentials",
    issuer: "Developer Community Certification [Editable Placeholder]",
    date: "2024",
    skillsCovered: ["HTML5", "CSS3", "JavaScript ES6+", "React", "Git"],
    certificateUrl: "#placeholder-certificate-link",
    isPlaceholder: true,
  },
  {
    id: "cert-dsa-fundamentals",
    title: "Data Structures & Algorithmic Problem Solving",
    issuer: "Technical Academy [Editable Placeholder]",
    date: "2023",
    skillsCovered: ["Data Structures", "Algorithms", "Time Complexity", "Arrays & Trees"],
    certificateUrl: "#placeholder-certificate-link",
    isPlaceholder: true,
  },
];
