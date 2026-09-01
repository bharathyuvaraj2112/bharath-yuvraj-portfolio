import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptType, currentText, topic } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic or title is required for content generation." },
        { status: 400 }
      );
    }

    let instruction = "";
    if (promptType === "project_description") {
      instruction = `Generate a compelling, professional 2-3 sentence project description for a developer portfolio project titled "${topic}". Existing draft: "${currentText || "None"}". Highlight technical problem solved and tech stack used.`;
    } else if (promptType === "improve_text") {
      instruction = `Polish and improve the following technical description to sound more professional, clear, and impactful for a developer portfolio: "${currentText}". Keep it under 100 words.`;
    } else if (promptType === "bio_summary") {
      instruction = `Draft a modern 3-sentence professional bio summary for an AI & Machine Learning student and Full Stack Developer named Bharath Yuvraj. Focus on building intelligent web applications, problem solving, and continuous learning.`;
    } else {
      instruction = `Provide a concise, professional technical summary for "${topic}". Draft: "${currentText || ""}".`;
    }

    const aiSuggestion = await generateAIResponse(
      [{ role: "user", content: instruction }],
      "You are an expert technical editor creating clean, accurate developer portfolio copy."
    );

    return NextResponse.json({
      success: true,
      promptType,
      topic,
      suggestion: aiSuggestion,
      requiresAdminReview: true,
    });
  } catch (err: any) {
    console.error("Admin AI generator API error:", err);
    return NextResponse.json(
      { error: "Failed to generate AI suggestion." },
      { status: 500 }
    );
  }
}
