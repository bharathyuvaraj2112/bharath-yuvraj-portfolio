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

export const achievementsData: Achievement[] = [];
