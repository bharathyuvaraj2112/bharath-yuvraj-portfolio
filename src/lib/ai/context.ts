import { getProjectsFromFirestore } from "@/lib/firebase/projects";
import { getSkillsFromFirestore } from "@/lib/firebase/skills";
import { getCertificationsFromFirestore } from "@/lib/firebase/certifications";
import { getAchievementsFromFirestore } from "@/lib/firebase/achievements";
import { getEducationFromFirestore } from "@/lib/firebase/education";
import { getProfileFromFirestore } from "@/lib/firebase/profile";

export async function buildPortfolioContext(): Promise<string> {
  try {
    const [profile, projects, skills, certs, achievements, education] = await Promise.all([
      getProfileFromFirestore(),
      getProjectsFromFirestore(),
      getSkillsFromFirestore(),
      getCertificationsFromFirestore(),
      getAchievementsFromFirestore(),
      getEducationFromFirestore(),
    ]);

    let context = `=== BIOGRAPHY & PROFILE ===\n`;
    context += `Name: ${profile.name}\n`;
    context += `Title: ${profile.title}\n`;
    context += `Status: ${profile.statusText || profile.availabilityStatus}\n`;
    context += `Location: ${profile.location}\n`;
    context += `Email: ${profile.email}\n`;
    context += `GitHub: ${profile.githubUrl || profile.socials.github}\n`;
    context += `LinkedIn: ${profile.linkedinUrl || profile.socials.linkedin}\n`;
    context += `Bio Summary: ${profile.bio || profile.shortBio}\n\n`;

    context += `=== FEATURED PROJECTS ===\n`;
    projects.forEach((p, idx) => {
      context += `${idx + 1}. Title: ${p.title}\n`;
      context += `   Category: ${p.category} | Status: ${p.statusBadge}\n`;
      context += `   Description: ${p.description}\n`;
      context += `   Technologies: ${p.technologies.join(", ")}\n`;
      if (p.overview) context += `   Overview: ${p.overview}\n`;
      if (p.problem) context += `   Problem: ${p.problem}\n`;
      if (p.solution) context += `   Solution: ${p.solution}\n`;
      if (p.githubUrl) context += `   GitHub Link: ${p.githubUrl}\n`;
      if (p.liveUrl) context += `   Live Demo Link: ${p.liveUrl}\n`;
      context += `\n`;
    });

    context += `=== SKILLS & TECHNICAL COMPETENCIES ===\n`;
    skills.forEach((cat) => {
      context += `Category: ${cat.title}\n`;
      const skillList = cat.skills.map((s) => `${s.name} (${s.proficiency})`).join(", ");
      context += `   Skills: ${skillList}\n`;
    });
    context += `\n`;

    context += `=== EDUCATION TIMELINE ===\n`;
    education.forEach((edu) => {
      context += `- Degree: ${edu.degree} in ${edu.fieldOfStudy}\n`;
      context += `  Institution: ${edu.institution} (${edu.location})\n`;
      context += `  Period: ${edu.period} | Status: ${edu.status}\n`;
      context += `  Coursework: ${edu.relevantCoursework.join(", ")}\n`;
    });
    context += `\n`;

    context += `=== CERTIFICATIONS & CREDENTIALS ===\n`;
    certs.forEach((cert) => {
      context += `- ${cert.title} issued by ${cert.issuer} (${cert.date || cert.issueDate})\n`;
      context += `  Skills Validated: ${cert.skillsCovered.join(", ")}\n`;
      if (cert.credentialUrl) context += `  Credential Link: ${cert.credentialUrl}\n`;
    });
    context += `\n`;

    context += `=== ACHIEVEMENTS & MILESTONES ===\n`;
    achievements.forEach((ach) => {
      context += `- ${ach.title} [${ach.category}] (${ach.date}): ${ach.description}\n`;
    });

    return context;
  } catch (err) {
    console.error("Error building portfolio context for AI:", err);
    return "Bharath Yuvraj is an AI & Machine Learning student and Full Stack Developer skilled in Next.js, React, TypeScript, Tailwind CSS, Python, and Machine Learning.";
  }
}
