import { NextRequest, NextResponse } from "next/server";
import { performSemanticSearch } from "@/lib/ai/vectorStore";
import { getProjectsFromFirestore } from "@/lib/firebase/projects";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interest } = body;

    if (!interest || typeof interest !== "string" || interest.trim().length === 0) {
      return NextResponse.json(
        { error: "Please specify your tech interest or project requirements." },
        { status: 400 }
      );
    }

    // Perform vector semantic search over portfolio documents specifically filtering for type "project"
    const searchResults = await performSemanticSearch(interest, 5, 0.01);
    const matchedProjectDocs = searchResults.filter((res) => res.document.type === "project");

    const allProjects = await getProjectsFromFirestore();

    let recommendedProjects = [];
    if (matchedProjectDocs.length > 0) {
      recommendedProjects = matchedProjectDocs.map((res) => {
        const fullProj = allProjects.find((p) => p.id === res.document.metadata.id);
        return {
          id: res.document.metadata.id,
          title: res.document.title,
          category: res.document.metadata.category,
          score: res.score,
          description: fullProj?.description || res.document.content,
          technologies: fullProj?.technologies || [],
          githubUrl: fullProj?.githubUrl,
          liveUrl: fullProj?.liveUrl,
        };
      });
    } else {
      // Fallback: return top 2 featured projects
      recommendedProjects = allProjects.slice(0, 2).map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        score: 0.5,
        description: p.description,
        technologies: p.technologies,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
      }));
    }

    return NextResponse.json({
      interest,
      count: recommendedProjects.length,
      recommendations: recommendedProjects,
    });
  } catch (err: any) {
    console.error("Project recommendation API error:", err);
    return NextResponse.json({ error: "Failed to generate recommendations." }, { status: 500 });
  }
}
