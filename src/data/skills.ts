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

export const skillCategories: SkillCategory[] = [];
