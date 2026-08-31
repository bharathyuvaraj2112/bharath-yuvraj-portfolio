export interface Achievement {
  id: string;
  title: string;
  category: "Academic" | "Hackathon" | "Coding" | "Learning Milestone" | string;
  date: string;
  description: string;
  tag?: string;
  metric?: string;
  link?: string;
  isPlaceholder?: boolean;
}

export const achievementsData: Achievement[] = [
  {
    id: "achievement-hackathon",
    title: "College Tech Hackathon Participant / Finalist",
    category: "Hackathon",
    date: "2024",
    description:
      "Collaborated with a 3-member team to design and build a working software prototype within a 24-hour hackathon duration. Focused on frontend design and rapid API integration.",
    tag: "Team Collaboration",
    metric: "Finalist",
    isPlaceholder: true,
  },
  {
    id: "achievement-dsa-milestone",
    title: "100+ Algorithmic Problems Solved",
    category: "Coding",
    date: "2024",
    description:
      "Consistently practicing fundamental Data Structures & Algorithms on platforms like LeetCode and HackerRank to strengthen problem-solving speed and code efficiency.",
    tag: "Problem Solving",
    metric: "100+ Solved",
    isPlaceholder: true,
  },
  {
    id: "achievement-academic",
    title: "Consistent Academic Standing in AI/ML Track",
    category: "Academic",
    date: "2023 - Present",
    description:
      "Maintained strong coursework performance in core engineering subjects including Mathematics, Data Structures, and Computer Systems.",
    tag: "Academics",
    metric: "Top Percentile",
    isPlaceholder: true,
  },
  {
    id: "achievement-portfolio-launch",
    title: "Built Production-Grade Developer Portfolio",
    category: "Learning Milestone",
    date: "2026",
    description:
      "Engineered a full responsive frontend design system with Next.js, React, TypeScript, and Tailwind CSS, structured for cloud integration.",
    tag: "Engineering",
    metric: "Production Live",
    isPlaceholder: false,
  },
];
