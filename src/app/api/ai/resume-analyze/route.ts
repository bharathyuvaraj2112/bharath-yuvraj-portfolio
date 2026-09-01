import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/provider";
import { getSkillsFromFirestore } from "@/lib/firebase/skills";
import { getProjectsFromFirestore } from "@/lib/firebase/projects";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide a valid resume text or PDF content to analyze." },
        { status: 400 }
      );
    }

    if (resumeText.length > 10000) {
      return NextResponse.json(
        { error: "Resume text exceeds maximum analysis limit of 10,000 characters." },
        { status: 400 }
      );
    }

    // Fetch public skill & project data to assess candidate keyword alignment
    const [skills, projects] = await Promise.all([
      getSkillsFromFirestore(),
      getProjectsFromFirestore(),
    ]);

    const candidateSkills = skills.flatMap((c) => c.skills.map((s) => s.name)).join(", ");
    const candidateProjects = projects.map((p) => `${p.title} (${p.technologies.join(", ")})`).join("; ");

    const analysisPrompt = `You are an expert AI Career Coach & Technical Recruiter evaluating a resume for software engineering, AI/ML, and full-stack positions.

CANDIDATE TARGET TECH STACK & PORTFOLIO BACKGROUND:
Skills: ${candidateSkills}
Projects: ${candidateProjects}

RESUME CONTENT TO EVALUATE:
"""
${resumeText.slice(0, 4000)}
"""

Please provide a concise, structured evaluation in clean Markdown formatted as:
1. **Overall Alignment & Estimated Strengths**
2. **Key Technical Skills Identified**
3. **ATS Readability & Keyword Highlights**
4. **Matched Portfolio Relevance**
5. **Actionable Suggestions for Improvement**

Maintain a helpful, objective, professional tone. Do NOT claim to be an official automated ATS scoring system for any single company.`;

    const aiFeedback = await generateAIResponse(
      [{ role: "user", content: "Analyze this resume for technical engineering alignment." }],
      analysisPrompt
    );

    return NextResponse.json({
      success: true,
      analysis: aiFeedback,
    });
  } catch (err: any) {
    console.error("Resume analysis API error:", err);
    return NextResponse.json(
      { error: "Failed to process resume analysis. Please try again." },
      { status: 500 }
    );
  }
}
