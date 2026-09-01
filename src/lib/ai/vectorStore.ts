import { AIDocument, SearchResult } from "./types";
import { tokenizeText, generateSparseVector, calculateCosineSimilarity } from "./embeddings";
import { getProjectsFromFirestore } from "@/lib/firebase/projects";
import { getSkillsFromFirestore } from "@/lib/firebase/skills";
import { getCertificationsFromFirestore } from "@/lib/firebase/certifications";
import { getAchievementsFromFirestore } from "@/lib/firebase/achievements";
import { getEducationFromFirestore } from "@/lib/firebase/education";
import { getProfileFromFirestore } from "@/lib/firebase/profile";

let cachedDocuments: AIDocument[] = [];
let cachedVocabulary: string[] = [];
let lastBuildTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache TTL

/**
 * Builds normalized AIDocument array from Firestore/static public portfolio data
 */
export async function getNormalizedPortfolioDocuments(): Promise<AIDocument[]> {
  const now = Date.now();
  if (cachedDocuments.length > 0 && now - lastBuildTime < CACHE_TTL_MS) {
    return cachedDocuments;
  }

  const [profile, projects, skills, certs, achievements, education] = await Promise.all([
    getProfileFromFirestore(),
    getProjectsFromFirestore(),
    getSkillsFromFirestore(),
    getCertificationsFromFirestore(),
    getAchievementsFromFirestore(),
    getEducationFromFirestore(),
  ]);

  const docs: AIDocument[] = [];

  // Profile Document
  docs.push({
    id: "profile-main",
    type: "profile",
    title: `${profile.name} - ${profile.title}`,
    content: `${profile.name} is a ${profile.title}. Location: ${profile.location}. Email: ${profile.email}. Bio: ${profile.bio || profile.shortBio}. Status: ${profile.statusText || profile.availabilityStatus}.`,
    source: "profile",
    metadata: { name: profile.name, email: profile.email, github: profile.githubUrl || profile.socials.github },
    updatedAt: new Date().toISOString(),
  });

  // Projects Documents
  projects.forEach((p) => {
    docs.push({
      id: `project-${p.id}`,
      type: "project",
      title: p.title,
      content: `Project Title: ${p.title}. Category: ${p.category}. Status: ${p.statusBadge}. Description: ${p.description}. Technologies: ${p.technologies.join(", ")}. Overview: ${p.overview || ""}. Problem: ${p.problem || ""}. Solution: ${p.solution || ""}. Key Features: ${p.keyFeatures?.join(", ") || ""}.`,
      source: "projects",
      metadata: { id: p.id, title: p.title, category: p.category, githubUrl: p.githubUrl, liveUrl: p.liveUrl },
      updatedAt: new Date().toISOString(),
    });
  });

  // Skills Documents
  skills.forEach((cat) => {
    const skillList = cat.skills.map((s) => `${s.name} (${s.proficiency})`).join(", ");
    docs.push({
      id: `skill-${cat.id}`,
      type: "skill",
      title: `Skills in ${cat.title}`,
      content: `Technical Skills Category: ${cat.title}. Competencies: ${skillList}.`,
      source: "skills",
      metadata: { category: cat.title, skillsCount: cat.skills.length },
      updatedAt: new Date().toISOString(),
    });
  });

  // Education Documents
  education.forEach((edu) => {
    docs.push({
      id: `education-${edu.id}`,
      type: "education",
      title: `${edu.degree} - ${edu.fieldOfStudy}`,
      content: `Education: ${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution} (${edu.location}). Time period: ${edu.period}. Status: ${edu.status}. Grade/GPA: ${edu.gradeOrGpa || "N/A"}. Key Coursework: ${edu.relevantCoursework.join(", ")}. Description: ${edu.description}`,
      source: "education",
      metadata: { id: edu.id, degree: edu.degree, institution: edu.institution },
      updatedAt: new Date().toISOString(),
    });
  });

  // Certification Documents
  certs.forEach((cert) => {
    docs.push({
      id: `cert-${cert.id}`,
      type: "certification",
      title: cert.title,
      content: `Certification Credential: ${cert.title} issued by ${cert.issuer} (${cert.date || cert.issueDate}). Skills Validated: ${cert.skillsCovered.join(", ")}. Description: ${cert.description || ""}.`,
      source: "certifications",
      metadata: { id: cert.id, issuer: cert.issuer, credentialUrl: cert.credentialUrl },
      updatedAt: new Date().toISOString(),
    });
  });

  // Achievement Documents
  achievements.forEach((ach) => {
    docs.push({
      id: `achievement-${ach.id}`,
      type: "achievement",
      title: ach.title,
      content: `Achievement Milestone: ${ach.title} [${ach.category}] (${ach.date}). Description: ${ach.description}. Metric: ${ach.metric || ""}. Tag: ${ach.tag || ""}.`,
      source: "achievements",
      metadata: { id: ach.id, category: ach.category, metric: ach.metric },
      updatedAt: new Date().toISOString(),
    });
  });

  // Build Global Vocabulary for Vector Space
  const vocabSet = new Set<string>();
  docs.forEach((doc) => {
    tokenizeText(`${doc.title} ${doc.content}`).forEach((term) => vocabSet.add(term));
  });

  cachedVocabulary = Array.from(vocabSet);
  cachedDocuments = docs.map((doc) => ({
    ...doc,
    embedding: generateSparseVector(`${doc.title} ${doc.content}`, cachedVocabulary),
  }));

  lastBuildTime = now;
  return cachedDocuments;
}

/**
 * Performs vector similarity search over normalized portfolio documents
 */
export async function performSemanticSearch(
  query: string,
  topK: number = 4,
  minScore: number = 0.05
): Promise<SearchResult[]> {
  const docs = await getNormalizedPortfolioDocuments();
  if (!query || query.trim().length === 0 || docs.length === 0) return [];

  const queryVector = generateSparseVector(query, cachedVocabulary);

  const results: SearchResult[] = docs
    .map((doc) => {
      const score = doc.embedding
        ? calculateCosineSimilarity(queryVector, doc.embedding)
        : 0;
      return { document: doc, score };
    })
    .filter((res) => res.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}

/**
 * Clears document cache to force immediate index refresh on admin changes
 */
export function invalidateAIIndexCache(): void {
  cachedDocuments = [];
  cachedVocabulary = [];
  lastBuildTime = 0;
}
