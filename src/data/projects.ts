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

export const projectsData: Project[] = [
  {
    id: "accident-detect-alert",
    title: "Accident Detect Alert",
    tagline: "IoT Emergency Vehicle Collision Detection System",
    description:
      "An emergency accident detection and alert prototype using sensors, GPS/GSM communication, and an Arduino-based microcontroller system for immediate emergency notification.",
    category: "Hardware / IoT",
    status: "Prototype",
    statusBadge: "Hardware Prototype",
    isConceptOrPlaceholder: false,
    technologies: ["Arduino", "MPU6050", "GPS", "GSM", "C/C++"],
    githubUrl: "https://github.com/bharathyuvraj-placeholder/accident-detect-alert",
    featured: true,
    imageVisualType: "accident",
    overview:
      "Accident Detect Alert is a hardware safety system engineered to significantly reduce emergency response times after vehicular accidents. Utilizing an MPU6050 accelerometer and gyroscope, the system monitors impact forces and tilt angles in real time.",
    problem:
      "Delayed emergency aid during highway or night-time vehicle accidents often leads to preventable fatalities due to lack of immediate reporting.",
    solution:
      "Integrated an Arduino microcontroller with an MPU6050 sensor to detect rapid deceleration or vehicle rollover, triggering an automated GSM alert containing precise GPS coordinates sent directly to emergency contacts.",
    keyFeatures: [
      "Real-time g-force and tilt angle monitoring via MPU6050 sensor",
      "Automated SMS alert dispatch with live Google Maps GPS coordinates",
      "False alarm cancellation switch with timed buzzer countdown",
      "Low power consumption hardware design suitable for vehicle battery integration",
    ],
  },
  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    tagline: "Intelligent Learning Companion & Note Summarizer",
    description:
      "An AI-powered study application concept designed to help students interact with complex course material, generate smart flashcards, and organize their learning workflow.",
    category: "AI / ML",
    status: "Concept",
    statusBadge: "Application Concept",
    isConceptOrPlaceholder: true,
    technologies: ["Next.js", "React", "Firebase", "AI API"],
    githubUrl: "https://github.com/bharathyuvraj-placeholder/ai-study-assistant",
    liveUrl: "https://ai-study-assistant-demo.placeholder.app",
    featured: true,
    imageVisualType: "study",
    overview:
      "AI Study Assistant is a modern productivity concept empowering students to upload lecture slides, PDF notes, or textbook extracts and turn them into interactive quiz questions and concise revision summaries.",
    problem:
      "Students often spend more time organizing notes and creating study materials than actively learning and retaining knowledge.",
    solution:
      "Designed a clean Next.js frontend integrated with Generative AI APIs to digest dense academic documents, automatically generating smart summaries, active-recall flashcards, and interactive Q&A interfaces.",
    keyFeatures: [
      "AI-driven key concept extraction & automated bullet point summary",
      "Interactive flashcard generation with spaced repetition tracking",
      "Contextual document Q&A chat interface",
      "Clean dashboard UI for organizing course subjects",
    ],
  },
  {
    id: "ai-resume-analyzer",
    title: "AI Resume Analyzer",
    tagline: "ATS Score Evaluator & Career Feedback Tool",
    description:
      "A web application concept that analyzes resumes, checks formatting against job descriptions, and provides structured AI feedback for improving clarity and ATS compatibility.",
    category: "AI / ML",
    status: "Concept",
    statusBadge: "Application Concept",
    isConceptOrPlaceholder: true,
    technologies: ["Next.js", "React", "AI API", "Firebase"],
    githubUrl: "https://github.com/bharathyuvraj-placeholder/ai-resume-analyzer",
    featured: true,
    imageVisualType: "resume",
    overview:
      "AI Resume Analyzer is a developer tool concept built to bridge the gap between candidate resumes and Applicant Tracking Systems (ATS).",
    problem:
      "Job applicants often fail initial recruiter screenings due to poor resume formatting, missing keyword alignment, or vague impact statements.",
    solution:
      "Created an intuitive Next.js application that parses user-submitted resume content, runs intelligent keyword and layout analysis via AI models, and produces an actionable diagnostic report with improvement tips.",
    keyFeatures: [
      "Instant ATS score calculation based on target job description alignment",
      "Action-verb & impact statement optimization recommendations",
      "Section-by-section breakdown (Skills, Work Experience, Projects)",
      "Dark/Light mode accessible interface with exportable PDF report outline",
    ],
  },
  {
    id: "developer-portfolio",
    title: "Developer Portfolio",
    tagline: "Modern High-Performance Personal Web Showcase",
    description:
      "A modern AI-assisted developer portfolio built with Next.js, TypeScript, and Tailwind CSS designed for production deployment and cloud database integration.",
    category: "Full Stack",
    status: "Completed",
    statusBadge: "Frontend Live (Phase 1)",
    isConceptOrPlaceholder: false,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Vercel"],
    githubUrl: "https://github.com/bharathyuvraj-placeholder/developer-portfolio",
    liveUrl: "https://bharathyuvraj.vercel.app",
    featured: true,
    imageVisualType: "portfolio",
    overview:
      "A clean, responsive personal website engineered to highlight technical projects, skills, education, and achievements for recruiters and tech collaborators.",
    problem:
      "Generic template portfolios lack personal branding, modern micro-interactions, dark mode aesthetics, and clear technical project details.",
    solution:
      "Engineered a scalable Next.js architecture with TypeScript, Tailwind CSS v4, custom smooth animations, interactive project modals, accessibility standards, and clean data structures ready for future Firebase integration.",
    keyFeatures: [
      "Dynamic dark/light theme switching with custom color tokens",
      "Interactive project filtering & full detailed modal view",
      "Mobile-first responsive navigation bar with smooth active-link tracking",
      "Clean modular code structure ready for Firestore database hooks",
    ],
  },
];
