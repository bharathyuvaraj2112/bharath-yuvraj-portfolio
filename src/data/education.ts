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

export const educationData: EducationItem[] = [
  {
    id: "btech-aiml",
    degree: "Bachelor of Technology (B.Tech)",
    fieldOfStudy: "Artificial Intelligence & Machine Learning",
    institution: "University / Institute Name [Editable Placeholder]",
    period: "2023 - 2027 (Expected)",
    status: "Currently Pursuing",
    gradeOrGpa: "First Class with Distinction (Target)",
    location: "India",
    relevantCoursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming (Java / C++)",
      "Machine Learning Fundamentals",
      "Database Management Systems (DBMS)",
      "Operating Systems & Computer Networks",
      "Mathematics & Linear Algebra for AI",
    ],
    description:
      "Deeply engaged in AI/ML coursework, algorithms, and practical software engineering projects. Active participant in coding clubs and technical workshops.",
  },
  {
    id: "intermediate-12th",
    degree: "Intermediate / Higher Secondary (Class XII)",
    fieldOfStudy: "MPC (Mathematics, Physics, Chemistry)",
    institution: "Junior College / School Name [Editable Placeholder]",
    period: "2021 - 2023",
    status: "Completed",
    gradeOrGpa: "First Class with Distinction",
    location: "India",
    relevantCoursework: [
      "Higher Mathematics & Calculus",
      "Physics & Mechanics",
      "Chemistry & Problem Solving",
      "Computer Science / Logic Fundamentals",
    ],
    description:
      "Completed higher secondary education with a strong analytical focus on Mathematics, Physics, and foundational problem-solving principles.",
  },
  {
    id: "school-10th",
    degree: "Secondary School Certificate (Class X)",
    fieldOfStudy: "General Science & Mathematics",
    institution: "High School Name [Editable Placeholder]",
    period: "2020 - 2021",
    status: "Completed",
    gradeOrGpa: "Distinction",
    location: "India",
    relevantCoursework: [
      "Mathematics & Algebra",
      "General Science & Physics",
      "Social Studies & Humanities",
      "English & Communication",
    ],
    description:
      "Completed secondary schooling with distinction, participating actively in academic competitions, science fairs, and extracurriculars.",
  },
];
