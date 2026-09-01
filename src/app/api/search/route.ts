import { NextRequest, NextResponse } from "next/server";
import { performSemanticSearch } from "@/lib/ai/vectorStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ query: "", results: [] });
    }

    const results = await performSemanticSearch(query, 6, 0.02);

    const formattedResults = results.map((res) => ({
      id: res.document.id,
      type: res.document.type,
      title: res.document.title,
      content: res.document.content,
      source: res.document.source,
      score: res.score,
      metadata: res.document.metadata,
    }));

    return NextResponse.json({
      query,
      resultsCount: formattedResults.length,
      results: formattedResults,
    });
  } catch (err: any) {
    console.error("Semantic search API error:", err);
    return NextResponse.json({ error: "Failed to perform search." }, { status: 500 });
  }
}
