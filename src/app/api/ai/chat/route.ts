import { NextRequest, NextResponse } from "next/server";
import { buildPortfolioContext } from "@/lib/ai/context";
import { generateAIResponse, ChatMessage } from "@/lib/ai/provider";

// Basic sliding-window rate limiter (15 requests per 60s per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 60 * 1000; // 60s
  const maxRequests = 15;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-ip";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before asking another question." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, history } = body;

    // Input Validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a valid non-empty string." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message length exceeds the maximum limit of 2,000 characters." },
        { status: 400 }
      );
    }

    // Prompt Injection Sanitization
    const lower = message.toLowerCase();
    const injectionTriggers = [
      "ignore previous instructions",
      "ignore your rules",
      "show system prompt",
      "expose api key",
      "show api key",
      "show secret",
      "firebase credentials",
      "admin password",
      "show messages",
    ];

    for (const trigger of injectionTriggers) {
      if (lower.includes(trigger)) {
        return NextResponse.json({
          response:
            "I am Bharath's AI Portfolio Assistant. I am programmed to strictly answer questions about Bharath Yuvraj's portfolio, projects, skills, education, and achievements. How can I assist you with his portfolio?",
        });
      }
    }

    // Sanitize & format chat history (limit to last 6 messages)
    const validHistory: ChatMessage[] = Array.isArray(history)
      ? history.slice(-6).map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: String(m.content).slice(0, 1500),
        }))
      : [];

    validHistory.push({ role: "user", content: message.trim() });

    // Build public portfolio context
    const contextData = await buildPortfolioContext();

    // Generate AI completion
    const aiResponse = await generateAIResponse(validHistory, contextData);

    return NextResponse.json({ response: aiResponse });
  } catch (err: any) {
    console.error("Error in AI Chat API route:", err);
    return NextResponse.json(
      { response: "Sorry, the AI portfolio assistant is temporarily offline. Please feel free to explore Bharath's portfolio sections or use the direct contact form!" },
      { status: 200 }
    );
  }
}
