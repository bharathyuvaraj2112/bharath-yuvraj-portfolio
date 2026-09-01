export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  period: string;
  status: string;
  gradeOrGpa?: string;
  location: string;
  relevantCoursework: string[];
  description: string;
}

export const educationData: EducationItem[] = [];
